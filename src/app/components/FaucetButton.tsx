'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useFaucet } from '@/hooks/useFaucet'

export function FaucetButton() {
  const { authenticated } = usePrivy()
  const { fund, isPending, isSuccess, error } = useFaucet()

  if (!authenticated) {
    return null
  }

  return (
    <div>
      <button
        onClick={() => fund()}
        disabled={isPending}
      >
        {isPending ? 'Funding...' : 'Get Testnet Funds'}
      </button>
      {isSuccess && <p>Funded successfully!</p>}
      {error && <p>Error: {error}</p>}
    </div>
  )
}
