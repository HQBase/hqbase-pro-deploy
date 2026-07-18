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
  width: min(100%, 576px);
  margin: 0 auto;
  padding-top: 40px;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}

.timeline-step {
  position: relative;
  display: flex;
  gap: 10px;
}

.timeline-rail {
  position: absolute;
  top: 0;
  bottom: -24px;
  left: 0;
  width: 24px;
  display: flex;
  justify-content: center;
}

.timeline-step:last-child .timeline-rail {
  bottom: auto;
  height: 24px;
}

.timeline-rail::before {
  width: 1px;
  content: "";
  background: var(--border);
}

.timeline-marker-wrap {
  position: relative;
  z-index: 1;
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  display: grid;
  place-items: center;
  background: var(--background);
}

.timeline-marker {
  width: 12px;
  height: 12px;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  background: var(--background);
}

.is-current .timeline-marker {
  width: 10px;
  height: 10px;
  border: 0;
  background: var(--primary);
}

.is-complete .timeline-marker {
  width: auto;
  height: auto;
  border: 0;
  background: transparent;
  color: var(--primary);
  font-size: 20px;
  line-height: 1;
}

.is-failed .timeline-marker {
  width: auto;
  height: auto;
  border: 0;
  color: var(--danger-text);
  font-size: 16px;
  line-height: 1;
}

.timeline-content {
  min-width: 0;
  flex: 1;
}

.timeline-heading {
  margin: 2px 0 0;
  color: var(--text);
  font-size: 14px;
  font-weight: 500;
}

.timeline-status {
  color: var(--subtle);
  font-weight: 400;
}

.is-failed .timeline-status {
  color: var(--danger-text);
}

.timeline-description {
  margin: 2px 0 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}

.timeline-body {
  margin-top: 12px;
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

.field-label-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.field-label {
  color: var(--text);
  font-size: 14px;
  font-weight: 500;
}

.field-error {
  color: var(--danger-text);
  font-size: 12px;
  line-height: 1.35;
  text-align: right;
}

.field-help {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.45;
}

.field-help::before {
  width: 14px;
  height: 14px;
  display: inline-grid;
  place-items: center;
  margin-right: 6px;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  content: "i";
  font-size: 9px;
  line-height: 1;
  vertical-align: 1px;
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

  .page-shell {
    padding-top: 32px;
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
      <ol class="timeline" aria-label="License recovery">
        <li class="timeline-step is-complete">
          <div class="timeline-rail" aria-hidden="true"></div><div class="timeline-marker-wrap"><span class="timeline-marker" aria-hidden="true">✓</span></div>
          <div class="timeline-content"><p class="timeline-heading">Purchase Pro and deploy resources <span class="timeline-status">· Complete</span></p><p class="timeline-description">Licensed Worker and storage</p></div>
        </li>
        <li class="timeline-step is-current">
          <div class="timeline-rail" aria-hidden="true"></div><div class="timeline-marker-wrap"><span class="timeline-marker" aria-hidden="true"></span></div>
          <div class="timeline-content">
            <p class="timeline-heading">Authorize and install <span class="timeline-status">· In progress</span></p>
            <p class="timeline-description">Temporary installation access</p>
            <form class="stack timeline-body" method="post" action="/api/oauth/start" id="installer-form">
              <div class="field">
                <div class="field-label-row"><label class="field-label" for="license-key">Polar license key</label>${error ? `<span class="field-error" id="form-error" role="alert">${escapeHtml(error)}</span>` : ""}</div>
                <input id="license-key" name="licenseKey" type="password" autocomplete="off" required aria-describedby="${licenseDescription}"${invalidLicense ? ' aria-invalid="true" aria-errormessage="form-error" autofocus' : ""}>
                <p class="field-help" id="license-help">The Worker name is detected from this deployment.</p>
              </div>
              <p class="field-help">Cloudflare will show the temporary setup permissions before approval.</p>
              <div class="actions"><button class="button" type="submit" id="submit-button">Authorize Cloudflare &amp; recover</button></div>
              <p class="form-status" id="form-status" role="status" aria-live="polite" hidden></p>
            </form>
          </div>
        </li>
        <li class="timeline-step is-upcoming" aria-disabled="true"><div class="timeline-rail" aria-hidden="true"></div><div class="timeline-marker-wrap"><span class="timeline-marker" aria-hidden="true"></span></div><div class="timeline-content"><p class="timeline-heading">Configure workspace <span class="timeline-status">· Upcoming</span></p><p class="timeline-description">Domain, owner account, and mailboxes</p></div></li>
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
      <h1 id="page-title">Set up HQBase Pro</h1>
      <p class="lede">Complete installation before configuring your workspace.</p>
      <ol class="timeline" aria-label="Pro installation progress">
        <li class="timeline-step is-complete"><div class="timeline-rail" aria-hidden="true"></div><div class="timeline-marker-wrap"><span class="timeline-marker" aria-hidden="true">✓</span></div><div class="timeline-content"><p class="timeline-heading">Purchase Pro and deploy resources <span class="timeline-status">· Complete</span></p><p class="timeline-description">Licensed Worker and storage</p></div></li>
        <li class="timeline-step is-current"><div class="timeline-rail" aria-hidden="true"></div><div class="timeline-marker-wrap"><span class="timeline-marker" aria-hidden="true"></span></div><div class="timeline-content"><p class="timeline-heading" id="build-status">Authorize and install <span class="timeline-status">· In progress</span></p><p class="timeline-description">Build <code>${escapeHtml(buildId)}</code> is preparing your licensed release.</p><div class="timeline-body"><p class="form-status" id="build-progress" role="status" aria-live="polite">Waiting for the licensed Worker…</p><div class="actions section-actions"><button class="button button-outline" type="button" id="check-status">Check installation</button></div></div></div></li>
        <li class="timeline-step is-upcoming" aria-disabled="true"><div class="timeline-rail" aria-hidden="true"></div><div class="timeline-marker-wrap"><span class="timeline-marker" aria-hidden="true"></span></div><div class="timeline-content"><p class="timeline-heading">Configure workspace <span class="timeline-status">· Upcoming</span></p><p class="timeline-description">Domain, owner account, and mailboxes</p></div></li>
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
      <div class="alert stack" role="alert"><p>${escapeHtml(message)}</p></div>
      <div class="actions section-actions"><a class="button" href="${escapeHtml(primaryHref)}">${escapeHtml(primaryLabel)}</a>${secondaryHref && secondaryLabel ? `<a class="button button-outline" href="${escapeHtml(secondaryHref)}">${escapeHtml(secondaryLabel)}</a>` : ""}</div>
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
  <body><div class="page-shell">${content}</div></body>
</html>`;
}
