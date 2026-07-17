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
  padding: 0 16px 32px;
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
  width: 100%;
  min-width: 0;
}

.page-shell {
  width: min(100%, 896px);
  margin: 0 auto;
}

.product-header {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
}

.brand-mark {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  font-family: "Geist Mono", ui-monospace, monospace;
  font-size: 10px;
  font-weight: 600;
}

.page-progress {
  color: var(--muted);
  font-family: "Geist Mono", ui-monospace, monospace;
  font-size: 12px;
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
  background: var(--surface);
}

.step.is-current {
  border-color: var(--border-strong);
  background: var(--surface-raised);
}

.step.is-failed {
  border-color: var(--danger-border);
  background: var(--danger-surface);
}

.step.is-complete .step-marker {
  border-color: var(--text);
  background: var(--text);
  color: var(--background);
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

.step-heading {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: baseline;
}

.step-status {
  color: var(--muted);
  font-family: "Geist Mono", ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
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

code {
  overflow-wrap: anywhere;
  color: var(--text);
  font-family: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.9em;
}

@media (max-width: 480px) {
  body {
    padding: 0 16px 24px;
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

type RecoveryView = {
  error?: string;
  invalidLicense?: boolean;
};

type ErrorView = {
  title: string;
  message: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function recoveryHtml({
  error,
  invalidLicense = false,
}: RecoveryView = {}): string {
  const errorId = error ? "form-error" : undefined;
  const licenseDescription = ["license-help", invalidLicense && errorId]
    .filter(Boolean)
    .join(" ");

  return documentHtml(
    "Recover HQBase Pro installation",
    `<main class="panel" aria-labelledby="page-title">
      <h1 id="page-title">Recover an older Pro purchase</h1>
      <p class="lede">Use this explicit recovery path only when an older purchase cannot use the automatic purchase handoff.</p>
      <ol class="onboarding" aria-label="License recovery">
        <li class="step is-current">
          <div class="step-marker" aria-hidden="true">1</div>
          <div class="step-content">
            <div class="step-heading"><h2>Enter the existing license</h2><span class="step-status">Current</span></div>
            <p>Retrieve the license from Polar, then authorize Cloudflare to finish this installation.</p>
            ${error ? `<div class="alert section-actions" id="form-error" role="alert"><p>${escapeHtml(error)}</p></div>` : ""}
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
        <li class="step is-upcoming" aria-disabled="true"><div class="step-marker" aria-hidden="true">2</div><div class="step-content"><div class="step-heading"><h2>Build and configure</h2><span class="step-status">Upcoming</span></div><p>HQBase installs the licensed release, then continues with workspace setup.</p></div></li>
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
    "1 / 2",
  );
}

export function buildStartedHtml(buildId: string): string {
  return documentHtml(
    "HQBase Pro build started",
    `<main class="panel" aria-labelledby="page-title">
      <h1 id="page-title">Your licensed build has started</h1>
      <p class="lede">Cloudflare accepted the build request. HQBase Pro is not ready until that build finishes.</p>
      <ol class="onboarding" aria-label="Pro installation progress">
        <li class="step is-complete"><div class="step-marker" aria-hidden="true">✓</div><div class="step-content"><div class="step-heading"><h2>Purchase verified</h2><span class="step-status">Complete</span></div><p>The purchase-bound install claim was accepted.</p></div></li>
        <li class="step is-complete"><div class="step-marker" aria-hidden="true">✓</div><div class="step-content"><div class="step-heading"><h2>Cloudflare authorized</h2><span class="step-status">Complete</span></div><p>The temporary delegated grant is stored only in this Worker.</p></div></li>
        <li class="step is-current"><div class="step-marker" aria-hidden="true">3</div><div class="step-content"><div class="step-heading"><h2 id="build-status">Install licensed Worker</h2><span class="step-status">Current</span></div><p>Build <code>${escapeHtml(buildId)}</code> is preparing your licensed release.</p><div class="actions section-actions"><button class="button button-outline" type="button" id="check-status">Check deployment status</button></div><p class="form-status" id="build-progress" role="status" aria-live="polite">Waiting for the licensed Worker…</p></div></li>
        <li class="step is-upcoming" aria-disabled="true"><div class="step-marker" aria-hidden="true">4</div><div class="step-content"><div class="step-heading"><h2>Configure workspace</h2><span class="step-status">Upcoming</span></div><p>Continue with domains, owner account, and shared addresses.</p></div></li>
      </ol>
    </main>
    <script>
      const progress = document.querySelector("#build-progress");
      const checkButton = document.querySelector("#check-status");
      let redirecting = false;
      let checking = false;
      let timer;
      const scheduleCheck = () => {
        clearTimeout(timer);
        timer = setTimeout(check, 5000);
      };
      const check = async (manual = false) => {
        if (redirecting || checking) return;
        checking = true;
        clearTimeout(timer);
        if (manual) {
          checkButton.disabled = true;
          progress.textContent = "Checking the licensed Worker…";
        }
        try {
          const response = await fetch("/api/health?handoff=" + Date.now(), {
            cache: "no-store",
            headers: { accept: "application/json" }
          });
          const status = await response.json();
          if (response.ok && status.ok === true && status.service === "hqbase-pro") {
            redirecting = true;
            progress.textContent = "Licensed Worker ready. Opening workspace setup…";
            location.replace("/setup");
            return;
          }
        } catch {}
        progress.textContent = "Build still in progress. Checking again…";
        checking = false;
        checkButton.disabled = false;
        scheduleCheck();
      };
      checkButton.addEventListener("click", () => check(true));
      timer = setTimeout(check, 2000);
    </script>`,
    "3 / 4",
  );
}

export function errorHtml({
  title,
  message,
  primaryHref = "/",
  primaryLabel = "Back to installer",
  secondaryHref,
  secondaryLabel,
}: ErrorView): string {
  return documentHtml(
    `${title} · HQBase Pro`,
    `<main class="panel" aria-labelledby="page-title">
      <h1 id="page-title">${escapeHtml(title)}</h1>
      <ol class="onboarding" aria-label="Installation status"><li class="step is-failed"><div class="step-marker" aria-hidden="true">!</div><div class="step-content"><div class="step-heading"><h2>Installation needs attention</h2><span class="step-status">Failed</span></div><div class="alert section-actions" role="alert"><p>${escapeHtml(message)}</p></div><div class="actions section-actions"><a class="button" href="${escapeHtml(primaryHref)}">${escapeHtml(primaryLabel)}</a>${secondaryHref && secondaryLabel ? `<a class="button button-outline" href="${escapeHtml(secondaryHref)}">${escapeHtml(secondaryLabel)}</a>` : ""}</div></div></li></ol>
    </main>`,
    "Needs attention",
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

function documentHtml(
  title: string,
  content: string,
  progress = "HQBase Pro",
): string {
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
  <body><div class="page-shell"><header class="product-header"><div class="brand"><span class="brand-mark" aria-hidden="true">HQ</span><span>HQBase</span></div><span class="page-progress">${escapeHtml(progress)}</span></header>${content}</div></body>
</html>`;
}
