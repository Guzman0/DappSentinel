# m8-wrong-recipient: what Kane did and saw

## rpc-key-leak: passed
Summary: None of the 5 recorded requests carries an RPC API key.

## testnet-rpc: passed
Summary: None of the 5 recorded requests goes to a testnet, staging or local endpoint.

## contract-address: failed
Summary: Credits exhausted: {"error":"insufficient credits"}
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [failed] 3  ->  agent_info: Credits exhausted: {"error":"insufficient credits"}

## chain-id: failed
Summary: Credits exhausted: {"error":"insufficient credits"}
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [failed] 3  ->  agent_info: Credits exhausted: {"error":"insufficient credits"}

## unknown-scripts: passed
Summary: All 1 scripts came from trusted hosts.

## storage-secrets: passed
Summary: While Kane used the page, the site saved 1 item in browser storage and none is a private key or seed phrase.
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [failed] 3  ->  agent_info: Credits exhausted: {"error":"insufficient credits"}

## swap-flow: failed
Summary: Credits exhausted: {"error":"insufficient credits"}
- [done] 2  ->  navigate: Navigate to http://localhost:4173
- [failed] 3  ->  agent_info: Credits exhausted: {"error":"insufficient credits"}

