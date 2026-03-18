import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'

export default function RootLayout() {
  const [loaded] = useFonts({
    'Inter-Thin': require('@/assets/fonts/inter/Inter-Thin.ttf'),
    'Inter-Regular': require('@/assets/fonts/inter/Inter-Regular.ttf'),
    'Inter-Medium': require('@/assets/fonts/inter/Inter-Medium.ttf'),
    'Inter-SemiBold': require('@/assets/fonts/inter/Inter-SemiBold.ttf'),
    'Inter-Bold': require('@/assets/fonts/inter/Inter-Bold.ttf'),
    'MontserratAlt-Regular': require('@/assets/fonts/Montserrat-Alt/MontserratAlt-Regular.ttf'),
    'MontserratAlt-Medium': require('@/assets/fonts/Montserrat-Alt/MontserratAlt-Medium.ttf'),
    'MontserratAlt-Bold': require('@/assets/fonts/Montserrat-Alt/MontserratAlt-Bold.ttf'),
    'MontserratAlt-ExtraBold': require('@/assets/fonts/Montserrat-Alt/MontserratAlt-ExtraBold.ttf'),
    'MontserratAlt-Black': require('@/assets/fonts/Montserrat-Alt/MontserratAlt-Black.ttf'),
  })

  if (!loaded) {
    return null
  }

  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="signUp" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  )
}
