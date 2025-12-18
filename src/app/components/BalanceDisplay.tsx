'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useBalance } from '@/hooks/useBalance'

export function BalanceDisplay() {
  const { authenticated } = usePrivy()
  const { balance, symbol, isLoading } = useBalance()

  if (!authenticated) {
    return null
  }

  if (isLoading) {
    return <p>Loading balance...</p>
  }

  return (
    <div>
      <p>
        Balance: {balance ?? '0'} {symbol}
      </p>
    </div>
  )
}
