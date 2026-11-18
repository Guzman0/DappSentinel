---
id: storage-secrets
name: No private keys or seed phrases in browser storage
severity: critical
fix: Never store private keys, seed phrases or signing secrets in localStorage or sessionStorage. Any script on the page can read them. Keep only public data, such as the wallet address, and leave signing to the wallet.
---
Go to {{url}} and let the page fully load.
Assert: localStorage and sessionStorage have no key named any of these: {{secretKeyNames}}.
Assert: no stored value, including values nested inside JSON, looks like a private key (0x followed by 64 hexadecimal characters) or a seed phrase (a list of 12 or 24 English words).
Report every offending key.
