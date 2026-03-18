import { Redirect, Stack } from 'expo-router'
import SignUpContent from '../components/auth/SignUpContent'
import { RedirectIfAuthed } from '@/src/components/auth/AuthGate'

export default function SignUpScreen() {
  return (
    <RedirectIfAuthed to="/(tabs)">
      <Stack.Screen options={{ headerShown: false }} />
      <SignUpContent />
    </RedirectIfAuthed>
  )
}
