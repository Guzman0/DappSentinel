---
id: unknown-scripts
name: Scripts only load from trusted hosts
severity: critical
kind: network
recording: browse
fix: Remove scripts loaded from third-party CDNs, or bundle them with the app. Every script that runs on a dApp page can read and change what the user signs, so drainers are often injected this way.
---
Scans the network traffic Kane recorded during the browse run for JavaScript files loaded from
any host other than {{allowedScriptHosts}}.
