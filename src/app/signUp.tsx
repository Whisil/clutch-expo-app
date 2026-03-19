import { RedirectIfAuthed } from '@/src/components/auth/AuthGate'
import { Stack } from 'expo-router'
import SignUpContent from '../components/auth/SignUpContent'

const SignUpScreen = () => {
  return (
    <RedirectIfAuthed to="/(tabs)">
      <Stack.Screen />
      <SignUpContent />
    </RedirectIfAuthed>
  )
}

export default SignUpScreen
