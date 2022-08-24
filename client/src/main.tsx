import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { Chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const optimisticGnosis: Chain = {
  id: 300,
  name: "Optimism on Gnosis",
  network: "Optimism on Gnosis Chain",
  nativeCurrency: {
    decimals: 18,
    name: "xDAI",
    symbol: "xDAI",
  },
  rpcUrls: {
    default: "https://optimism.gnosischain.com",
  },
  blockExplorers: {
    default: {
      name: "BlockScout",
      url: "https://blockscout.com/xdai/optimism",
    },
  },
  testnet: false,
};

const { chains, provider } = configureChains(
  [optimisticGnosis],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://optimism.gnosischain.com`,
      }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "dfdao Dynasty",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={darkTheme({
          borderRadius: "small",
        })}
      >
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
