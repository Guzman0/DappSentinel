---
id: storage-secrets
name: No private keys or seed phrases in browser storage
severity: critical
kind: storage
fix: Never store private keys, seed phrases or signing secrets in localStorage or sessionStorage. Any script on the page can read them. Keep only public data, such as the wallet address, and leave signing to the wallet.
---
Go to {{url}} and wait until the page has fully loaded.
Scroll to the bottom of the page and back to the top.
Assert: the page shows its main content and not an error page.
