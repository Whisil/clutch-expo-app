import { Stack } from 'expo-router'
import SignUpContent from '../components/auth/SignUpContent'

export default function SignUpScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SignUpContent />
    </>
  )
}
