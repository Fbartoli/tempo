import { TEMPO_TOKEN } from '@/constants'
import { useWallets } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'
import { tempoTestnet } from 'viem/chains'
import { tempoActions } from 'viem/tempo'
import {
  createPublicClient,
  formatUnits,
  type Address,
  custom,
} from 'viem'

export function useBalance() {
  const { wallets } = useWallets()
  const [balance, setBalance] = useState<string | null>(null)
  const [symbol, setSymbol] = useState<string>('USD')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const walletAddress = wallets.find(
    (w) => w.walletClientType === 'privy'
  )?.address as Address | undefined

  useEffect(() => {
    if (!walletAddress) {
      setBalance(null)
      return
    }

    const fetchBalance = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const embeddedWallet = wallets.find(
          (w) => w.walletClientType === 'privy'
        )
        if (!embeddedWallet?.address) {
          setError('No embedded wallet found')
          return
        }

        const client = createPublicClient({
          chain: tempoTestnet,
          transport: custom(await embeddedWallet.getEthereumProvider()),
        }).extend(tempoActions())

        const [balanceResult, metadata] = await Promise.all([
          client.token.getBalance({
            account: embeddedWallet.address as Address,
            token: TEMPO_TOKEN,
          }),
          client.token.getMetadata({
            token: TEMPO_TOKEN,
          }),
        ])

        setBalance(formatUnits(balanceResult, metadata.decimals))
        setSymbol(metadata.symbol)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch balance')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalance()
    
    // Refetch every 10 seconds
    const interval = setInterval(fetchBalance, 10000)
    return () => clearInterval(interval)
  }, [walletAddress])

  return {
    balance,
    symbol,
    isLoading,
    error,
    refetch: () => {
      if (walletAddress) {
        setIsLoading(true)
      }
    },
  }
}




