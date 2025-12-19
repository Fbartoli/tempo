import { TEMPO_TOKEN } from '@/constants'
import { useWallets } from '@privy-io/react-auth'
import { useState } from 'react'
import { tempoTestnet } from 'viem/chains'
import { tempoActions } from 'viem/tempo'

import {
  createWalletClient,
  custom,
  parseUnits,
  stringToHex,
  walletActions,
  type Address,
} from 'viem'

export function useSend() {
  const { wallets } = useWallets()
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  const send = (to: string, amount: string, memo: string = '') => {
    if (isSending) return Promise.resolve()
    
    setIsSending(true)
    setError(null)
    setTxHash(null)

    const timeoutId = setTimeout(() => {
      setIsSending(false)
    }, 30000)

    const resetState = () => {
      clearTimeout(timeoutId)
      setIsSending(false)
    }

    const executeTransaction = async () => {
      try {
        const embeddedWallet = wallets.find(
          (w) => w.walletClientType === 'privy'
        )
        if (!embeddedWallet?.address) {
          const errMsg = 'No embedded wallet found'
          setError(errMsg)
          resetState()
          return
        }
        
        const provider = await embeddedWallet.getEthereumProvider()
        const client = createWalletClient({
          account: embeddedWallet.address as Address,
          chain: tempoTestnet,
          transport: custom(provider),
        })
          .extend(walletActions)
          .extend(tempoActions())


        const transferParams = {
          to: to as Address,
          amount: parseUnits(amount, 6),
          token: TEMPO_TOKEN,
        }
        

        const receipt = await client.token.transfer({
          to: to as Address,
          amount: parseUnits(amount, 6),
          token: TEMPO_TOKEN,
        })

        resetState()
      } catch (err) {
        console.error('[useSend] Error caught:', err)
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to send'
        setError(errorMessage)
        resetState()
        throw err
      }
    }

    return executeTransaction()
  }

  return {
    send,
    isSending,
    error,
    txHash,
    reset: () => {
      setError(null)
      setTxHash(null)
    },
  }
}

