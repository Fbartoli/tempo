'use client'

import { PrivyLoginButton } from './components/PrivyLoginButton'
import { FaucetButton } from './components/FaucetButton'
import { BalanceDisplay } from './components/BalanceDisplay'
import { SendPaymentForm } from './components/SendPaymentForm'

function App() {
  return (
    <div>
      <PrivyLoginButton />
      <BalanceDisplay />
      <FaucetButton />
      <SendPaymentForm />
    </div>
  )
}

export default App
