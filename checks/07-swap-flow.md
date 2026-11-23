---
id: swap-flow
name: The swap flow works end to end
severity: high
fix: Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message. The transaction sent to the wallet must match the confirmation exactly: the same amount, sent only to your trusted swap contract, with no token approvals for addresses you don't trust.
expect: confirm_pay_amount=0.5
wallet: confirm_pay_amount
---
Go to {{url}} and wait until the page has fully loaded.
Type 0.5 into the You pay amount field.
Assert: the You receive field shows a number greater than 0 and a fee is shown.
Click Review swap.
Store the amount shown after You pay on the confirmation, exactly as written, as confirm_pay_amount.
Assert: the confirmation shows You pay 0.5 ETH. Check this before clicking anything else.
Only after that check, click Confirm swap.
Assert: the text Swap submitted is visible.
