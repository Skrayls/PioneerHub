# PioneerHub Scam Shield MVP

## Purpose

Free Lithuanian pre-action safety tool for Pioneers who receive a suspicious message, link, app prompt or payment request.

## What it does

- asks only fixed, non-identifying risk-signal questions;
- highlights critical signals such as passphrase requests or upfront Pi requests;
- directs the user to stop, avoid received links and open official sources independently;
- links to Pi Safety as the primary source.

## What it does not do

- collect or store wallet addresses, passphrases, screenshots, chat content, Pi usernames, contact details or transaction data;
- inspect a wallet, message, URL or third-party app;
- make a safety guarantee, fraud accusation or financial recommendation;
- ask for Pi or enable payments.

## Decision logic

- **Critical:** passphrase/private-key request or request to send Pi, KYC fee or advance payment.
- **High:** impersonation, unsolicited link/app/form, urgency or guaranteed-return claim.
- **Caution:** no selected signal is not proof of safety; independently verify the recipient and official domain.

## Free versus future paid layer

The signal check and essential safety guidance remain free. Any future paid evidence pack may offer structured case organization or an exportable checklist only after demand, policy and payment gates are satisfied. It cannot restrict this MVP or core wallet safety guidance.
