# m1-infura-key: what Kane did and saw

## rpc-key-leak: failed
Summary: Kane's network recording shows 1 request carrying an RPC API key in the URL.
- finding: POST https://mainnet.infura.io/v3/3f9c…a65

## testnet-rpc: passed
Summary: None of the 5 recorded requests goes to a testnet, staging or local endpoint.

## contract-address: passed
Summary: The page was allowed to finish loading.
The USDC contract address shown on the page was checked and matched the requested address exactly: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.
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
- [done] 3  ->  wait: PRIMARY: wait for the Swap page to fully load
- [done] 4  ->  type: Typing payment amount 1
- [done] 5  ->  analyze: The You receive field shows a number greater than 0.
- [done] 6  ->  assert: the You receive field shows a number greater than 0

## swap-flow: passed
Summary: Requested a swap of 0.5 ETH.
Entered 0.5 in the payment amount; the page showed a receive amount of 1,570.28 and a fee.
Reviewed the swap and confirmed that the review showed payment of 0.5 ETH.
Confirmed the swap successfully; the page displayed “Swap submitted.”
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the heading "Swap" is visible
- [done] 4  ->  type: Typing 0.5 into the You pay amount field
- [done] 5  ->  analyze: a fee is shown
- [done] 6  ->  assert: the You receive field shows a number greater than 0 and a fee is shown
- [done] 7  ->  click: Clicking Review swap button
- [done] 8  ->  wait: PRIMARY: wait until the heading "Confirm swap" is visible
- [done] 9  ->  analyze: the confirmation shows You pay 0.5 ETH
- [done] 10  ->  assert: the confirmation shows You pay 0.5 ETH
- [done] 11  ->  click: Clicking Confirm swap
- [done] 12  ->  analyze: the text Swap submitted is visible
- [done] 13  ->  assert: the text Swap submitted is visible

