import { TEMPO_TOKEN } from '@/constants'
import { useSendTransaction, useWallets } from '@privy-io/react-auth'
import { useState } from 'react'
import { tempoTestnet } from 'viem/chains'
import {
  createPublicClient,
  encodeFunctionData,
  http,
  parseUnits,
  padHex,
  type Address,
} from 'viem'

const TIP20_ABI = [
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'transferWithMemo',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'memo', type: 'bytes32' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
] as const

const TOKEN_DECIMALS = 6

export function useSend() {
  const { wallets } = useWallets()
  const { sendTransaction } = useSendTransaction()
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  const send = async (to: string, amount: string, memo: string = '') => {
    if (isSending) return

    setIsSending(true)
    setError(null)
    setTxHash(null)

    try {
      const embeddedWallet = wallets.find(
        (w) => w.walletClientType === 'privy'
      )
      if (!embeddedWallet?.address) {
        throw new Error('No embedded wallet found')
      }

      const publicClient = createPublicClient({
        chain: tempoTestnet,
        transport: http(),
      })

      const amountParsed = parseUnits(amount, TOKEN_DECIMALS)

      const hasMemo = memo && memo.trim()
      const data = hasMemo
        ? encodeFunctionData({
            abi: TIP20_ABI,
            functionName: 'transferWithMemo',
            args: [
              to as Address,
              amountParsed,
              padHex(`0x${Buffer.from(memo).toString('hex')}` as `0x${string}`, { size: 32 }),
            ],
          })
        : encodeFunctionData({
            abi: TIP20_ABI,
            functionName: 'transfer',
            args: [to as Address, amountParsed],
          })

      const { hash } = await sendTransaction(
        {
          to: TEMPO_TOKEN,
          data,
          chainId: tempoTestnet.id,
        },
        { address: embeddedWallet.address }
      )

      setTxHash(hash)
      await publicClient.waitForTransactionReceipt({ hash: hash as `0x${string}` })

      return hash
    } catch (err) {
      console.error('[useSend] Error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to send'
      setError(errorMessage)
      throw err
    } finally {
      setIsSending(false)
    }
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

