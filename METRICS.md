# Metrics plan

## North star

**Monthly Useful Actions (MUA)**: completed learning open, safety checklist progress/completion, App Radar outbound action, community contribution intent, or Payment Lab walkthrough interaction.

## Production status

- Telemetry emission: live.
- Privacy boundary: validated.
- Persisted/queryable observability reception: still open.

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
- Accepted logs contain only `event`, `kind: "mua"`, and deployment `version`.

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

Current v1 definition:

- one accepted allowlisted event = one useful action event occurrence.
- this version does not create user identity, deduplication, or cross-session profiles.
- before broad public acquisition, PioneerHub still needs one reliable aggregation/query path for monthly counts.
