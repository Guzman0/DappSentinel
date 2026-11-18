---
id: testnet-rpc
name: No testnet, staging or local endpoints in a mainnet build
severity: critical
fix: Point every RPC and API call at production endpoints for {{networkName}} (chain ID {{chainId}}). Load endpoints from one config per environment so testnet URLs cannot ship to production.
---
Go to {{url}} and let the page fully load.
Assert: apart from {{siteHost}} itself, no network request was made to a testnet, staging or localhost URL, such as a URL containing {{testnetHints}}.
