import type { PrivyClientConfig } from '@privy-io/react-auth'
import { tempoTestnet } from 'viem/chains'


export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    ethereum: {
      createOnLogin: 'users-without-wallets',
    },
    showWalletUIs: false,
  },
  loginMethods: ['email', 'google'],
  defaultChain: tempoTestnet,
  supportedChains: [tempoTestnet],
}