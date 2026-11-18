---
id: storage-secrets
name: No private keys or seed phrases in browser storage
severity: critical
kind: storage
fix: Never store private keys, seed phrases or signing secrets in localStorage or sessionStorage. Any script on the page can read them. Keep only public data, such as the wallet address, and leave signing to the wallet.
---
Go to {{url}} and let the page fully load.
Type 1 into the You pay amount field.
Assert: the You receive field shows a number greater than 0.
