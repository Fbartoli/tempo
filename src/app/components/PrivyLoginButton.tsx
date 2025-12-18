'use client'

import { usePrivy } from '@privy-io/react-auth'

export function PrivyLoginButton() {
  const { ready, authenticated, login, logout, user } = usePrivy()

  if (!ready) {
    return <button disabled>Loading...</button>
  }

  if (authenticated) {
    return (
      <div>
        <p>Logged in as: {user?.wallet?.address || user?.email?.address || 'User'}</p>
        <button onClick={logout}>Logout</button>
      </div>
    )
  }

  return <button onClick={login}>Login with Privy</button>
}

