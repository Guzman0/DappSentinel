# m6-seed-in-session: what Kane did and saw

## rpc-key-leak: passed
Summary: None of the 5 recorded requests carries an RPC API key.

## testnet-rpc: passed
Summary: None of the 5 recorded requests goes to a testnet, staging or local endpoint.

## contract-address: passed
Summary: Let the page finish loading as requested.
Confirmed that the USDC contract address shown on the page matches 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.
Completed successfully.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait 1500 ms for the page to fully load
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the USDC contract address shown on the page is exactly 
- [done] 5  ->  assert: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4

## chain-id: passed
Summary: Waited for the page to finish loading.
Confirmed that the network badge at the top of the page shows Ethereum with Chain ID 1.
The requested page check completed successfully.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait 1000 ms for the page to fully load
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the network badge at the top of the page shows the netw
- [done] 5  ->  assert: the network badge at the top of the page shows chain ID exactly 1 and the networ

## unknown-scripts: passed
Summary: All 1 scripts came from trusted hosts.

## storage-secrets: failed
Summary: While Kane used the page, the site saved 2 items in browser storage, including 1 secret any script on the page could read.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait 1000 ms for the page to fully load
- [done] 4  ->  type: Entering 1 into You pay amount field
- [done] 5  ->  analyze: the You receive field shows a number greater than 0
- [done] 6  ->  assert: the You receive field shows a number greater than 0
- finding: sessionStorage["backup"] holds a value that looks like a seed phrase

## swap-flow: failed
Summary: Credits exhausted: {"error":"insufficient credits"}
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the page has fully loaded
- [done] 4  ->  type: Typing 0.5
- [failed] 5  ->  agent_info: Credits exhausted: {"error":"insufficient credits"}

