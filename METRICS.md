# Metrics plan

## North star

**Monthly Useful Actions (MUA)**: completed learning open, safety checklist progress/completion, App Radar outbound action, community contribution intent, or Payment Lab walkthrough interaction.

## Production status

- Telemetry emission: live.
- Privacy boundary: validated.
- Aggregate storage: Workers Analytics Engine dataset `pioneerhub_mua_events`.
- Retention: three months; no identity or per-user data is stored.

## Allowlisted event taxonomy

- `learn_article_open`
- `safety_check_start`
- `safety_check_complete`
- `scam_shield_start`
- `scam_shield_complete`
- `app_radar_view`
- `app_open_external`
- `report_scam`
- `suggest_app`
- `community_cta`
- `referral_open`
- `payment_lab_start`
- `payment_lab_complete`

## Payload rules

The Worker accepts only an exact event-name body at `POST /events`.

- JSON is not parsed.
- Arbitrary payload fields are discarded by design.
- The aggregate dataset receives only an allowlisted event name, release ID, and
  count value. Its sampling index is the event name, not a person, device, or
  browser-derived value.

Not accepted intentionally:

- wallet addresses
- Pi username
- email
- passphrase
- auth tokens
- session secrets
- free-form text
- copied IP payload
- user-agent fingerprinting fields

## MUA semantics

Current definition:

- one accepted allowlisted event = one useful action event occurrence.
- this version does not create user identity, deduplication, or cross-session profiles.
- Counts are directional usage signals, not unique-user, attribution, or fraud-resistant metrics.

## Query boundary

The dataset is queried only by authorised project operators through Cloudflare's
aggregate analytics tools. It has no public endpoint and does not power user
profiles, targeting, advertising, or automated decisions.
