import DatePickerModal from '@/src/components/shared/forms/DatePickerModal'
import Input from '@/src/components/shared/forms/Input'
import Heading from '@/src/components/shared/typography/Heading'
import Text from '@/src/components/shared/typography/Text'
import { colors } from '@/src/constants/colors'
import { zodResolver } from '@hookform/resolvers/zod'
import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'
import { z } from 'zod'
import Button from '../shared/Button'
import ModeToggle from './ModeToggle'
import { signInWithEmailPassword, signUpWithEmailPassword } from './authActions'

export type AuthMode = 'signUp' | 'signIn'

const emailSchema = z.string().trim().email('Enter a valid email')
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password is too long')

const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required'),
  email: emailSchema,
  password: passwordSchema,
  birthDate: z
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
})

type SignInValues = z.infer<typeof signInSchema>
type SignUpValues = z.infer<typeof signUpSchema>

function formatIsoDateForDisplay(iso?: string) {
  if (!iso?.trim()) return ''
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return ''
  return iso
}

export default function SignUpContent() {
  const router = useRouter()

  const [mode, setMode] = useState<AuthMode>('signIn')
  const [banner, setBanner] = useState<{
    kind: 'error' | 'info'
    text: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const schema = useMemo(
    () => (mode === 'signUp' ? signUpSchema : signInSchema),
    [mode],
  )

  const form = useForm<SignUpValues | SignInValues>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === 'signUp'
        ? { fullName: '', email: '', password: '', birthDate: '' }
        : { email: '', password: '' },
    mode: 'onSubmit',
  })

  const { control, handleSubmit, formState, reset } = form

  const resetForMode = (next: AuthMode, email?: string) => {
    reset(
      next === 'signUp'
        ? { fullName: '', email: '', password: '', birthDate: '' }
        : { email: email ?? '', password: '' },
    )
  }

  const onSubmit = handleSubmit(async (values) => {
    setBanner(null)
    setLoading(true)
    try {
      if (mode === 'signIn') {
        const v = values as SignInValues
        const { data, error } = await signInWithEmailPassword(v)
        if (error) throw error
        if (data.session) {
          router.replace('/(tabs)')
        }
        return
      }

      const v = values as SignUpValues
      const { data, error } = await signUpWithEmailPassword({
        fullName: v.fullName,
        email: v.email,
        password: v.password,
        birthDate: v.birthDate,
      })
      if (error) throw error

      if (data.session) {
        router.replace('/(tabs)')
        return
      }

      setMode('signIn')
      resetForMode('signIn', v.email)
    } catch (e: any) {
      setBanner({
        kind: 'error',
        text:
          typeof e?.message === 'string' ? e.message : 'Something went wrong',
      })
    } finally {
      setLoading(false)
    }
  })

  const title = mode === 'signIn' ? 'Welcome' : 'Get Started Now'
  const subtitle =
    mode === 'signIn'
      ? 'Log in to access your account'
      : 'Create an account or log in to explore our app'

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Heading weight="black" size="medium">
            {title}
          </Heading>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <ModeToggle
          mode={mode}
          disabled={loading}
          onChange={(next) => {
            if (next === mode) return
            setBanner(null)
            setMode(next)
            resetForMode(next)
          }}
        />

        {banner && (
          <View
            style={[
              styles.banner,
              banner.kind === 'error' ? styles.bannerError : styles.bannerInfo,
            ]}
          >
            <Text weight="medium">{banner.text}</Text>
          </View>
        )}

        {mode === 'signUp' && (
          <View style={styles.field}>
            <Text style={styles.label}>Full name</Text>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={(value as string) ?? ''}
                  onChange={onChange}
                  placeholder="Your full name"
                  autoCapitalize="words"
                  textContentType="name"
                  editable={!loading}
                />
              )}
            />
            {'fullName' in formState.errors && (
              <Text style={styles.errorText}>
                {formState.errors.fullName?.message as string}
              </Text>
            )}
          </View>
        )}

        {mode === 'signUp' && (
          <View style={styles.field}>
            <Text style={styles.label}>Birth date (optional)</Text>
            <Controller
              control={control}
              name="birthDate"
              render={({ field: { onChange, value } }) => {
                const displayed = formatIsoDateForDisplay(value as string)

                const selectedDate =
                  displayed && /^\d{4}-\d{2}-\d{2}$/.test(displayed)
                    ? new Date(`${displayed}T00:00:00Z`)
                    : new Date('2000-01-01T00:00:00Z')

                return (
                  <>
                    <Pressable
                      accessibilityRole="button"
                      disabled={loading}
                      onPress={() => setIsDatePickerOpen(true)}
                      style={[
                        styles.dateButton,
                        loading && styles.dateButtonDisabled,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dateButtonText,
                          !displayed && styles.datePlaceholder,
                        ]}
                      >
                        {displayed || 'Select date'}
                      </Text>
                    </Pressable>

                    {isDatePickerOpen ? (
                      Platform.OS === 'ios' ? (
                        <DatePickerModal
                          visible
                          value={selectedDate}
                          maximumDate={new Date()}
                          onConfirm={(d) => {
                            const iso = d.toISOString().slice(0, 10)
                            onChange(iso)
                          }}
                          onClear={() => onChange('')}
                          onClose={() => setIsDatePickerOpen(false)}
                        />
                      ) : (
                        <DateTimePicker
                          value={selectedDate}
                          mode="date"
                          display="default"
                          onValueChange={(
                            _event: DateTimePickerChangeEvent,
                            date: Date,
                          ) => {
                            setIsDatePickerOpen(false)
                            const iso = date.toISOString().slice(0, 10)
                            onChange(iso)
                          }}
                          onDismiss={() => setIsDatePickerOpen(false)}
                          maximumDate={new Date()}
                        />
                      )
                    ) : null}
                  </>
                )
              }}
            />
            {'birthDate' in formState.errors && (
              <Text style={styles.errorText}>
                {formState.errors.birthDate?.message as string}
              </Text>
            )}
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                value={(value as string) ?? ''}
                onChange={(t) => onChange(t.trim())}
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                editable={!loading}
              />
            )}
          />
          {'email' in formState.errors && (
            <Text style={styles.errorText}>
              {formState.errors.email?.message as string}
            </Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                value={(value as string) ?? ''}
                onChange={onChange}
                placeholder="Your password"
                type="password"
                textContentType={mode === 'signIn' ? 'password' : 'newPassword'}
                editable={!loading}
              />
            )}
          />
          {'password' in formState.errors && (
            <Text style={styles.errorText}>
              {formState.errors.password?.message as string}
            </Text>
          )}
        </View>

        <Button
          label={mode === 'signIn' ? 'Log In' : 'Sign Up'}
          onPress={onSubmit}
          disabled={!formState.isDirty}
          loading={loading}
          styles={styles.submitBtn}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: colors.green.light,
  },
  card: {
    backgroundColor: colors.white.default,
    borderRadius: 28,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    gap: 14,
  },
  header: {
    gap: 6,
  },
  subtitle: {
    opacity: 0.6,
    lineHeight: 18,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    opacity: 0.6,
  },
  errorText: {
    fontSize: 12,
    color: colors.red.default,
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
  bannerInfo: {
    backgroundColor: colors.blue.light,
    borderColor: 'rgba(11, 102, 248, 0.25)',
  },
  submitBtn: { marginTop: 12 },
  dateButton: {
    backgroundColor: colors.white.default,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateButtonDisabled: {
    opacity: 0.6,
  },
  dateButtonText: {
    fontSize: 14,
  },
  datePlaceholder: {
    opacity: 0.5,
  },
  datePickerWrap: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: colors.white.default,
  },
})
