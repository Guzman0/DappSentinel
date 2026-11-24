# m6-seed-in-session: what Kane did and saw

## rpc-key-leak: passed
Summary: None of the 5 recorded requests carries an RPC API key.

## testnet-rpc: passed
Summary: None of the 5 recorded requests goes to a testnet, staging or local endpoint.

## contract-address: passed
Summary: The requested page was allowed to finish loading.
The USDC contract address displayed on the page was checked against the requested value.
The displayed address exactly matched 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait 1500 ms for the page to fully load
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the USDC contract address shown on the page is exactly 
- [done] 5  ->  assert: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4

## chain-id: passed
Summary: Waited for the page to finish loading as requested.
Confirmed that the network badge at the top of the page shows Ethereum with chain ID 1.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the page has fully loaded
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the network badge at the top of the page shows the netw
- [done] 5  ->  assert: the network badge at the top of the page shows chain ID exactly 1 and the networ

## unknown-scripts: passed
Summary: All 1 scripts came from trusted hosts.

## storage-secrets: failed
Summary: While Kane used the page, the site saved 2 items in browser storage, including 1 secret any script on the page could read.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  type: Typing 1 into the You pay amount field
- [done] 4  ->  analyze: the You receive field shows a number greater than 0
- [done] 5  ->  assert: the You receive field shows a number greater than 0
- finding: sessionStorage["backup"] holds a value that looks like a seed phrase

## swap-flow: passed
Summary: You asked to swap 0.5 ETH and submit the swap.
Entered 0.5 in the payment field; the form showed 1,570.28 to receive and displayed a 0.3% fee.
Reviewed the confirmation, which showed “You pay 0.5 ETH,” then confirmed the swap.
The swap was submitted successfully.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the page has fully loaded
- [done] 4  ->  type: Entering you pay amount 0.5
- [done] 5  ->  analyze: a fee is shown
- [done] 6  ->  assert: the You receive field shows a number greater than 0 and a fee is shown
- [done] 7  ->  click: Clicking Review swap
- [done] 8  ->  analyze: ANALYZE(textual_visual, 'the amount shown after You pay on the confirmation, exa
- [done] 9  ->  assert: the confirmation shows You pay 0.5 ETH
- [done] 10  ->  click: Clicking Confirm swap
- [done] 11  ->  analyze: the text Swap submitted is visible
- [done] 12  ->  assert: the text Swap submitted is visible

