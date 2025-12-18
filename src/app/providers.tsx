'use client'

import { type ReactNode } from 'react'
import { PrivyProvider } from '@privy-io/react-auth'
import { privyConfig } from './privyConfig'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider appId='cm1q4mfkg00wvobwxl0g6nny4' config={privyConfig}>
      {children}
    </PrivyProvider>
  )
}
