---
id: contract-address
name: Displayed contract addresses match the expected ones
severity: critical
fix: Use the exact expected contract address for each token, from one verified source of truth. A single wrong character sends users to a different contract.
---
Go to {{url}} and wait until the page has fully loaded.
For each token below, find the contract address shown on the page and store it.
{{contractsList}}
Assert: every displayed contract address exactly matches its expected address, ignoring upper and lower case. Report the displayed and the expected value for any mismatch.
