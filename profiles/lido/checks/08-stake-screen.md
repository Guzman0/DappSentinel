---
id: stake-screen
name: Kane can use Lido's stake screen and it shows a sane quote
severity: high
kind: assert
fix: The stake screen didn't show a usable quote in a real browser. Check that the form loads and shows the exchange rate and what you will receive.
---
Go to {{url}} and wait until the page has fully loaded. If a cookie or notice banner appears, close it.
Do not connect a wallet. Do not click Stake, Submit or any button that would start a transaction.
If the ETH amount field accepts typing, type 1 into it. If it doesn't, leave it empty.
Assert: the stake screen shows an exchange rate between ETH and stETH of about 1 to 1.
Assert: the stake screen shows a reward rate or APR as a percentage.
Assert: the page makes clear that staking here happens on Ethereum.
