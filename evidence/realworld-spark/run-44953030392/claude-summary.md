I removed the hardcoded Alchemy key from the app source. I didn't build or run anything, so the checks haven't been re-run.

- **`src/config/wagmi/getTransports.ts`:**
  - I deleted the hardcoded `ALCHEMY_API_KEY` constant and the Alchemy URL.
  - The mainnet transport now reads `import.meta.env.VITE_MAINNET_RPC_URL`.
  - If that variable isn't set, it falls back to `https://ethereum-rpc.publicnode.com`, which needs no key.
- **`.env.example`:** I added `VITE_MAINNET_RPC_URL=` with a comment saying that an empty value uses the public RPC.

**Why this should clear the report:**
- Only one check, `browse`, actually failed. It failed because the browser's fetch to the Alchemy URL was blocked, so the app showed an error screen.
- The other three checks (`rpc-key-leak`, `testnet-rpc`, `unknown-scripts`) were marked inconclusive only because `browse` didn't pass. They should resolve once the site loads.
- The public RPC should let the page load. I haven't confirmed that it allows requests from `http://localhost:4173`.

**Left alone:**
- **Key in git history:** the key is still in the repository history, so rotate it on the Alchemy side. This is separate from the source fix.
- **e2e test route:** `src/test/e2e/setup.ts:70` still aborts requests matching `/alchemy/`. It only affects e2e tests, so I didn't touch it.
