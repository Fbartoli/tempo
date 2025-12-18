import { TEMPO_TOKEN } from '@/constants'
import { useWallets } from '@privy-io/react-auth'
import { useState } from 'react'
import {tempoTestnet} from 'viem/chains'
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
    
    console.log('[useSend] Starting send transaction')
    setIsSending(true)
    setError(null)
    setTxHash(null)

    const timeoutId = setTimeout(() => {
      console.log('[useSend] Timeout: Resetting isSending')
      setIsSending(false)
    }, 10000)

    const resetState = () => {
      console.log('[useSend] Resetting isSending to false')
      clearTimeout(timeoutId)
      setIsSending(false)
    }

    const executeTransaction = async () => {
      try {
        const wallet = wallets[0]
        if (!wallet?.address) {
          const errMsg = 'No active wallet'
          setError(errMsg)
          resetState()
          return
        }
        
        const provider = await wallet.getEthereumProvider()
        const client = createWalletClient({
          account: wallet.address as Address,
          chain: tempoTestnet,
          transport: custom(provider),
        })
          .extend(walletActions)
          .extend(tempoActions())

        const metadata = await client.token.getMetadata({
          token: TEMPO_TOKEN,
        })

        const transferParams: any = {
          to: to as Address,
          amount: parseUnits(amount, metadata.decimals),
          token: TEMPO_TOKEN,
        }
        
        if (memo && memo.trim()) {
          transferParams.memo = stringToHex(memo, { size: 32 })
        }

        const { receipt } = await client.token.transferSync(transferParams)

        setTxHash(receipt.transactionHash)
        resetState()
        return receipt.transactionHash
      } catch (err) {
        debugger; // Breakpoint on error
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

