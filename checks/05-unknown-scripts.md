---
id: unknown-scripts
name: Scripts only load from trusted hosts
severity: critical
fix: Remove scripts loaded from third-party CDNs, or bundle them with the app. Every script that runs on a dApp page can read and change what the user signs, so drainers are often injected this way.
---
Go to {{url}} and let the page fully load.
Assert: no JavaScript file was loaded from a host other than {{allowedScriptHosts}}.
