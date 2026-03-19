import { supabase } from '@/src/utils/supabase'

export async function signInWithEmailPassword(params: {
  email: string
  password: string
}) {
  return supabase.auth.signInWithPassword(params)
}

export async function signUpWithEmailPassword(params: {
  fullName: string
  email: string
  password: string
  birthDate?: string
}) {
  const birthDate = params.birthDate?.trim()
  return supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        full_name: params.fullName,
        date_of_birth: birthDate ? birthDate : null,
      },
    },
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}
