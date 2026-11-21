# m5-jsdelivr-script: what Kane did and saw

## rpc-key-leak: passed
Summary: None of the 6 recorded requests carries an RPC API key.

## testnet-rpc: passed
Summary: None of the 6 recorded requests goes to a testnet, staging or local endpoint.

## contract-address: passed
Summary: Loaded the page as requested.
Verified that the displayed USDC contract address exactly matches 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.
The requested address check was completed successfully.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait 1500 ms for the page to fully load
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the USDC contract address shown on the page is exactly 
- [done] 5  ->  assert: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4

## chain-id: passed
Summary: Waited for the page to finish loading.
Confirmed that the network badge at the top shows Ethereum with chain ID 1.
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
- [done] 3  ->  wait: PRIMARY: wait for the page to fully load
- [done] 4  ->  type: Typing 1 into the You pay amount field
- [done] 5  ->  analyze: ANALYZE(textual_visual, 'The value shown in the You receive field is a number gr
- [done] 6  ->  assert: the You receive field shows a number greater than 0

## swap-flow: passed
Summary: Requested a swap of 0.5 ETH.
Entered 0.5 in the payment amount field; the page showed 1,570.28 in the receive field and displayed a 0.3% fee.
Reviewed the swap and confirmed that the dialog showed “You pay 0.5 ETH.”
Confirmed the swap successfully; “Swap submitted” was displayed.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the page has fully loaded
- [done] 4  ->  type: Typing 0.5 into You pay amount field
- [done] 5  ->  analyze: a fee is shown
- [done] 6  ->  assert: the You receive field shows a number greater than 0 and a fee is shown
- [done] 7  ->  click: Clicking Review swap button
- [done] 8  ->  analyze: the confirmation shows You pay 0.5 ETH
- [done] 9  ->  assert: the confirmation shows You pay 0.5 ETH
- [done] 10  ->  click: Clicking Confirm swap button
- [done] 11  ->  analyze: the text Swap submitted is visible
- [done] 12  ->  assert: the text Swap submitted is visible

