# HQBase Pro release notes

This public file is the canonical version-specific history for the private Pro product.

## 0.1.11

- Installs as a standalone webmail app on supported desktop and mobile browsers.
- Keeps the application shell and offline guidance available when the network is unavailable.
- Refreshes cached app assets safely after a new Pro release is deployed.
- Keeps account, message, and API responses out of offline storage.

## 0.1.10

- Moves fixed OAuth, Billing, release, version, and trust configuration out of the deploy form.
- Exposes only customer-owned Worker, D1, R2, queue, and email resources.
- Remains compatible with supported Pro updates from 0.1.3.

## 0.1.7

- Deletes the disposable candidate validator after promoted-service verification.
- Deletes only resources explicitly recorded as created, disposable, and Worker-owned.
- Makes cleanup idempotent and completes it before Cloudflare grant revocation.
- Preserves the target Worker, reused Community storage, and previous Community version.

## 0.1.6

- Preserves Community attachment references while Pro migrations rebuild the messages table.
- Restores attachment rows idempotently before candidate verification.
- Retains recovery state until promoted-service verification succeeds.

## 0.1.5

- Completes in-place upgrades from supported signed Community releases.
- Clears encrypted purchase continuation only after promoted-service and entitlement verification.
- Preserves the previous Community Worker version and recovery inventory.

## 0.1.3

- Launches Pro as a web-first beta with multiple domains, per-mailbox access, richer composition,
  billing, guarded upgrades, backup/restore, and safer ownership-aware destroy behavior.
- Labels IMAP/SMTP truthfully as a private preview; it is not generally available or included in
  the basic launch purchase promise.
- Includes token-free Cloudflare OAuth installation and the signed release/update lifecycle.
- Supports direct Pro updates from 0.1.2 and Community-to-Pro upgrades from Community 0.1.2.
