# m3-swapped-digits: what Kane did and saw

## rpc-key-leak: passed
Summary: None of the 5 recorded requests carries an RPC API key.

## testnet-rpc: passed
Summary: None of the 5 recorded requests goes to a testnet, staging or local endpoint.

## contract-address: failed
Summary: The page showed the requested USDC contract address, but the test recorded '{{usdc_contract_address_check}}' as the observed value. That placeholder was not replaced with the actual page text before comparison.
Fix the assertion configuration so it extracts the visible USDC contract address rather than comparing the unresolved '{{usdc_contract_address_check}}' placeholder.
evidence: objective_contradiction: check FAILED: The USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48. — expec
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: let the page fully load
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'The USDC contract address shown on the page is exactly 
- [failed] 5  ->  assert: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4

## chain-id: passed
Summary: Waited for the page to finish loading as requested.
Confirmed that the network badge at the top of the page shows Ethereum with chain ID 1.
The requested page check completed successfully.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait 1000 ms for the page to fully load
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the network badge at the top of the page shows the netw
- [done] 5  ->  assert: the network badge at the top of the page shows chain ID exactly 1 and the networ

## unknown-scripts: passed
Summary: All 1 scripts came from trusted hosts.

## storage-secrets: passed
Summary: While Kane used the page, the site saved 1 item in browser storage and none is a private key or seed phrase.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait 1000 ms for the page to fully load
- [done] 4  ->  type: Typing 1 into the You pay amount field
- [done] 5  ->  analyze: the You receive field shows a number greater than 0
- [done] 6  ->  assert: the You receive field shows a number greater than 0

## swap-flow: passed
Summary: Requested a swap of 0.5 ETH.
Entered 0.5 in the payment amount field and verified that a positive receive amount (1570.28) and a 0.3% fee were displayed.
Reviewed the swap and confirmed that the payment amount was 0.5 ETH.
Confirmed the swap; the page displayed “Swap submitted.”
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the page has fully loaded
- [done] 4  ->  type: Typing 0.5 into You pay amount field
- [done] 5  ->  analyze: a fee is shown.
- [done] 6  ->  assert: the You receive field shows a number greater than 0 and a fee is shown.
- [done] 7  ->  click: Clicking Review swap
- [done] 8  ->  analyze: the confirmation shows You pay 0.5 ETH.
- [done] 9  ->  assert: the confirmation shows You pay 0.5 ETH.
- [done] 10  ->  click: Clicking Confirm swap button in the dialog
- [done] 11  ->  analyze: the text Swap submitted is visible.
- [done] 12  ->  assert: the text Swap submitted is visible.

