# Deployment and rollback

Path: `feature/* → PR → CI → protected main → Cloudflare Workers Builds production`.

Cloudflare Worker name must match `wrangler.jsonc`: `pioneerhub`. Build command: `npm ci`; deploy command: `npx wrangler deploy --env=\"\"`. Branch previews use Cloudflare versions and never production secrets.

## Rollback
Record commit SHA, deployment ID, time and change. Promote the last known-good Cloudflare Worker version; then fix/revert via PR. No direct local production deployment outside a documented incident procedure.

## Release checkpoints
After a stable production validation, create an annotated Git tag in the form `vYYYY.MM.DD.N` pointing to the exact deployed `main` commit. Record the tag, deployment ID, time and rollback predecessor in `CHANGELOG.md`.
