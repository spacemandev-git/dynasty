
# Install

Contract addresses, abi, and types for dfdao's eternal grand prix.  
Includes the registry and reward contracts
```
yarn add @dfdao/dyntasty
```
# Deployment
Create `.env.production` and put `PRIVATE_KEY=<your_p_key>`.
Then run `yarn deploy:prod`

# Usage

```ts
// abis
import { abi as RegistryAbi } from "@dfdao/dynasty/abi/Registry.json";
import { abi as NFTAbi } from "@dfdao/dynasty/abi/NFT.json";
// Contract addresses
import { registry, nft } from "@dfdao/dynasty/deployment.json";

// assuming you're using wagmi.sh
const {
    data,
    isError,
    isLoading,
	} = useContractRead({
    addressOrName: registry,
    contractInterface: registryABI,
    functionName: "getAllGrandPrix",
    watch: true,
});
```

# Deployment 
1. `$ cp .env.example .env`
2. If deploying contracts to a public chain, switch out `PRIVATE_KEY`, `RPC_URL`, and `CHAIN_ID` in `.env` with the correct values for your chain.
3. `$ yarn deploy`. This will also copy the new values over to the Dynasty client.

# Local testing
Make sure you have [Foundry](https://github.com/foundry-rs/foundry) installed.

In your terminal, run:

```
yarn start:node
```

In another tab:

```
yarn deploy
```
The NFT and Registry contracts are now deployed locally.  
You can test them in the `client` by running `yarn dev` in `dynasty/client`