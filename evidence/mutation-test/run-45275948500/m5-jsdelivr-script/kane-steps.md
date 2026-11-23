# m5-jsdelivr-script: what Kane did and saw

## rpc-key-leak: passed
Summary: None of the 6 recorded requests carries an RPC API key.

## testnet-rpc: passed
Summary: None of the 6 recorded requests goes to a testnet, staging or local endpoint.

## contract-address: passed
Summary: Let the page load and checked the USDC contract address shown on the page.
Confirmed that the displayed address exactly matched 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: let the page fully load
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the USDC contract address shown on the page is exactly 
- [done] 5  ->  assert: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4

## chain-id: passed
Summary: Waited for the page to finish loading as requested.
Confirmed that the network badge at the top shows Ethereum with Chain ID 1.
The page completed successfully at http://localhost:4173/.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the page has fully loaded
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the network badge at the top of the page shows the netw
- [done] 5  ->  assert: the network badge at the top of the page shows chain ID exactly 1 and the networ

## unknown-scripts: failed
Summary: Kane's network recording shows 1 script loaded from 1 untrusted host.
- finding: https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js  (from cdn.jsdelivr.net)

## storage-secrets: passed
Summary: While Kane used the page, the site saved 1 item in browser storage and none is a private key or seed phrase.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait 1000 ms for the page to fully load
- [done] 4  ->  type: Typing 1 into the You pay amount field
- [done] 5  ->  analyze: The You receive field shows a number greater than 0.
- [done] 6  ->  assert: the You receive field shows a number greater than 0

## swap-flow: failed
Summary: Credits exhausted: {"error":"insufficient credits"}
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the page has fully loaded
- [failed] 4  ->  agent_info: Credits exhausted: {"error":"insufficient credits"}

