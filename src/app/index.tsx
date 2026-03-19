import { useSession } from '@/src/hooks/useSession'
import { Redirect } from 'expo-router'

const Index = () => {
  const { session, initializing } = useSession()

  if (initializing) return null

  return <Redirect href={session ? '/(tabs)' : '/signUp'} />
}

export default Index
