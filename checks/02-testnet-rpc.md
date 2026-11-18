---
id: testnet-rpc
name: No testnet, staging or local endpoints in a mainnet build
severity: critical
fix: Point every RPC and API call at production endpoints for {{networkName}} (chain ID {{chainId}}). Load endpoints from one config per environment so testnet URLs cannot ship to production.
---
Go to {{url}} and wait until the page has fully loaded and the footer shows gas.
Type 1 into the You pay amount field and wait 3 seconds.
Assert: ignoring requests to the site itself ({{siteHost}}), no network request URL contains any of these words: {{testnetHints}}.
Report every offending request URL.
