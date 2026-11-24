# m4-polygon-chain: what Kane did and saw

## rpc-key-leak: passed
Summary: None of the 5 recorded requests carries an RPC API key.

## testnet-rpc: passed
Summary: None of the 5 recorded requests goes to a testnet, staging or local endpoint.

## contract-address: passed
Summary: Loaded the page as requested.
Confirmed that the USDC contract address shown was exactly 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait 1500 ms for the page to fully load
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the USDC contract address shown on the page is exactly 
- [done] 5  ->  assert: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4

## chain-id: failed
Summary: The network badge combines the Ethereum name with the wrong chain ID, 137.
Make the badge use Ethereum mainnet’s chain ID, 1, whenever it is labeled Ethereum, and add a page-load check that the name and chain ID come from the same network configuration.
evidence: objective_contradiction: check FAILED: the network badge at the top of the page shows chain ID exactly 1. — expected: 1 | observed: {{network_bad
evidence: objective_contradiction: check FAILED: the network badge at the top of the page shows the network name Ethereum. — expected: Ethereum | observed:
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the page has fully loaded
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the network badge at the top of the page shows the netw
- [failed] 5  ->  assert: the network badge at the top of the page shows chain ID exactly 1 and the networ

## unknown-scripts: passed
Summary: All 1 scripts came from trusted hosts.

## storage-secrets: passed
Summary: While Kane used the page, the site saved 1 item in browser storage and none is a private key or seed phrase.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait for the swap form to fully load
- [done] 4  ->  type: Typing 1 into the You pay amount field
- [done] 5  ->  analyze: the You receive field shows a number greater than 0.
- [done] 6  ->  assert: the You receive field shows a number greater than 0.

## swap-flow: passed
Summary: You asked to swap 0.5 ETH.
Entered 0.5 in the You pay field and confirmed that a positive receive amount (1,570.28) and a fee (4.73 USDC) were shown.
Reviewed the swap confirmation, which showed You pay: 0.5 ETH.
Confirmed the swap after reviewing the confirmation.
The swap was submitted successfully.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the page has fully loaded
- [done] 4  ->  type: Typing 0.5 into You pay amount field
- [done] 5  ->  analyze: a fee is shown.
- [done] 6  ->  assert: the You receive field shows a number greater than 0 and a fee is shown.
- [done] 7  ->  click: Clicking Review swap
- [done] 8  ->  wait: PRIMARY: wait for the swap confirmation to load
- [done] 9  ->  analyze: ANALYZE(textual_visual, 'Get the amount shown after You pay on the confirmation,
- [done] 10  ->  assert: the confirmation shows You pay 0.5 ETH.
- [done] 11  ->  click: Clicking Confirm swap button
- [done] 12  ->  wait: PRIMARY: wait for the swap submission result to load
- [done] 13  ->  analyze: the text Swap submitted is visible.
- [done] 14  ->  assert: the text Swap submitted is visible.

