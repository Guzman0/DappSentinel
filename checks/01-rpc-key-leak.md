---
id: rpc-key-leak
name: No RPC API keys in network requests
severity: critical
fix: Remove provider API keys from frontend code. Use a keyless public RPC for read calls, or route keyed calls through a server-side proxy. Treat any key that was shipped as leaked and rotate it.
---
Go to {{url}} and wait until the page has fully loaded and the footer shows the latest block.
Type 1 into the You pay amount field and wait 3 seconds.
Assert: no network request was made to an RPC provider URL that carries an API key. Fail if any request goes to one of these providers: {{rpcKeyProviders}}, with a long random token in the URL path (for example after /v2/ or /v3/) or in a query parameter named key, apikey or api_key.
Report every offending request URL.
