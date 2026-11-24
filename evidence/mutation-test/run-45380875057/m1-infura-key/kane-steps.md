# m1-infura-key: what Kane did and saw

## rpc-key-leak: failed
Summary: Kane's network recording shows 1 request carrying an RPC API key in the URL.
- finding: POST https://mainnet.infura.io/v3/3f9c…a65

## testnet-rpc: passed
Summary: None of the 5 recorded requests goes to a testnet, staging or local endpoint.

## contract-address: passed
Summary: The requested page was allowed to finish loading.
The USDC contract address shown on the page was checked character by character, ignoring letter case.
The displayed address matched 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: Let the page fully load
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the USDC contract address shown on the page is exactly 
- [done] 5  ->  assert: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4

## chain-id: passed
Summary: Waited for the page to finish loading.
Confirmed that the network badge at the top shows Ethereum with chain ID 1.
The requested page check completed successfully.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the page has fully loaded
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the network badge at the top of the page shows the netw
- [done] 5  ->  assert: the network badge at the top of the page shows chain ID exactly 1 and the networ

## unknown-scripts: passed
Summary: All 1 scripts came from trusted hosts.

## storage-secrets: passed
Summary: While Kane used the page, the site saved 1 item in browser storage and none is a private key or seed phrase.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait 1000 ms for the page to fully load
- [done] 4  ->  type: Typing 1 into You pay amount field
- [done] 5  ->  analyze: The You receive field shows a number greater than 0.
- [done] 6  ->  assert: the You receive field shows a number greater than 0.

## swap-flow: passed
Summary: Completed the requested swap flow by entering 0.5 ETH, reviewing the swap, and confirming it.
The estimated amount to receive was 1,570.28, and a 0.3% fee was shown.
The review screen listed “You pay” as 0.5 ETH.
The swap was submitted successfully, with a “Swap submitted” message displayed.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the swap page has fully loaded
- [done] 4  ->  type: Typing 0.5 into You pay amount field
- [done] 5  ->  analyze: a fee is shown
- [done] 6  ->  assert: the You receive field shows a number greater than 0 and a fee is shown
- [done] 7  ->  click: Clicking Review swap button
- [done] 8  ->  analyze: ANALYZE(textual_visual, 'the amount shown after You pay on the confirmation, exa
- [done] 9  ->  assert: the confirmation shows You pay 0.5 ETH
- [done] 10  ->  click: Clicking Confirm swap button
- [done] 11  ->  analyze: the text Swap submitted is visible
- [done] 12  ->  assert: the text Swap submitted is visible

