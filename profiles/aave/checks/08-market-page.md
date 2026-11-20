---
id: market-page
name: Kane can use Aave's USDC market page and it shows the market's numbers
severity: high
kind: assert
fix: The market page didn't show its numbers in a real browser. Check that the reserve page loads and shows the supply rate and the amounts supplied.
---
Go to {{url}} and wait until the page has fully loaded. If a cookie or notice banner appears, close it.
Do not connect a wallet. Do not click Supply, Borrow or any button that would start a transaction.
Assert: the page is about USDC (USD Coin).
Assert: the page shows that this USDC market is on Ethereum.
Assert: the page shows a supply APY as a percentage.
Assert: the page shows a total supplied amount for USDC.
