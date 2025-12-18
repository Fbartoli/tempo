import type { PrivyClientConfig } from '@privy-io/react-auth'
import { tempoTestnet } from 'viem/chains'

// const tempoTestnet = {
//   id: 42429,
//   name: "Tempo Testnet",
//   nativeCurrency: { name: "USD", symbol: "USD", decimals: 6 },
//   rpcUrls: {
//     default: {
//       http: ["https://rpc.testnet.tempo.xyz"],
//       webSocket: ["wss://rpc.testnet.tempo.xyz"],
//     },
//   },
//   blockExplorers: {
//     default: { name: "Tempo Explorer", url: "https://explore.tempo.xyz" },
//   },
// } as const;

export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    ethereum: {
      createOnLogin: 'users-without-wallets',
    },
    showWalletUIs: false,
  },
  loginMethods: ['email'],
  defaultChain: tempoTestnet,
  supportedChains: [tempoTestnet],
}