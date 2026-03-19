import { supabase } from '@/src/utils/supabase'
import { useEffect, useState } from 'react'
import { useSession } from './useSession'

export type ProfileData = {
  full_name: string | null
  date_of_birth: string | null
  address: string | null
}

export type UpdateProfileParams = {
  full_name: string | null
  date_of_birth: string | null
  address: string | null
}

export function useProfile() {
  const { session } = useSession()
  const userId = session?.user.id

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setProfile(null)
      setLoading(false)
      return
    }

    let mounted = true
    setLoading(true)

    supabase
      .from('profiles')
      .select('full_name, date_of_birth, address')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        if (!mounted) return
        if (!error && data) {
          setProfile({
            full_name: data.full_name ?? null,
            date_of_birth: data.date_of_birth ?? null,
            address: data.address ?? null,
          })
        }
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [userId])

  const updateProfile = async (params: UpdateProfileParams) => {
    if (!userId) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: params.full_name,
        date_of_birth: params.date_of_birth,
        address: params.address,
      })
      .eq('id', userId)

    if (error) throw error

    setProfile({
      full_name: params.full_name,
      date_of_birth: params.date_of_birth,
      address: params.address,
    })
  }

  return { profile, loading, updateProfile }
}
