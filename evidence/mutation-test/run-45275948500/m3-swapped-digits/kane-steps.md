# m3-swapped-digits: what Kane did and saw

## rpc-key-leak: passed
Summary: None of the 5 recorded requests carries an RPC API key.

## testnet-rpc: passed
Summary: None of the 5 recorded requests goes to a testnet, staging or local endpoint.

## contract-address: failed
Summary: The verification was configured with `{{usdc_contract_address_check}}` as its observed value rather than the text displayed on the page. The screenshots show the requested USDC address is present.
Fix the assertion configuration so it extracts the visible USDC contract text, then compare its full value case-insensitively.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: let the page fully load
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the USDC contract address shown on the page is exactly 
- [failed] 5  ->  assert: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4

## chain-id: passed
Summary: Waited for the page to finish loading.
Confirmed that the network badge at the top of the page shows Ethereum with chain ID 1.
The requested page check completed successfully.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: Wait until the page has fully loaded
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the network badge at the top of the page shows the netw
- [done] 5  ->  assert: the network badge at the top of the page shows chain ID exactly 1 and the networ

## unknown-scripts: passed
Summary: All 1 scripts came from trusted hosts.

## storage-secrets: passed
Summary: While Kane used the page, the site saved 1 item in browser storage and none is a private key or seed phrase.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait 1000 ms for the swap page to fully load
- [done] 4  ->  type: Typing 1 into the You pay amount field
- [done] 5  ->  analyze: The You receive field shows a number greater than 0.
- [done] 6  ->  assert: the You receive field shows a number greater than 0.

## swap-flow: passed
Summary: Entered 0.5 ETH in the payment amount after the swap page loaded.
Verified that the swap would return 1570.28 in the receive field and that a 0.3% fee was displayed.
Reviewed the swap confirmation, which showed “You pay 0.5 ETH.”
Confirmed the swap and received the “Swap submitted” confirmation.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the page has fully loaded
- [done] 4  ->  type: Typing 0.5 in You pay amount field
- [done] 5  ->  analyze: a fee is shown
- [done] 6  ->  assert: the You receive field shows a number greater than 0 and a fee is shown
- [done] 7  ->  click: Clicking Review swap button
- [done] 8  ->  analyze: ANALYZE(textual_visual, 'the amount shown after You pay on the confirmation, exa
- [done] 9  ->  assert: the confirmation shows You pay 0.5 ETH
- [done] 10  ->  click: Clicking Confirm swap button
- [done] 11  ->  analyze: the text Swap submitted is visible
- [done] 12  ->  assert: the text Swap submitted is visible

