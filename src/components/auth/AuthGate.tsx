import { useSession } from '@/src/hooks/useSession'
import { Redirect } from 'expo-router'
import React from 'react'

export function RedirectIfAuthed({
  to = '/(tabs)',
  children,
}: {
  to?: string
  children: React.ReactNode
}) {
  const { session, initializing } = useSession()
  if (initializing) return null
  if (session) return <Redirect href={to} />
  return <>{children}</>
}

export function RequireAuth({
  redirectTo = '/signUp',
  children,
}: {
  redirectTo?: string
  children: React.ReactNode
}) {
  const { session, initializing } = useSession()
  if (initializing) return null
  if (!session) return <Redirect href={redirectTo} />
  return <>{children}</>
}
