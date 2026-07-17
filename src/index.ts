import { buildStartedHtml, errorHtml, htmlResponse, recoveryHtml } from "./ui";

type Env = {
  HQBASE_WORKER_NAME?: string;
  HQBASE_BILLING_URL?: string;
  CLOUDFLARE_OAUTH_CLIENT_ID?: string;
  CLOUDFLARE_OAUTH_RELAY_URL?: string;
  CLOUDFLARE_OAUTH_REDIRECT_URI?: string;
};
type InstallInput = {
  licenseKey: string;
  mode: "fresh" | "recovery";
};
type CfEnvelope<T> = {
  success: boolean;
  result: T;
  errors?: Array<{ message?: string }>;
};
type OAuthToken = {
  access_token?: string;
  error?: string;
  error_description?: string;
};
const VERIFIER_COOKIE = "hqb_oauth_verifier";
const STATE_COOKIE = "hqb_oauth_state";
const DRAFT_COOKIE = "hqb_install_draft";
const CLAIM_VERIFIER_COOKIE = "hqb_claim_verifier";
const CLAIM_STATE_COOKIE = "hqb_claim_state";
const PROGRESS_COOKIE = "hqb_build_progress";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    try {
      if (url.pathname === "/health" || url.pathname === "/api/health")
        return Response.json(
          { ok: true, service: "hqbase-pro-installer" },
          { headers: { "cache-control": "no-store" } },
        );
      if (url.pathname === "/recover" && request.method === "GET")
        return htmlResponse(recoveryHtml());
      if (url.pathname === "/install/progress" && request.method === "GET")
        return progressResponse(request);
      if (url.pathname === "/api/install/start" && request.method === "GET")
        return await startInstallClaim(request, env);
      if (url.pathname === "/api/install/callback" && request.method === "GET")
        return await finishInstallClaim(request, env);
      if (url.pathname === "/api/oauth/start" && request.method === "POST")
        return await startOAuth(request, env);
      if (url.pathname === "/api/oauth/callback" && request.method === "GET")
        return await finishOAuth(request, env);
      if (url.pathname !== "/")
        return new Response("Not found", { status: 404 });
      const progressBuildId = readProgressBuildId(request);
      return new Response(null, {
        status: 303,
        headers: {
          location: progressBuildId
            ? "/install/progress"
            : "/api/install/start",
          "cache-control": "no-store",
        },
      });
    } catch (error) {
      return installerErrorResponse(
        request,
        "install_failed",
        "Installation could not continue",
        publicUnexpectedError(error),
        502,
      );
    }
  },
};

export async function startOAuth(
  request: Request,
  env: Env,
): Promise<Response> {
  const contentType = request.headers.get("content-type") ?? "";
  let input: Partial<InstallInput>;
  if (contentType.includes("application/json")) {
    input = (await request.json()) as Partial<InstallInput>;
  } else {
    const form = await request.formData();
    const licenseKey = form.get("licenseKey");
    input = {
      ...(typeof licenseKey === "string" ? { licenseKey } : {}),
      mode: "recovery",
    };
  }
  const licenseKey = input.licenseKey?.trim().toUpperCase() ?? "";
  const invalidLicense = licenseKey.length < 12;
  if (invalidLicense) {
    const message = "Enter a valid Polar license key.";
    if (requestWantsJson(request))
      return Response.json(
        { error: "invalid_input", message },
        { status: 400 },
      );
    return htmlResponse(
      recoveryHtml({
        error: message,
        invalidLicense,
      }),
      400,
    );
  }
  return beginCloudflareOAuth(request, env, {
    licenseKey,
    mode: "recovery",
  });
}

export async function startInstallClaim(
  request: Request,
  env: Env,
): Promise<Response> {
  const verifier = randomBase64Url(64);
  const state = randomBase64Url(32);
  const billing = new URL("/v1/install/authorize", billingUrl(env));
  billing.searchParams.set(
    "callback",
    `${new URL(request.url).origin}/api/install/callback`,
  );
  billing.searchParams.set("state", state);
  billing.searchParams.set("code_challenge", await sha256Base64Url(verifier));
  const headers = new Headers({
    location: billing.toString(),
    "cache-control": "no-store",
  });
  headers.append("set-cookie", secureCookie(CLAIM_VERIFIER_COOKIE, verifier));
  headers.append("set-cookie", secureCookie(CLAIM_STATE_COOKIE, state));
  return new Response(null, { status: 303, headers });
}

export async function finishInstallClaim(
  request: Request,
  env: Env,
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  const url = new URL(request.url);
  if (url.searchParams.get("error")) {
    return installClaimErrorResponse(
      url.searchParams.get("error") === "license_pending"
        ? "Your Polar license is still being created. Try the purchase handoff again in a moment."
        : "The purchase session is missing or expired. Start the purchase handoff again.",
    );
  }
  const cookies = parseCookies(request.headers.get("cookie"));
  const verifier = cookies.get(CLAIM_VERIFIER_COOKIE) ?? "";
  const expectedState = cookies.get(CLAIM_STATE_COOKIE) ?? "";
  const code = url.searchParams.get("code") ?? "";
  if (
    !verifier ||
    !expectedState ||
    url.searchParams.get("state") !== expectedState ||
    !code
  ) {
    return installClaimErrorResponse(
      "The purchase session is invalid or expired. Start the purchase handoff again.",
    );
  }
  const callback = `${url.origin}/api/install/callback`;
  const response = await fetcher(
    new URL("/v1/install/token", billingUrl(env)),
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code, codeVerifier: verifier, callback }),
    },
  );
  const claim = (await response.json()) as {
    licenseKey?: string;
    mode?: string;
  };
  if (!response.ok || !claim.licenseKey || claim.mode !== "fresh") {
    return installClaimErrorResponse(
      "The fresh-install claim is invalid or expired. Start the purchase handoff again.",
    );
  }
  const result = await beginCloudflareOAuth(request, env, {
    licenseKey: claim.licenseKey,
    mode: "fresh",
  });
  const headers = new Headers(result.headers);
  headers.append("set-cookie", secureCookie(CLAIM_VERIFIER_COOKIE, "", 0));
  headers.append("set-cookie", secureCookie(CLAIM_STATE_COOKIE, "", 0));
  return new Response(result.body, { status: result.status, headers });
}

async function beginCloudflareOAuth(
  request: Request,
  env: Env,
  input: InstallInput,
): Promise<Response> {
  const config = oauthConfig(env);
  const verifier = randomBase64Url(64);
  const state = randomBase64Url(32);
  const draft = await encryptDraft(input, verifier);
  const relay = new URL("/oauth/authorize", config.relayUrl);
  relay.searchParams.set(
    "callback",
    `${new URL(request.url).origin}/api/oauth/callback`,
  );
  relay.searchParams.set("state", state);
  relay.searchParams.set("code_challenge", await sha256Base64Url(verifier));
  const headers = new Headers({
    location: relay.toString(),
    "cache-control": "no-store",
  });
  headers.append("set-cookie", secureCookie(VERIFIER_COOKIE, verifier));
  headers.append("set-cookie", secureCookie(STATE_COOKIE, state));
  headers.append("set-cookie", secureCookie(DRAFT_COOKIE, draft));
  return new Response(null, { status: 303, headers });
}

export async function finishOAuth(
  request: Request,
  env: Env,
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  const url = new URL(request.url);
  if (url.searchParams.get("error"))
    return installerErrorResponse(
      request,
      "oauth_denied",
      "Cloudflare authorization was not completed",
      "No installation changes were made. Return to the installer and authorize Cloudflare when you are ready.",
      400,
    );
  const cookies = parseCookies(request.headers.get("cookie"));
  const verifier = cookies.get(VERIFIER_COOKIE) ?? "";
  const expectedState = cookies.get(STATE_COOKIE) ?? "";
  const code = url.searchParams.get("code") ?? "";
  if (
    !verifier ||
    !expectedState ||
    url.searchParams.get("state") !== expectedState ||
    !code
  )
    return installerErrorResponse(
      request,
      "invalid_oauth_callback",
      "Authorization session expired",
      "The Cloudflare authorization response is invalid or expired. Return to the installer to begin again.",
      400,
    );
  let input: InstallInput;
  try {
    input = await decryptDraft(cookies.get(DRAFT_COOKIE) ?? "", verifier);
  } catch {
    return installerErrorResponse(
      request,
      "installation_draft_expired",
      "Installation session expired",
      "Your protected installation draft has expired. Return to the installer and enter the license again.",
      400,
    );
  }
  const config = oauthConfig(env);
  const tokenResponse = await fetcher(
    "https://dash.cloudflare.com/oauth2/token",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        code,
        code_verifier: verifier,
      }),
    },
  );
  const token = (await tokenResponse.json()) as OAuthToken;
  if (!tokenResponse.ok || !token.access_token)
    return installerErrorResponse(
      request,
      "oauth_exchange_failed",
      "Cloudflare authorization could not finish",
      "Cloudflare did not complete the authorization exchange. Return to the installer and try again.",
      502,
    );
  let result: Response;
  try {
    result = await install(input, env, token.access_token, fetcher);
  } catch {
    return installerErrorResponse(
      request,
      "cloudflare_setup_failed",
      "Cloudflare setup could not finish",
      "HQBase could not confirm the installation build. Your Cloudflare resources remain in your account; return to the installer to try again.",
      502,
    );
  }
  if (!result.ok) {
    if (requestWantsJson(request)) return result;
    const failure = (await result.json()) as {
      error?: string;
      message?: string;
    };
    const title =
      failure.error === "worker_not_found"
        ? "Deployed Worker not found"
        : failure.error === "build_not_connected"
          ? "Workers Builds is not connected"
          : "Installation could not start";
    return installerErrorResponse(
      request,
      failure.error ?? "install_failed",
      title,
      failure.message ?? "Cloudflare could not start the licensed build.",
      result.status,
    );
  }
  const data = (await result.json()) as { buildId: string };
  const headers = new Headers({
    location: "/install/progress",
    "cache-control": "no-store",
  });
  for (const name of [VERIFIER_COOKIE, STATE_COOKIE, DRAFT_COOKIE])
    headers.append("set-cookie", secureCookie(name, "", 0));
  headers.append(
    "set-cookie",
    secureCookie(PROGRESS_COOKIE, data.buildId, 3600),
  );
  return new Response(null, { status: 303, headers });
}

function progressResponse(request: Request): Response {
  const buildId = readProgressBuildId(request);
  if (buildId) return htmlResponse(buildStartedHtml(buildId));
  return htmlResponse(
    errorHtml({
      title: "Build progress session expired",
      message:
        "This browser no longer has the build progress marker. If the licensed Worker is already active, open this workspace again; otherwise restart the purchase handoff.",
      primaryHref: "/api/install/start",
      primaryLabel: "Restart purchase handoff",
      secondaryHref: "/recover",
      secondaryLabel: "Recover an older purchase",
    }),
    410,
  );
}

function readProgressBuildId(request: Request): string {
  const value =
    parseCookies(request.headers.get("cookie")).get(PROGRESS_COOKIE)?.trim() ??
    "";
  return /^[A-Za-z0-9_-]{1,128}$/.test(value) ? value : "";
}

function installClaimErrorResponse(message: string): Response {
  return htmlResponse(
    errorHtml({
      title: "Purchase handoff could not continue",
      message,
      primaryHref: "/api/install/start",
      primaryLabel: "Try purchase handoff again",
      secondaryHref: "/recover",
      secondaryLabel: "Recover an older purchase",
    }),
    400,
  );
}

export async function install(
  input: InstallInput,
  env: Env,
  accessToken: string,
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  const workerName = env.HQBASE_WORKER_NAME?.trim() ?? "";
  if (!/^[a-z0-9_-]{1,63}$/i.test(workerName)) {
    return Response.json(
      {
        error: "worker_identity_missing",
        message:
          "The deployed Worker identity is unavailable. Redeploy the bootstrap and retry.",
      },
      { status: 409 },
    );
  }
  const headers = {
    authorization: `Bearer ${accessToken}`,
    "content-type": "application/json",
  };
  const accounts = await cf<Array<{ id: string }>>(
    "https://api.cloudflare.com/client/v4/accounts?per_page=50",
    { headers },
    fetcher,
  );
  let accountId = "";
  let workerTag = "";
  for (const account of accounts) {
    const scripts = await cf<Array<{ id: string; tag?: string }>>(
      `https://api.cloudflare.com/client/v4/accounts/${account.id}/workers/scripts`,
      { headers },
      fetcher,
    );
    const script = scripts.find((candidate) => candidate.id === workerName);
    if (script?.tag) {
      accountId = account.id;
      workerTag = script.tag;
      break;
    }
  }
  if (!accountId)
    return Response.json(
      {
        error: "worker_not_found",
        message: "The authorization cannot find that Worker.",
      },
      { status: 404 },
    );
  const triggers = await cf<
    Array<{ trigger_uuid?: string; id?: string; branch_includes?: string[] }>
  >(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/builds/workers/${workerTag}/triggers`,
    { headers },
    fetcher,
  );
  const trigger =
    triggers.find((candidate) => candidate.branch_includes?.includes("main")) ??
    triggers[0];
  const triggerId = trigger?.trigger_uuid ?? trigger?.id;
  if (!triggerId)
    return Response.json(
      {
        error: "build_not_connected",
        message: "Connect the production Worker to Workers Builds first.",
      },
      { status: 409 },
    );
  const variables = await cf<Record<string, { value?: string }>>(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/builds/triggers/${triggerId}/environment_variables`,
    { headers },
    fetcher,
  );
  const installationId =
    variables.HQBASE_INSTALLATION_ID?.value || crypto.randomUUID();
  await cf(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/builds/triggers/${triggerId}/environment_variables`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        HQBASE_PRO_LICENSE_KEY: { value: input.licenseKey, is_secret: true },
        HQBASE_INSTALLATION_ID: { value: installationId, is_secret: false },
        HQBASE_INSTALL_MODE: { value: input.mode, is_secret: false },
        HQBASE_WORKER_NAME: { value: workerName, is_secret: false },
      }),
    },
    fetcher,
  );
  const secrets: Record<string, string> = {
    BETTER_AUTH_SECRET: randomBase64Url(32),
    PRO_APP_PASSWORD_PEPPER: randomBase64Url(32),
    PRO_BRIDGE_TOKEN: randomBase64Url(32),
    PRO_SESSION_SECRET: randomBase64Url(32),
    PRO_ENTITLEMENT_SECRET: randomBase64Url(32),
    PRO_LICENSE_KEY: input.licenseKey,
    HQBASE_SETUP_OAUTH_ACCESS_TOKEN: accessToken,
  };
  for (const [name, text] of Object.entries(secrets))
    await cf(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerName}/secrets`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({ name, text, type: "secret_text" }),
      },
      fetcher,
    );
  const build = await cf<{ build_uuid: string; status?: string }>(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/builds/triggers/${triggerId}/builds`,
    { method: "POST", headers, body: JSON.stringify({ branch: "main" }) },
    fetcher,
  );
  return Response.json(
    {
      buildId: build.build_uuid,
      installationId,
      status: build.status ?? "queued",
    },
    { status: 202 },
  );
}

async function cf<T = unknown>(
  url: string,
  init: RequestInit,
  fetcher: typeof fetch,
): Promise<T> {
  const response = await fetcher(url, init);
  const body = (await response.json()) as CfEnvelope<T>;
  if (!response.ok || !body.success) {
    const message =
      body.errors?.[0]?.message ?? "Cloudflare rejected the request.";
    if (url.includes("/builds/"))
      throw new Error(
        `${message} Cloudflare may not yet allow this OAuth grant for Workers Builds.`,
      );
    throw new Error(message);
  }
  return body.result;
}

function oauthConfig(env: Env) {
  const clientId = env.CLOUDFLARE_OAUTH_CLIENT_ID?.trim();
  const relayUrl = env.CLOUDFLARE_OAUTH_RELAY_URL?.trim();
  const redirectUri = env.CLOUDFLARE_OAUTH_REDIRECT_URI?.trim();
  if (!clientId || !relayUrl || !redirectUri)
    throw new Error("Cloudflare OAuth is not configured for this installer.");
  return { clientId, relayUrl, redirectUri };
}

function billingUrl(env: Env): string {
  return env.HQBASE_BILLING_URL?.trim() || "https://billing.hqbase.io";
}
async function encryptDraft(
  input: InstallInput,
  verifier: string,
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await draftKey(verifier, ["encrypt"]);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(input)),
  );
  return `${base64Url(iv)}.${base64Url(encrypted)}`;
}
async function decryptDraft(
  value: string,
  verifier: string,
): Promise<InstallInput> {
  const [iv, encrypted] = value.split(".");
  if (!iv || !encrypted) throw new Error("The installation draft expired.");
  const key = await draftKey(verifier, ["decrypt"]);
  const clear = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64Url(iv).buffer as ArrayBuffer },
    key,
    fromBase64Url(encrypted).buffer as ArrayBuffer,
  );
  return JSON.parse(new TextDecoder().decode(clear)) as InstallInput;
}
async function draftKey(
  verifier: string,
  usage: KeyUsage[],
): Promise<CryptoKey> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, usage);
}
async function sha256Base64Url(value: string): Promise<string> {
  return base64Url(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
  );
}
function randomBase64Url(size: number): string {
  return base64Url(crypto.getRandomValues(new Uint8Array(size)));
}
function base64Url(value: ArrayBuffer | Uint8Array): string {
  return btoa(String.fromCharCode(...new Uint8Array(value)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}
function fromBase64Url(value: string): Uint8Array {
  const base64 = value
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
}
function parseCookies(value: string | null): Map<string, string> {
  return new Map(
    (value ?? "")
      .split(";")
      .map((part) => part.trim().split("=", 2))
      .filter((entry): entry is [string, string] => entry.length === 2)
      .map(([name, content]) => [name, decodeURIComponent(content)]),
  );
}
function secureCookie(name: string, value: string, maxAge = 600): string {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

function installerErrorResponse(
  request: Request,
  code: string,
  title: string,
  message: string,
  status: number,
): Response {
  if (requestWantsJson(request))
    return Response.json({ error: code, message }, { status });
  return htmlResponse(errorHtml({ title, message }), status);
}

function requestWantsJson(request: Request): boolean {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return true;
  const accept = request.headers.get("accept") ?? "";
  return accept.includes("application/json") && !accept.includes("text/html");
}

function publicUnexpectedError(error: unknown): string {
  if (
    error instanceof Error &&
    error.message === "Cloudflare OAuth is not configured for this installer."
  )
    return error.message;
  return "HQBase Pro could not continue the installation. Return to the installer and try again.";
}
