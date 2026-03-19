import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'

const RootLayout = () => {
  const [loaded] = useFonts({
    'Inter-Thin': require('@/assets/fonts/inter/Inter-Thin.ttf'),
    'Inter-Regular': require('@/assets/fonts/inter/Inter-Regular.ttf'),
    'Inter-Medium': require('@/assets/fonts/inter/Inter-Medium.ttf'),
    'Inter-SemiBold': require('@/assets/fonts/inter/Inter-SemiBold.ttf'),
    'Inter-Bold': require('@/assets/fonts/inter/Inter-Bold.ttf'),
    // eslint-disable-next-line max-len
    'MontserratAlt-Regular': require('@/assets/fonts/Montserrat-Alt/MontserratAlt-Regular.ttf'),
    // eslint-disable-next-line max-len
    'MontserratAlt-Medium': require('@/assets/fonts/Montserrat-Alt/MontserratAlt-Medium.ttf'),
    // eslint-disable-next-line max-len
    'MontserratAlt-Bold': require('@/assets/fonts/Montserrat-Alt/MontserratAlt-Bold.ttf'),
    // eslint-disable-next-line max-len
    'MontserratAlt-ExtraBold': require('@/assets/fonts/Montserrat-Alt/MontserratAlt-ExtraBold.ttf'),
    // eslint-disable-next-line max-len
    'MontserratAlt-Black': require('@/assets/fonts/Montserrat-Alt/MontserratAlt-Black.ttf'),
  })

  if (!loaded) {
    return null
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signUp" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  )
}

export default RootLayout
