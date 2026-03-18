import { Redirect } from 'expo-router'

import { useSession } from '@/src/hooks/useSession'

export default function Index() {
  const { session, initializing } = useSession()

  if (initializing) return null

  return <Redirect href={session ? '/(tabs)' : '/signUp'} />
}

