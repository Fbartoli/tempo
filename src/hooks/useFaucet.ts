import { TEMPO_TOKEN } from '@/constants'
import { useWallets } from '@privy-io/react-auth'
import { useState } from 'react'
import { tempoTestnet } from 'viem/chains'
import { tempoActions } from 'viem/tempo'
import {
  createPublicClient,
  http,
  type Address,
} from 'viem'

export function useFaucet() {
  const { wallets } = useWallets()
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const walletAddress = wallets[0]?.address as Address | undefined

  const fund = async () => {
    if (!walletAddress || isPending) return

    setIsPending(true)
    setIsSuccess(false)
    setError(null)

    try {
      const client = createPublicClient({
        chain: tempoTestnet,
        transport: http(),
      }).extend(tempoActions())

      await client.faucet.fund({
        account: walletAddress,
      })

      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fund')
      throw err
    } finally {
      setIsPending(false)
    }
  }

  return {
    fund,
    isPending,
    isSuccess,
    error,
    reset: () => {
      setIsSuccess(false)
      setError(null)
    },
  }
}




