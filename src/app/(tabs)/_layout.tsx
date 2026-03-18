import { Tabs } from 'expo-router'

import { RequireAuth } from '@/src/components/auth/AuthGate'

export default function TabsLayout() {
  return (
    <RequireAuth redirectTo="/signUp">
    <Tabs>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
    </RequireAuth>
  )
}
