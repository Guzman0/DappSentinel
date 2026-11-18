---
id: rpc-key-leak
name: No RPC API keys in network requests
severity: critical
fix: Remove provider API keys from frontend code. Use a keyless public RPC for read calls, or route keyed calls through a server-side proxy. Treat any key that was shipped as leaked and rotate it.
---
Go to {{url}} and let the page fully load.
Assert: no network request was made to an RPC provider URL that contains an API key, such as {{rpcKeyExamples}}.
