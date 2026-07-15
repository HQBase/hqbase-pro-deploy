const PRODUCT_STYLES = `
@font-face {
  font-family: "Geist Sans";
  src: url("/fonts/Geist-Regular.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: "Geist Sans";
  src: url("/fonts/Geist-Medium.woff2") format("woff2");
  font-style: normal;
  font-weight: 500;
  font-display: swap;
}

@font-face {
  font-family: "Geist Sans";
  src: url("/fonts/Geist-SemiBold.woff2") format("woff2");
  font-style: normal;
  font-weight: 600;
  font-display: swap;
}

@font-face {
  font-family: "Geist Mono";
  src: url("/fonts/GeistMono-Regular.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

:root {
  color-scheme: dark;
  font-family: "Geist Sans", ui-sans-serif, system-ui, sans-serif;
  font-synthesis: none;
  --background: #090a0b;
  --surface: #111214;
  --surface-raised: #17181b;
  --border: #2a2b30;
  --border-strong: #3a3b42;
  --text: #f4f4f5;
  --muted: #a8a8b3;
  --subtle: #85858f;
  --primary: #f4f4f5;
  --primary-text: #111214;
  --focus: #a8c7fa;
  --danger-surface: #211315;
  --danger-border: #6b2b32;
  --danger-text: #fecdd3;
  background: var(--background);
  color: var(--text);
}

* {
  box-sizing: border-box;
}

html {
  min-width: 320px;
  background: var(--background);
}

body {
  min-height: 100vh;
  min-height: 100svh;
  margin: 0;
  padding: 32px 16px;
  display: grid;
  place-items: center;
  background: var(--background);
  color: var(--text);
  font-size: 15px;
  line-height: 1.55;
  text-rendering: optimizeLegibility;
}

button,
input,
select,
textarea {
  font: inherit;
}

button,
input,
a {
  -webkit-tap-highlight-color: transparent;
}

.panel {
  width: min(100%, 896px);
  min-width: 0;
  padding: 28px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: 0 18px 48px rgb(0 0 0 / 22%);
}

.onboarding {
  display: grid;
  gap: 10px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
}

.step {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-raised);
}

.step.is-upcoming {
  background: transparent;
  color: var(--subtle);
}

.step-marker {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid var(--border-strong);
  border-radius: 6px;
  font-family: "Geist Mono", ui-monospace, monospace;
  font-size: 13px;
}

.step-content h2 {
  margin: 4px 0 0;
  font-size: 16px;
  font-weight: 600;
}

.step-content > p {
  margin: 6px 0 0;
  color: var(--muted);
}

h1 {
  margin: 0;
  font-size: clamp(24px, 5vw, 30px);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.18;
}

.lede {
  max-width: 54ch;
  margin: 12px 0 0;
  color: var(--muted);
}

.stack {
  display: grid;
  gap: 20px;
  margin-top: 28px;
}

.field {
  display: grid;
  gap: 8px;
}

.field-label {
  color: var(--text);
  font-size: 14px;
  font-weight: 500;
}

.field-help {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.45;
}

input {
  width: 100%;
  min-width: 0;
  min-height: 44px;
  padding: 9px 12px;
  border: 1px solid var(--border-strong);
  border-radius: 6px;
  outline: 0;
  background: var(--background);
  color: var(--text);
  font-size: 16px;
  line-height: 1.4;
}

input:hover {
  border-color: #50515a;
}

input[aria-invalid="true"] {
  border-color: var(--danger-border);
}

:where(input, button, a):focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}

.alert {
  padding: 12px 14px;
  border: 1px solid var(--danger-border);
  border-radius: 6px;
  background: var(--danger-surface);
  color: var(--danger-text);
  font-size: 14px;
  line-height: 1.5;
}

.alert p {
  margin: 0;
}

.notice {
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface-raised);
  color: var(--muted);
  font-size: 13px;
  line-height: 1.5;
}

.notice p {
  margin: 0;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.section-actions {
  margin-top: 20px;
}

.button {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 9px 15px;
  border: 1px solid transparent;
  border-radius: 6px;
  appearance: none;
  background: var(--primary);
  color: var(--primary-text);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  text-align: center;
  text-decoration: none;
}

.button:hover {
  background: #dedee2;
}

.button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.button-outline {
  border-color: var(--border-strong);
  background: transparent;
  color: var(--text);
}

.button-outline:hover {
  background: var(--surface-raised);
}

.form-status {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.status-card {
  margin-top: 24px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface-raised);
}

.status-label {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  color: var(--text);
  font-size: 13px;
  font-weight: 600;
}

.status-label::before {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #86b898;
  content: "";
}

.status-card p {
  margin: 10px 0 0;
  color: var(--muted);
}

code {
  overflow-wrap: anywhere;
  color: var(--text);
  font-family: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.9em;
}

@media (max-width: 480px) {
  body {
    padding: 16px;
    place-items: start center;
  }

  .panel {
    padding: 20px;
  }

  .stack {
    margin-top: 24px;
  }

  .actions,
  .button {
    width: 100%;
  }
}
`;

type InstallerView = {
  error?: string;
  invalidLicense?: boolean;
};

type ErrorView = {
  title: string;
  message: string;
};

export function installerHtml({
  error,
  invalidLicense = false,
}: InstallerView): string {
  const errorId = error ? "form-error" : undefined;
  const licenseDescription = ["license-help", invalidLicense && errorId]
    .filter(Boolean)
    .join(" ");

  return documentHtml(
    "Recover HQBase Pro installation",
    `<main class="panel" aria-labelledby="page-title">
      <h1 id="page-title">Resume Pro installation</h1>
      <p class="lede">Automatic purchase handoff could not continue. Retry it first; use the license field only for an older purchase or expired session.</p>
      <ol class="onboarding" aria-label="Installation recovery">
        <li class="step">
          <div class="step-marker" aria-hidden="true">1</div>
          <div class="step-content">
            <h2>Resume automatic setup</h2>
            <p>Return to Billing to claim the verified purchase without copying a key.</p>
            ${error ? `<div class="alert section-actions" id="form-error" role="alert"><p>${escapeHtml(error)}</p></div>` : ""}
            <div class="actions section-actions"><a class="button" href="/api/install/start">Retry automatic setup</a></div>
          </div>
        </li>
        <li class="step">
          <div class="step-marker" aria-hidden="true">2</div>
          <div class="step-content">
            <h2>License recovery</h2>
            <p>For an older purchase, retrieve the license from Polar and continue manually.</p>
            <form class="stack" method="post" action="/api/oauth/start" id="installer-form">
              <div class="field">
                <label class="field-label" for="license-key">Polar license key</label>
                <input id="license-key" name="licenseKey" type="password" autocomplete="off" required aria-describedby="${licenseDescription}"${invalidLicense ? ' aria-invalid="true" aria-errormessage="form-error" autofocus' : ""}>
                <p class="field-help" id="license-help">The Worker name is detected from this deployment.</p>
              </div>
              <div class="notice" role="note"><p>Cloudflare will show the accounts, zones, and setup permissions before approval. The temporary grant is revoked after workspace setup.</p></div>
              <div class="actions"><button class="button button-outline" type="submit" id="submit-button">Authorize Cloudflare &amp; recover</button></div>
              <p class="form-status" id="form-status" role="status" aria-live="polite" hidden></p>
            </form>
          </div>
        </li>
        <li class="step is-upcoming" aria-disabled="true"><div class="step-marker" aria-hidden="true">3</div><div class="step-content"><h2>Build and configure</h2><p>HQBase installs the licensed release, then continues with workspace setup.</p></div></li>
      </ol>
    </main>
    <script>
      const form = document.querySelector("#installer-form");
      const button = document.querySelector("#submit-button");
      const status = document.querySelector("#form-status");
      form.addEventListener("submit", () => {
        if (!form.checkValidity()) return;
        button.disabled = true;
        button.setAttribute("aria-busy", "true");
        button.textContent = "Opening Cloudflare…";
        status.hidden = false;
        status.textContent = "Opening Cloudflare authorization…";
      });
    </script>`,
  );
}

export function buildStartedHtml(buildId: string): string {
  return documentHtml(
    "HQBase Pro build started",
    `<main class="panel" aria-labelledby="page-title">
      <h1 id="page-title">Your licensed build has started</h1>
      <p class="lede">Cloudflare accepted the build request. HQBase Pro is not ready until that build finishes.</p>
      <section class="status-card" aria-labelledby="build-status">
        <div class="status-label" id="build-status">Build queued</div>
        <p>Build <code>${escapeHtml(buildId)}</code> is preparing your licensed release. The delegated Cloudflare grant will finish domain and email setup, then revoke itself.</p>
      </section>
      <div class="actions section-actions">
        <a class="button button-outline" href="/health">Check deployment status</a>
      </div>
      <p class="form-status" id="build-progress" role="status" aria-live="polite">Waiting for the licensed Worker…</p>
    </main>
    <script>
      const progress = document.querySelector("#build-progress");
      const poll = async () => {
        try {
          const response = await fetch("/health", { cache: "no-store" });
          const status = await response.json();
          if (status.service !== "hqbase-pro-installer") {
            location.replace("/setup");
            return;
          }
        } catch {}
        progress.textContent = "Build still in progress. Checking again…";
        setTimeout(poll, 5000);
      };
      setTimeout(poll, 5000);
    </script>`,
  );
}

export function errorHtml({ title, message }: ErrorView): string {
  return documentHtml(
    `${title} · HQBase Pro`,
    `<main class="panel" aria-labelledby="page-title">
      <h1 id="page-title">${escapeHtml(title)}</h1>
      <div class="alert section-actions" role="alert"><p>${escapeHtml(message)}</p></div>
      <div class="actions section-actions">
        <a class="button button-outline" href="/">Back to installer</a>
      </div>
    </main>`,
  );
}

export function htmlResponse(
  html: string,
  status = 200,
  headers?: HeadersInit,
): Response {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("content-type", "text/html; charset=utf-8");
  responseHeaders.set("cache-control", "no-store");
  return new Response(html, { status, headers: responseHeaders });
}

export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );
}

function documentHtml(title: string, content: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="dark">
    <link rel="preload" href="/fonts/Geist-Regular.woff2" as="font" type="font/woff2" crossorigin>
    <title>${escapeHtml(title)}</title>
    <style>${PRODUCT_STYLES}</style>
  </head>
  <body>${content}</body>
</html>`;
}
