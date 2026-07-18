# HQBase Pro Deploy

Public, auditable Cloudflare bootstrap and updater for private HQBase Pro releases. This repository
contains no HQBase Pro product source.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2FHQBase%2Fhqbase-pro-deploy)

Fresh Pro installation creates the customer-owned Cloudflare resources and serves a small installer.
The installer claims the verified Polar purchase from HQBase Billing, discovers the Worker name
selected during Deploy to Cloudflare, and starts a Cloudflare OAuth Authorization Code flow with
PKCE. The code is exchanged by the customer-owned Worker, not HQBase infrastructure. It generates
runtime secrets, stores the license and short-lived setup grant as masked Worker secrets, and starts
the licensed build. The browser is redirected to a stable, resumable progress route that checks the
shared `/api/health` contract in place and opens `/setup` only after the Worker positively identifies
itself as HQBase Pro. Pro uses the delegated grant for initial domain/email setup and then revokes it.
Customers do not create or paste API tokens, license keys, or Worker names during the normal flow.
Manual license entry remains available only through the explicit `/recover` route for old purchases;
claim or progress failures do not display the license form automatically.

The Deploy to Cloudflare form exposes only customer-owned Worker, D1, R2, and queue names. HQBase
OAuth configuration, service endpoints, release trust material, version metadata, and generated
secrets are fixed or derived after the form and cannot be edited during installation.

Community upgrades do not use this bootstrap. They begin and complete inside the existing Community
workspace. Billing issues this installer only fresh-install claims; every other claim mode fails as
invalid before Cloudflare authorization.

HQBase Pro itself is governed by the HQBase Commercial Source License supplied with the licensed
release. This bootstrap is MIT licensed.

Pull requests and `main` run the complete quality gate and deploy dry-run. There is no vendor
production deployment: Cloudflare clones this repository into the customer's account through the
public deploy flow.
