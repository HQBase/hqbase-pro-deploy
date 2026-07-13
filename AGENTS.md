# HQBase Pro Deploy Guide

Public bootstrap and updater only. Never add HQBase Pro product source, customer credentials,
release signing private keys, or license values to this repository. OAuth codes and access tokens
must never be logged. The short-lived setup token may exist only as a masked customer Worker secret
until setup revokes it.

Quality gate: `pnpm check` and `pnpm deploy:dry-run`.
