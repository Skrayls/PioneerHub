# PioneerHub human action — Testnet Developer Portal transaction

**Status: PAUSED_HUMAN.** The isolated transaction harness is deployed only after the release gates pass. Do not use Mainnet or real Pi.

1. In **Pi Browser**, open: `https://pioneerhub.andriussimonaitis.workers.dev/diag/pi-payment-checklist`
2. Before continuing, ensure the Developer Portal owner has a **Testnet wallet**: in Pi Browser open `wallet.pi`, use the network selector to choose **Testnet**, and create/open the wallet if it does not exist. The Developer Portal uses the developer's most recently accessed wallet address; transactions fail until a Testnet wallet exists.
3. Ensure the Testnet wallet has Test-Pi. The official Pi Wallet Testnet faucet initializes a Testnet wallet with Test-Pi and can provide more when the balance is low. Use only the Wallet's official Testnet faucet flow; Test-Pi has no value. Never share the wallet passphrase.
4. On the PioneerHub diagnostic page, press exactly: **Run Testnet checklist transaction**.
5. Approve Pi's `payments` permission if prompted. The Pi payment screen should show a **0.01 Test-Pi** payment with memo **“PioneerHub Testnet Developer Portal verification”**. Confirm that it is Testnet/Test-Pi, then confirm and sign the transaction in Pi Wallet.
6. Wait for PioneerHub to show: **“SUCCESS: PioneerHub server completed the Testnet transaction. Revisit Developer Portal to confirm the checklist item.”** Do not treat any earlier wallet or callback screen as success.
7. In Pi Browser open `pi://develop.pinet.com` (or the **Develop** tile), select **PioneerHub Testnet Lab**, open its **App Checklist**, and revisit **“Process a transaction on your app”** / the User-to-App transaction item. Confirm it is marked complete.

Do not send PioneerHub or OpenClaw a passphrase, private key, API key, access token, transaction-private data, or screenshots containing them. After the checklist confirms completion, report only that the checklist item is complete; the temporary trigger will then be disabled and removed.

Official basis: [Developer Portal](https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/devPortal/), [Pi Wallet Testnet faucet](https://pi-apps.github.io/community-developer-guide/docs/importantTopics/paymentFlow/piWallet/), [payment flow](https://pi-apps.github.io/community-developer-guide/docs/importantTopics/paymentFlow/piPaymentFlow/).
