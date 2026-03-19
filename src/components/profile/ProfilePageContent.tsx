import Input from '@/src/components/shared/forms/Input'
import Text from '@/src/components/shared/typography/Text'
import { colors } from '@/src/constants/colors'
import { useProfile } from '@/src/hooks/useProfile'
import { zodResolver } from '@hookform/resolvers/zod'
import * as ImagePicker from 'expo-image-picker'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { z } from 'zod'
import Button from '../shared/Button'
import Heading from '../shared/typography/Heading'
import ProfileAvatar from './ProfileAvatar'
import ProfileDatePicker from './ProfileDatePicker'
import ProfileField from './ProfileField'

const topInsetPadding = 12

const profileSchema = z.object({
  full_name: z.string().trim().min(1, 'Full name is required'),
  date_of_birth: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => {
        if (!v) return true
        if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false
        const d = new Date(`${v}T00:00:00Z`)
        return !Number.isNaN(d.getTime())
      },
      { message: 'Use YYYY-MM-DD' },
    ),
  address: z.string().trim().optional(),
  avatar_src: z.string().optional().nullable(),
})

type ProfileValues = z.infer<typeof profileSchema>

const ProfilePageContent = () => {
  const insets = useSafeAreaInsets()
  const { profile, loading: profileLoading, updateProfile, uploadAvatar } = useProfile()

  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [banner, setBanner] = useState<{
    kind: 'error' | 'success'
    text: string
  } | null>(null)

  const { control, handleSubmit, formState, reset, setValue, watch } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: '', date_of_birth: '', address: '', avatar_src: null },
    mode: 'onSubmit',
  })

  const formAvatarSrc = watch('avatar_src')

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name ?? '',
        date_of_birth: profile.date_of_birth ?? '',
        address: profile.address ?? '',
        avatar_src: profile.avatar_src,
      })
    }
  }, [profile, reset])

  const handleAvatarPress = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      })

      if (!result.canceled && result.assets[0]) {
        setUploadingAvatar(true)
        setBanner(null)
        
        const publicUrl = await uploadAvatar(result.assets[0].uri)
        
        setValue('avatar_src', publicUrl, { shouldDirty: true })
        setBanner({ kind: 'success', text: 'Avatar uploaded. Press Save to apply.' })
      }
    } catch (e: any) {
      setBanner({
        kind: 'error',
        text: typeof e?.message === 'string' ? e.message : 'Failed to upload avatar',
      })
    } finally {
      setUploadingAvatar(false)
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    setBanner(null)
    setSaving(true)
    try {
      await updateProfile({
        full_name: values.full_name || null,
        date_of_birth: values.date_of_birth?.trim() || null,
        address: values.address?.trim() || null,
        avatar_src: values.avatar_src || null,
      })
      reset(values)
      setBanner({ kind: 'success', text: 'Profile saved successfully' })
    } catch (e: any) {
      setBanner({
        kind: 'error',
        text:
          typeof e?.message === 'string' ? e.message : 'Something went wrong',
      })
    } finally {
      setSaving(false)
    }
  })

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.screen, { paddingTop: insets.top + topInsetPadding }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Heading weight="black" size="medium">
            User Profile
          </Heading>
        </View>

        <ProfileAvatar
          avatarUrl={formAvatarSrc}
          uploading={uploadingAvatar}
          onPress={handleAvatarPress}
        />

        {profileLoading ? (
          <ActivityIndicator
            style={styles.loader}
            color={colors.green.default}
          />
        ) : (
          <View style={styles.card}>
            {banner && (
              <View
                style={[
                  styles.banner,
                  banner.kind === 'error'
                    ? styles.bannerError
                    : styles.bannerSuccess,
                ]}
              >
                <Text weight="medium">{banner.text}</Text>
              </View>
            )}

            <ProfileField
              label="Full name"
              error={
                'full_name' in formState.errors
                  ? (formState.errors.full_name?.message as string)
                  : undefined
              }
            >
              <Controller
                control={control}
                name="full_name"
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value ?? ''}
                    onChange={onChange}
                    placeholder="Your full name"
                    autoCapitalize="words"
                    textContentType="name"
                    editable={!saving}
                  />
                )}
              />
            </ProfileField>

            <ProfileField
              label="Date of birth (optional)"
              error={
                'date_of_birth' in formState.errors
                  ? (formState.errors.date_of_birth?.message as string)
                  : undefined
              }
            >
              <Controller
                control={control}
                name="date_of_birth"
                render={({ field: { onChange, value } }) => (
                  <ProfileDatePicker
                    value={value ?? ''}
                    onChange={onChange}
                    disabled={saving}
                  />
                )}
              />
            </ProfileField>

            <ProfileField label="Address (optional)">
              <Controller
                control={control}
                name="address"
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value ?? ''}
                    onChange={onChange}
                    placeholder="Your address"
                    autoCapitalize="sentences"
                    textContentType="streetAddressLine1"
                    editable={!saving}
                  />
                )}
              />
            </ProfileField>

            <Button
              label="Save"
              onPress={onSubmit}
              disabled={!formState.isDirty}
              loading={saving}
              styles={styles.submitBtn}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.green.light,
    flex: 1,
    paddingHorizontal: topInsetPadding,
    paddingBottom: 90,
  },
  scrollContent: {
    paddingBottom: 20,
    gap: 16,
  },
  header: {
    alignItems: 'center',
  },
  loader: {
    marginTop: 40,
  },
  card: {
    backgroundColor: colors.white.default,
    borderRadius: 28,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    gap: 14,
  },
  banner: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
  },
  bannerError: {
    backgroundColor: colors.red.light,
    borderColor: 'rgba(246, 63, 87, 0.35)',
  },
  bannerSuccess: {
    backgroundColor: colors.green.light,
    borderColor: 'rgba(43, 216, 135, 0.35)',
  },
  submitBtn: { marginTop: 4 },
})

export default ProfilePageContent
