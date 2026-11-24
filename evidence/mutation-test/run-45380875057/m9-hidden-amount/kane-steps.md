# m9-hidden-amount: what Kane did and saw

## rpc-key-leak: passed
Summary: None of the 5 recorded requests carries an RPC API key.

## testnet-rpc: passed
Summary: None of the 5 recorded requests goes to a testnet, staging or local endpoint.

## contract-address: passed
Summary: Let the page finish loading as requested.
Confirmed that the USDC contract address displayed on the page exactly matched 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.
Completed successfully.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: let the page fully load
- [done] 4  ->  analyze: ANALYZE(textual_visual, 'the USDC contract address shown on the page is exactly 
- [done] 5  ->  assert: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4

## chain-id: passed
Summary: Waited for the page to finish loading.
Confirmed that the network badge at the top shows Ethereum with Chain ID 1.
The requested page-load check completed successfully.
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
- [done] 5  ->  analyze: the You receive field shows a number greater than 0
- [done] 6  ->  assert: the You receive field shows a number greater than 0

## swap-flow: failed
Summary: Kane passed this check, but what the user sees is not what the wallet is asked to sign.
Kane's own summary: Requested a swap for 0.5 ETH.
Entered 0.5 in the You pay field and confirmed that a positive receive amount (1570.28) and a fee were shown.
Reviewed the confirmation, which showed “You pay 0.5 ETH.”
Confirmed the swap successfully; the page displayed “Swap submitted.”
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [done] 3  ->  wait: PRIMARY: wait until the page has fully loaded
- [done] 4  ->  type: Entering 0.5 in You pay amount field
- [done] 5  ->  analyze: a fee is shown.
- [done] 6  ->  assert: the You receive field shows a number greater than 0 and a fee is shown.
- [done] 7  ->  click: Clicking Review swap button
- [done] 8  ->  analyze: ANALYZE(textual_visual, 'the amount shown after You pay on the confirmation, exa
- [done] 9  ->  assert: the confirmation shows You pay 0.5 ETH.
- [done] 10  ->  click: Clicking Confirm swap button
- [done] 11  ->  analyze: the text Swap submitted is visible.
- [done] 12  ->  assert: the text Swap submitted is visible.
- finding: Kane saw "You pay 0.5 ETH" on the confirmation, but the transaction sent to the wallet is for 5 ETH.

