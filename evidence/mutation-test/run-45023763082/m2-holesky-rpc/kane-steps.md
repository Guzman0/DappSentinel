# m2-holesky-rpc: what Kane did and saw

## rpc-key-leak: passed
Summary: None of the 5 recorded requests carries an RPC API key.

## testnet-rpc: failed
Summary: Kane's network recording shows 1 request to a testnet, staging or local endpoint.
- finding: POST https://ethereum-holesky-rpc.publicnode.com/  (matches "holesky")

## contract-address: passed
Summary: Loaded the page as requested.
Confirmed that the USDC contract address displayed on the page is 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.
The displayed address matched the requested value exactly.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: let the page fully load
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the USDC contract address shown on the page is exactly 
- [done] 5  ->  assert: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4

## chain-id: passed
Summary: Waited for the page to finish loading as requested.
Confirmed that the network badge at the top shows Ethereum with Chain ID 1.
The page loaded successfully and the requested network details were displayed.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the page has fully loaded
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the network badge at the top of the page shows the netw
- [done] 5  ->  assert: the network badge at the top of the page shows chain ID exactly 1 and the networ

## unknown-scripts: passed
Summary: All 1 scripts came from trusted hosts.

## storage-secrets: passed
Summary: While Kane used the page, the site saved 1 item in browser storage and none is a private key or seed phrase.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait 500 ms for the swap page to finish loading
- [done] 4  ->  type: Typing 1 into You pay amount field
- [done] 5  ->  analyze: the You receive field shows a number greater than 0
- [done] 6  ->  assert: the You receive field shows a number greater than 0

## swap-flow: passed
Summary: Requested a swap of 0.5 ETH and asked to review and confirm it.
Entered 0.5 in the payment amount; the page showed a received amount of 1570.28 and displayed the 0.3% fee.
Reviewed the swap confirmation, which showed a payment of 0.5 ETH.
Confirmed the swap successfully; the page displayed “Swap submitted.”
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the page has fully loaded
- [done] 4  ->  type: Typing 0.5 into the You pay amount field
- [done] 5  ->  analyze: a fee is shown.
- [done] 6  ->  assert: the You receive field shows a number greater than 0 and a fee is shown.
- [done] 7  ->  click: Clicking Review swap button
- [done] 8  ->  wait: PRIMARY: wait for the Confirm swap page to finish loading
- [done] 9  ->  analyze: the confirmation shows You pay 0.5 ETH.
- [done] 10  ->  assert: the confirmation shows You pay 0.5 ETH.
- [done] 11  ->  click: Clicking Confirm swap
- [done] 12  ->  analyze: the text Swap submitted is visible.
- [done] 13  ->  assert: the text Swap submitted is visible.

