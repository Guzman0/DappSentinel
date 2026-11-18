---
id: chain-id
name: The app targets the right chain
severity: high
fix: Set the chain ID to {{chainId}} ({{networkName}}) in the app config, and make the network badge read it from that single config.
---
Go to {{url}} and wait until the page has fully loaded.
Store the chain ID shown in the network badge at the top of the page as 'chain_id'.
Assert: the displayed chain ID is exactly {{chainId}} and the network name is {{networkName}}.
