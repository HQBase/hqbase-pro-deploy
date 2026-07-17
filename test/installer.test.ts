import { describe, expect, it, vi } from "vitest";
import worker, {
  finishInstallClaim,
  finishOAuth,
  install,
  startInstallClaim,
  startOAuth,
} from "../src/index";

const oauthEnv = {
  HQBASE_WORKER_NAME: "hqbase-pro",
  HQBASE_BILLING_URL: "https://billing.hqbase.io",
  CLOUDFLARE_OAUTH_CLIENT_ID: "client",
  CLOUDFLARE_OAUTH_RELAY_URL: "https://auth.hqbase.io",
  CLOUDFLARE_OAUTH_REDIRECT_URI: "https://auth.hqbase.io/oauth/callback",
};

async function oauthSession() {
  const response = await startOAuth(
    new Request("https://installer.test/api/oauth/start", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        licenseKey: "HQB_TEST_LICENSE_KEY",
      }),
    }),
    oauthEnv,
  );
  const headers = response.headers as Headers & {
    getSetCookie(): string[];
  };
  const cookie = headers
    .getSetCookie()
    .map((value) => value.split(";", 1)[0])
    .join("; ");
  const state = new URL(
    response.headers.get("location") ?? "",
  ).searchParams.get("state");
  return { cookie, state };
}

function callbackRequest(session: Awaited<ReturnType<typeof oauthSession>>) {
  return new Request(
    `https://installer.test/api/oauth/callback?code=code&state=${session.state}`,
    { headers: { accept: "text/html", cookie: session.cookie } },
  );
}

function installationFetcher(mode: "success" | "worker" | "build") {
  return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url === "https://dash.cloudflare.com/oauth2/token")
      return Response.json({ access_token: "oauth-access-token" });
    if (url.includes("/accounts?"))
      return Response.json({ success: true, result: [{ id: "account" }] });
    if (url.endsWith("/workers/scripts"))
      return Response.json({
        success: true,
        result:
          mode === "worker" ? [] : [{ id: "hqbase-pro", tag: "worker-tag" }],
      });
    if (url.endsWith("/triggers"))
      return Response.json({
        success: true,
        result:
          mode === "build"
            ? []
            : [{ trigger_uuid: "trigger", branch_includes: ["main"] }],
      });
    if (url.endsWith("/environment_variables") && init?.method !== "PATCH")
      return Response.json({ success: true, result: {} });
    if (url.endsWith("/builds"))
      return Response.json({
        success: true,
        result: { build_uuid: "build-unsafe", status: "queued" },
      });
    return Response.json({ success: true, result: {} });
  });
}

describe("Pro installer", () => {
  it("redirects directly through a purchase-bound install claim", async () => {
    const started = await startInstallClaim(
      new Request("https://custom-pro.workers.dev/api/install/start"),
      oauthEnv,
    );
    expect(started.status).toBe(303);
    const billingLocation = new URL(started.headers.get("location") ?? "");
    expect(billingLocation.origin).toBe("https://billing.hqbase.io");
    expect(billingLocation.pathname).toBe("/v1/install/authorize");
    expect(billingLocation.searchParams.get("callback")).toBe(
      "https://custom-pro.workers.dev/api/install/callback",
    );

    const headers = started.headers as Headers & { getSetCookie(): string[] };
    const cookie = headers
      .getSetCookie()
      .map((value) => value.split(";", 1)[0])
      .join("; ");
    const state = billingLocation.searchParams.get("state");
    const finished = await finishInstallClaim(
      new Request(
        `https://custom-pro.workers.dev/api/install/callback?code=claim-code-123456&state=${state}`,
        { headers: { cookie } },
      ),
      oauthEnv,
      vi.fn(async (input: RequestInfo | URL) => {
        expect(String(input)).toBe(
          "https://billing.hqbase.io/v1/install/token",
        );
        return Response.json({
          licenseKey: "HQB_AUTOMATIC_LICENSE",
          mode: "fresh",
        });
      }) as typeof fetch,
    );
    expect(finished.status).toBe(303);
    const cloudflareLocation = finished.headers.get("location") ?? "";
    expect(cloudflareLocation).toContain("auth.hqbase.io/oauth/authorize");
    expect(cloudflareLocation).not.toContain("HQB_AUTOMATIC_LICENSE");
    expect(finished.headers.get("set-cookie")).toContain("hqb_install_draft=");
  });

  it("rejects every non-fresh purchase claim before Cloudflare authorization", async () => {
    const started = await startInstallClaim(
      new Request("https://custom-pro.workers.dev/api/install/start"),
      oauthEnv,
    );
    const billingLocation = new URL(started.headers.get("location") ?? "");
    const headers = started.headers as Headers & { getSetCookie(): string[] };
    const cookie = headers
      .getSetCookie()
      .map((value) => value.split(";", 1)[0])
      .join("; ");
    const state = billingLocation.searchParams.get("state");
    const finished = await finishInstallClaim(
      new Request(
        `https://custom-pro.workers.dev/api/install/callback?code=claim-code-123456&state=${state}`,
        { headers: { cookie } },
      ),
      oauthEnv,
      vi.fn(async () =>
        Response.json({
          licenseKey: "HQB_AUTOMATIC_LICENSE",
          mode: "unsupported",
        }),
      ) as typeof fetch,
    );
    expect(finished.status).toBe(400);
    const html = await finished.text();
    expect(html).toContain("fresh-install claim is invalid or expired");
    expect(finished.headers.get("location")).toBeNull();
    expect(html).not.toContain('name="licenseKey"');
  });

  it("renders the shared product typography and accessible installer contract", async () => {
    const response = await worker.fetch(
      new Request("https://installer.test/recover"),
      oauthEnv,
    );
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(html).toContain(
      'font-family: "Geist Sans", ui-sans-serif, system-ui, sans-serif;',
    );
    expect(html).toContain('font-family: "Geist Mono", ui-monospace');
    expect(html).toContain('href="/fonts/Geist-Regular.woff2"');
    expect(html).toMatch(
      /button,\s+input,\s+select,\s+textarea \{\s+font: inherit;/,
    );
    expect(html).toContain(":focus-visible");
    expect(html).toContain("min-width: 320px");
    expect(html).toContain("@media (max-width: 480px)");
    expect(html).toContain("min-height: 44px");
    expect(html).not.toContain("eyebrow");
    expect(html).not.toContain("HQBase Pro installer");
    expect(html).not.toContain("Inter");
    expect(html).toContain('<label class="field-label" for="license-key">');
    expect(html).toContain('aria-describedby="license-help"');
    expect(html).toContain('role="status" aria-live="polite"');
    expect(html).toContain('button.textContent = "Opening Cloudflare…"');
    expect(html).not.toContain('name="workerName"');
    expect(html).toContain("The Worker name is detected from this deployment.");
  });

  it("returns associated form errors for invalid browser input", async () => {
    const response = await worker.fetch(
      new Request("https://installer.test/api/oauth/start", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          licenseKey: "short",
        }),
      }),
      oauthEnv,
    );
    const html = await response.text();

    expect(response.status).toBe(400);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(html).toContain('id="form-error" role="alert"');
    expect(html).toContain(
      'aria-describedby="license-help form-error" aria-invalid="true"',
    );
    expect(html).not.toContain('value="short"');
  });

  it("preserves JSON errors for JSON API requests", async () => {
    const invalidInput = await worker.fetch(
      new Request("https://installer.test/api/oauth/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ licenseKey: "short" }),
      }),
      oauthEnv,
    );
    await expect(invalidInput.json()).resolves.toEqual({
      error: "invalid_input",
      message: "Enter a valid Polar license key.",
    });

    const invalidCallback = await worker.fetch(
      new Request("https://installer.test/api/oauth/callback", {
        headers: { accept: "application/json" },
      }),
      oauthEnv,
    );
    expect(invalidCallback.status).toBe(400);
    await expect(invalidCallback.json()).resolves.toMatchObject({
      error: "invalid_oauth_callback",
    });
  });

  it("renders bounded OAuth denial and expired-draft pages", async () => {
    const denied = await worker.fetch(
      new Request(
        "https://installer.test/api/oauth/callback?error=access_denied&error_description=do-not-render-this",
        { headers: { accept: "text/html" } },
      ),
      oauthEnv,
    );
    const deniedHtml = await denied.text();
    expect(denied.status).toBe(400);
    expect(deniedHtml).toContain("Cloudflare authorization was not completed");
    expect(deniedHtml).not.toContain("do-not-render-this");
    expect(deniedHtml).not.toContain("Stack Trace");

    const expired = await worker.fetch(
      new Request(
        "https://installer.test/api/oauth/callback?code=code&state=expected",
        {
          headers: {
            accept: "text/html",
            cookie: "hqb_oauth_verifier=verifier; hqb_oauth_state=expected",
          },
        },
      ),
      oauthEnv,
    );
    const expiredHtml = await expired.text();
    expect(expired.status).toBe(400);
    expect(expiredHtml).toContain("Installation session expired");
    expect(expiredHtml).toContain('role="alert"');
  });

  it("renders Worker and Workers Builds recovery states", async () => {
    const missingWorkerSession = await oauthSession();
    const missingWorker = await finishOAuth(
      callbackRequest(missingWorkerSession),
      oauthEnv,
      installationFetcher("worker") as typeof fetch,
    );
    expect(missingWorker.status).toBe(404);
    expect(await missingWorker.text()).toContain("Deployed Worker not found");

    const missingBuildSession = await oauthSession();
    const missingBuild = await finishOAuth(
      callbackRequest(missingBuildSession),
      oauthEnv,
      installationFetcher("build") as typeof fetch,
    );
    expect(missingBuild.status).toBe(409);
    expect(await missingBuild.text()).toContain(
      "Workers Builds is not connected",
    );
  });

  it("redirects a queued build to resumable progress without claiming completion", async () => {
    const session = await oauthSession();
    const response = await finishOAuth(
      callbackRequest(session),
      oauthEnv,
      installationFetcher("success") as typeof fetch,
    );
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/install/progress");
    expect(response.headers.get("set-cookie")).toContain(
      "hqb_build_progress=build-unsafe",
    );
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");

    const progress = await worker.fetch(
      new Request("https://installer.test/install/progress", {
        headers: { cookie: "hqb_build_progress=build-unsafe" },
      }),
      oauthEnv,
    );
    const html = await progress.text();
    expect(progress.status).toBe(200);
    expect(html).toContain("Your licensed build has started");
    expect(html).toContain(
      "HQBase Pro is not ready until that build finishes.",
    );
    expect(html).toContain("build-unsafe");
    expect(html).toContain('id="check-status"');
    expect(html).not.toContain('href="/health"');
    expect(html).toContain('fetch("/api/health?handoff=" + Date.now()');
    expect(html).toContain(
      'status.ok === true && status.service === "hqbase-pro"',
    );
    expect(html).toContain('location.replace("/setup")');
  });

  it("resumes queued-build progress instead of redeeming the claim again", async () => {
    const response = await worker.fetch(
      new Request("https://installer.test/", {
        headers: { cookie: "hqb_build_progress=build-123" },
      }),
      oauthEnv,
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/install/progress");
  });

  it("uses the same no-store health path as the licensed Pro runtime", async () => {
    const response = await worker.fetch(
      new Request("https://installer.test/api/health"),
      oauthEnv,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({
      ok: true,
      service: "hqbase-pro-installer",
    });
  });

  it("configures masked build state, runtime secrets, and a production build", async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    const fetcher = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        requests.push({ url, init });
        if (url.includes("/accounts?"))
          return Response.json({ success: true, result: [{ id: "account" }] });
        if (url.endsWith("/workers/scripts"))
          return Response.json({
            success: true,
            result: [{ id: "hqbase-pro", tag: "worker-tag" }],
          });
        if (url.endsWith("/triggers"))
          return Response.json({
            success: true,
            result: [{ trigger_uuid: "trigger", branch_includes: ["main"] }],
          });
        if (url.endsWith("/environment_variables") && init?.method !== "PATCH")
          return Response.json({ success: true, result: {} });
        if (url.endsWith("/builds"))
          return Response.json({
            success: true,
            result: { build_uuid: "build", status: "queued" },
          });
        return Response.json({ success: true, result: {} });
      },
    );
    const response = await install(
      { licenseKey: "HQB_TEST_LICENSE_KEY", mode: "fresh" },
      { HQBASE_WORKER_NAME: "hqbase-pro" },
      "oauth-access-token",
      fetcher as typeof fetch,
    );
    expect(response.status).toBe(202);
    await expect(response.json()).resolves.toMatchObject({
      buildId: "build",
      status: "queued",
    });
    const variables = requests.find(
      (request) =>
        request.url.endsWith("/environment_variables") &&
        request.init?.method === "PATCH",
    );
    expect(JSON.parse(String(variables?.init?.body))).toMatchObject({
      HQBASE_PRO_LICENSE_KEY: {
        value: "HQB_TEST_LICENSE_KEY",
        is_secret: true,
      },
      HQBASE_INSTALL_MODE: { value: "fresh", is_secret: false },
      HQBASE_WORKER_NAME: { value: "hqbase-pro", is_secret: false },
    });
    const build = requests.find((request) => request.url.endsWith("/builds"));
    expect(JSON.parse(String(build?.init?.body))).toEqual({ branch: "main" });
    expect(
      requests.filter((request) => request.url.endsWith("/secrets")),
    ).toHaveLength(7);
  });

  it("starts PKCE OAuth without putting the license in the redirect", async () => {
    const response = await startOAuth(
      new Request("https://installer.test/api/oauth/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          licenseKey: "HQB_TEST_LICENSE_KEY",
        }),
      }),
      {
        ...oauthEnv,
      },
    );
    expect(response.status).toBe(303);
    const location = response.headers.get("location") ?? "";
    expect(location).toContain("auth.hqbase.io/oauth/authorize");
    expect(location).not.toContain("HQB_TEST_LICENSE_KEY");
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
  });
});
