---
id: browse
name: The site loads and Kane can browse it
severity: high
kind: assert
fix: The page did not load in a real browser. Check that the URL is right and the site is up.
---
Go to {{url}} and wait until the page has fully loaded.
Scroll to the bottom of the page and back to the top.
Assert: the page shows its main content and not an error page.
