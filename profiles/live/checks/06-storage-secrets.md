---
id: storage-secrets
name: No private keys or seed phrases in browser storage
severity: critical
kind: storage
fix: Never store private keys, seed phrases or signing secrets in localStorage or sessionStorage. Any script on the page can read them. Keep only public data, such as the wallet address, and leave signing to the wallet.
---
Go to {{url}} and wait until the page has fully loaded.
If the page is taller than the window, scroll down and back up. If it fits in the window, skip scrolling.
Assert: the page shows its main content and not an error page.
