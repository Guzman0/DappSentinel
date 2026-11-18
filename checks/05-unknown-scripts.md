---
id: unknown-scripts
name: Scripts only load from trusted hosts
severity: critical
fix: Remove scripts loaded from third-party CDNs, or bundle them with the app. Every script that runs on a dApp page can read and change what the user signs, so drainers are often injected this way.
---
Go to {{url}} and wait until the page has fully loaded.
Assert: every JavaScript file the page requested (any request for a .js file or a script) was loaded from one of these trusted hosts: {{allowedScriptHosts}}.
Report the full URL of every script that came from any other host.
