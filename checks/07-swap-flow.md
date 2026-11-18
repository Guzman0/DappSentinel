---
id: swap-flow
name: The swap flow works end to end
severity: high
fix: Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message.
---
Go to {{url}} and wait until the page has fully loaded.
Type 0.5 into the You pay amount field.
Assert: the You receive field shows a number greater than 0 and a fee is shown.
Click Review swap.
Assert: the confirmation shows You pay 0.5 ETH.
Click Confirm swap.
Assert: the text Swap submitted is visible.
