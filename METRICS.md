# Metrics plan

## North star

**Monthly Useful Actions (MUA)**: completed learning lesson, safety checklist completion, trusted app outbound click, Testnet tutorial completion, support issue resolved, or future paid utility used.

## Baseline

All metrics start at zero; no analytics has been deployed.

## Events for first analytics implementation

`learn_topic_opened`, `safety_checklist_completed`, `radar_filter_used`, `app_outbound_clicked`, `payment_lab_started`, `payment_lab_completed`, `community_interest_clicked`.

Do not collect wallets, KYC status, raw IP addresses beyond necessary operations, or unnecessary identifiers. Measure activation, D7/D30 return, MUA, traffic source, real payments, conversion, Pi ARPPU and retained treasury only when applicable.
# Privacy-conscious MUA events

The Worker accepts only an exact, allowlisted event name at `POST /events`: `learn_article_open`, `safety_check_start`, `safety_check_complete`, `app_radar_view`, `app_open_external`, `report_scam`, `suggest_app`, `community_cta`, `payment_lab_start`, `payment_lab_complete`.

Payloads are never parsed as JSON and arbitrary values are silently discarded. Each accepted log record contains only `event`, `kind: "mua"`, and deployment `version`. It contains no wallet address, username, email, IP copied into payload, passphrase, token, session, user-agent or free-form text.

**MUA:** one allowlisted useful action event; aggregate distinct events in the chosen reporting period only after defining a privacy-safe aggregation process. This v1 intentionally creates no user identity or cross-session profile.
