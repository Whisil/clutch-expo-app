import { FontAwesome5 } from '@expo/vector-icons'
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native'
import { colors } from '@/src/constants/colors'

type ProfileAvatarProps = {
  avatarUrl?: string | null
  uploading?: boolean
  onPress: () => void
}

export default function ProfileAvatar({
  avatarUrl,
  uploading,
  onPress,
}: ProfileAvatarProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image
        source={
          avatarUrl
            ? { uri: avatarUrl }
            : require('@/assets/images/avatar-placeholder.jpg')
        }
        style={styles.avatar}
      />

      {uploading && (
        <View style={styles.overlay}>
          <ActivityIndicator color={colors.white.default} />
        </View>
      )}

      <View style={styles.editButton}>
        <FontAwesome5 name="camera" size={14} color={colors.black.default} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.white.default,
    backgroundColor: colors.white.mellow,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.white.default,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
})
