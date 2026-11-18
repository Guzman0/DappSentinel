---
id: rpc-key-leak
name: No RPC API keys in network requests
severity: critical
kind: network
recording: swap-flow
fix: Remove provider API keys from frontend code. Use a keyless public RPC for read calls, or route keyed calls through a server-side proxy. Treat any key that was shipped as leaked and rotate it.
---
Scans the network traffic Kane recorded during the swap-flow run (its HAR log) for requests to
RPC providers ({{rpcKeyProviders}}) that carry an API key in the URL path or query string.
