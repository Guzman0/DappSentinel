# m4-polygon-chain: what Kane did and saw

## rpc-key-leak: passed
Summary: None of the 5 recorded requests carries an RPC API key.

## testnet-rpc: passed
Summary: None of the 5 recorded requests goes to a testnet, staging or local endpoint.

## contract-address: passed
Summary: Let the page finish loading as requested.
Confirmed that the displayed USDC contract address is exactly 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.
The requested address check completed successfully.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait 1500 ms for the page to fully load
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the USDC contract address shown on the page is exactly 
- [done] 5  ->  assert: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4

## chain-id: failed
Summary: The page loaded successfully, but the network badge is showing the wrong chain number for Ethereum.
Fix the network badge configuration so that Ethereum is paired with chain ID 1, then verify the displayed name and chain ID are taken from the same network setting.
evidence: objective_contradiction: check FAILED: the network badge at the top of the page shows chain ID exactly 1. — expected: 1 | observed: {{network_bad
evidence: objective_contradiction: check FAILED: the network badge at the top of the page shows the network name Ethereum. — expected: Ethereum | observed:
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the page has fully loaded
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the network badge at the top of the page shows chain ID
- [failed] 5  ->  assert: the network badge at the top of the page shows chain ID exactly 1 and the networ

## unknown-scripts: passed
Summary: All 1 scripts came from trusted hosts.

## storage-secrets: passed
Summary: While Kane used the page, the site saved 1 item in browser storage and none is a private key or seed phrase.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  type: Typing 1 into You pay amount field
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'The value shown in the You receive field is a number gr
- [done] 5  ->  assert: the You receive field shows a number greater than 0.

## swap-flow: failed
Summary: Credits exhausted: {"error":"insufficient credits"}
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the page has fully loaded
- [done] 4  ->  type: Typing 0.5 into You pay amount field
- [done] 5  ->  analyze: a fee is shown
- [done] 6  ->  assert: the You receive field shows a number greater than 0 and a fee is shown
- [done] 7  ->  click: Clicking Review swap button in the Swap form
- [done] 8  ->  analyze: ANALYZE(unknown, 'the amount shown after You pay on the confirmation is stored a
- [failed] 9  ->  agent_info: Credits exhausted: {"error":"insufficient credits"}

