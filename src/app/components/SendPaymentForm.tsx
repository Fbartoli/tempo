'use client'

import { useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useSend } from '@/hooks/useSend'

export function SendPaymentForm() {
  const { authenticated } = usePrivy()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')

  const { send, isSending, error, txHash, reset } = useSend()

  if (!authenticated) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipient || !amount) return

    try {
      await send(recipient, amount, memo)
    } catch {
      // Error is handled by the hook
    }
  }

  const handleReset = () => {
    setRecipient('')
    setAmount('')
    setMemo('')
    reset()
  }

  return (
    <div>
      <h3>Send Payment</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Recipient Address:
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              required
            />
          </label>
        </div>
        <div>
          <label>
            Amount (USD):
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="any"
              min="0"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Memo (optional):
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Payment for..."
            />
          </label>
        </div>
        <button type="submit" disabled={isSending}>
          {isSending ? 'Sending...' : 'Send Payment'}
        </button>
      </form>
      {txHash && (
        <div>
          <p>Payment sent successfully!</p>
          <p>Transaction: {txHash}</p>
          <button onClick={handleReset}>Send Another</button>
        </div>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  )
}
