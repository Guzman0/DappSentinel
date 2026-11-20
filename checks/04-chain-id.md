---
id: chain-id
name: The app targets the right chain
severity: high
fix: Set the chain ID to {{chainId}} ({{networkName}}) in the app config, and make the network badge read it from that single config.
---
Go to {{url}} and wait until the page has fully loaded.
Assert: the network badge at the top of the page shows chain ID exactly {{chainId}} and the network name {{networkName}}.
