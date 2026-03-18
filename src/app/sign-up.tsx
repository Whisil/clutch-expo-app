import { StyleSheet, Text, View } from "react-native"

export default function SignUpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Blank sign-up screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#666",
    fontSize: 16,
  },
})
