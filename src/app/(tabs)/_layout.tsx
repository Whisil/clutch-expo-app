import { RequireAuth } from '@/src/components/auth/AuthGate'
import { colors } from '@/src/constants/colors'
import { FontAwesome5 } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <RequireAuth redirectTo="/signUp">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.green.default,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: colors.green.light,
            borderTopWidth: 0,
            paddingTop: 6,
            height: 'auto',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <FontAwesome5
                name="home"
                size={24}
                color={focused ? colors.green.default : 'rgba(0, 0, 0, 0.5)'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <FontAwesome5
                name="user-alt"
                size={24}
                color={focused ? colors.green.default : 'rgba(0, 0, 0, 0.5)'}
              />
            ),
          }}
        />
      </Tabs>
    </RequireAuth>
  )
}
