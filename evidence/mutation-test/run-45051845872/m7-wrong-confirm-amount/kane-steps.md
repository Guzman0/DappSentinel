# m7-wrong-confirm-amount: what Kane did and saw

## rpc-key-leak: passed
Summary: None of the 5 recorded requests carries an RPC API key.

## testnet-rpc: passed
Summary: None of the 5 recorded requests goes to a testnet, staging or local endpoint.

## contract-address: passed
Summary: Loaded the page and checked the USDC contract address shown.
The displayed address exactly matched 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait 1500 ms for the page to fully load
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the USDC contract address shown on the page is exactly 
- [done] 5  ->  assert: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4

## chain-id: passed
Summary: Waited for the page to finish loading.
Confirmed that the network badge at the top shows Ethereum with chain ID 1.
The requested page check completed successfully.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the network badge at the top of the page is visible
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the network badge at the top of the page shows the netw
- [done] 5  ->  assert: the network badge at the top of the page shows chain ID exactly 1 and the networ

## unknown-scripts: passed
Summary: All 1 scripts came from trusted hosts.

## storage-secrets: passed
Summary: While Kane used the page, the site saved 1 item in browser storage and none is a private key or seed phrase.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait for the page to fully load
- [done] 4  ->  type: Typing 1 into You pay amount field
- [done] 5  ->  analyze: The You receive field shows a number greater than 0.
- [done] 6  ->  assert: the You receive field shows a number greater than 0.

## swap-flow: failed
Summary: After the user enters 0.5 ETH, the review confirmation displays 0.05 ETH instead. The confirmation amount is wrong by a factor of ten.
Correct the review-confirmation amount calculation or formatting so it preserves the entered 0.5 ETH value, then add a test that compares the input amount with the confirmation amount.
evidence: objective_contradiction: You pay 0.05 ETH
evidence: objective_contradiction: check FAILED: the confirmation shows You pay 0.5 ETH — expected: 0.5 | observed: {{confirmation_you_pay_amount}}
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait for the Swap page to fully load
- [done] 4  ->  type: Entering the payment amount
- [done] 5  ->  analyze: a fee is shown
- [done] 6  ->  assert: the You receive field shows a number greater than 0 and a fee is shown.
- [done] 7  ->  click: Clicking Review swap button
- [done] 8  ->  analyze: the confirmation shows You pay 0.5 ETH
- [failed] 9  ->  assert: the confirmation shows You pay 0.5 ETH.

