const PRODUCT_STYLES = `
:root {
  color-scheme: dark;
  font-family: Aptos, ui-sans-serif, system-ui, sans-serif;
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
  width: min(100%, 600px);
  min-width: 0;
  padding: 28px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: 0 18px 48px rgb(0 0 0 / 22%);
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--subtle);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  line-height: 1.4;
  text-transform: uppercase;
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
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
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
  workerName: string;
  error?: string;
  invalidLicense?: boolean;
  invalidWorker?: boolean;
};

type ErrorView = {
  title: string;
  message: string;
};

export function installerHtml({
  workerName,
  error,
  invalidLicense = false,
  invalidWorker = false,
}: InstallerView): string {
  const errorId = error ? "form-error" : undefined;
  const licenseDescription = ["license-help", invalidLicense && errorId]
    .filter(Boolean)
    .join(" ");
  const workerDescription = ["worker-help", invalidWorker && errorId]
    .filter(Boolean)
    .join(" ");

  return documentHtml(
    "Install HQBase Pro",
    `<main class="panel" aria-labelledby="page-title">
      <p class="eyebrow">HQBase Pro installer</p>
      <h1 id="page-title">Finish Pro installation</h1>
      <p class="lede">Your Cloudflare resources are ready. Add your Polar license, then authorize HQBase to finish setup.</p>
      <form class="stack" method="post" action="/api/oauth/start" id="installer-form">
        ${
          error
            ? `<div class="alert" id="form-error" role="alert"><p>${escapeHtml(error)}</p></div>`
            : ""
        }
        <div class="field">
          <label class="field-label" for="license-key">Polar license key</label>
          <input id="license-key" name="licenseKey" type="password" autocomplete="off" required aria-describedby="${licenseDescription}"${invalidLicense ? ' aria-invalid="true" aria-errormessage="form-error" autofocus' : ""}>
          <p class="field-help" id="license-help">Use the license key from your HQBase Pro purchase.</p>
        </div>
        <div class="field">
          <label class="field-label" for="worker-name">Deployed Worker name</label>
          <input id="worker-name" name="workerName" value="${escapeHtml(workerName)}" autocomplete="off" required aria-describedby="${workerDescription}"${invalidWorker ? ` aria-invalid="true" aria-errormessage="form-error"${invalidLicense ? "" : " autofocus"}` : ""}>
          <p class="field-help" id="worker-help">This must match the Worker created by Deploy to Cloudflare.</p>
        </div>
        <div class="notice" role="note"><p>Cloudflare will show the accounts, zones, and setup permissions before approval. The temporary grant is revoked after workspace setup.</p></div>
        <div class="actions">
          <button class="button" type="submit" id="submit-button">Authorize Cloudflare &amp; install</button>
        </div>
        <p class="form-status" id="form-status" role="status" aria-live="polite" hidden></p>
      </form>
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
      <p class="eyebrow">HQBase Pro installer</p>
      <h1 id="page-title">Your licensed build has started</h1>
      <p class="lede">Cloudflare accepted the build request. HQBase Pro is not ready until that build finishes.</p>
      <section class="status-card" aria-labelledby="build-status">
        <div class="status-label" id="build-status">Build queued</div>
        <p>Build <code>${escapeHtml(buildId)}</code> is preparing your licensed release. The delegated Cloudflare grant will finish domain and email setup, then revoke itself.</p>
      </section>
      <div class="actions section-actions">
        <a class="button button-outline" href="/">Open Worker again</a>
      </div>
    </main>`,
  );
}

export function errorHtml({ title, message }: ErrorView): string {
  return documentHtml(
    `${title} · HQBase Pro`,
    `<main class="panel" aria-labelledby="page-title">
      <p class="eyebrow">HQBase Pro installer</p>
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
    <title>${escapeHtml(title)}</title>
    <style>${PRODUCT_STYLES}</style>
  </head>
  <body>${content}</body>
</html>`;
}
