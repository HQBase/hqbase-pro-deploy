# HQBase Pro Deploy

Public, auditable Cloudflare bootstrap and updater for private HQBase Pro releases. This repository
contains no HQBase Pro product source.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2FHQBase%2Fhqbase-pro-deploy)

Fresh Pro installation creates the customer-owned Cloudflare resources and serves a small installer.
The installer claims the verified Polar purchase from HQBase Billing, discovers the Worker name
selected during Deploy to Cloudflare, and starts a Cloudflare OAuth Authorization Code flow with
PKCE. The code is exchanged by the customer-owned Worker, not HQBase infrastructure. It generates
runtime secrets, stores the license and short-lived setup grant as masked Worker secrets, and starts
the licensed build. Pro uses that grant for initial domain/email setup and then revokes it.
Customers do not create or paste API tokens, license keys, or Worker names during the normal flow.
Manual license entry remains available only for old purchases and interrupted-session recovery.

Community upgrades do not deploy this bootstrap beside Community. An authenticated Community owner
starts the purchase in the existing workspace, which verifies and backs up its resources and uploads
the signed Pro release as a new version of that same Worker service. This bootstrap refuses
`community_upgrade` claims so it cannot rotate the existing authentication secret or leave a second
permanent Worker behind.

HQBase Pro itself is governed by the HQBase Commercial Source License supplied with the licensed
release. This bootstrap is MIT licensed.

Pull requests and `main` run the complete quality gate and deploy dry-run. There is no vendor
production deployment: Cloudflare clones this repository into the customer's account through the
public deploy flow.
