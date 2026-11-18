---
id: testnet-rpc
name: No testnet, staging or local endpoints in a mainnet build
severity: critical
kind: network
recording: swap-flow
fix: Point every RPC and API call at production endpoints for {{networkName}} (chain ID {{chainId}}). Load endpoints from one config per environment so testnet URLs cannot ship to production.
---
Scans the network traffic Kane recorded during the swap-flow run for requests, other than to the
site itself, whose URL contains {{testnetHints}}.
