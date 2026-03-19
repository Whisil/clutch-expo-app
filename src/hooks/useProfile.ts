import { supabase } from '@/src/utils/supabase'
import { useEffect, useState } from 'react'
import { useSession } from './useSession'

export type ProfileData = {
  full_name: string | null
  date_of_birth: string | null
  address: string | null
  avatar_src: string | null
}

export type UpdateProfileParams = {
  full_name: string | null
  date_of_birth: string | null
  address: string | null
  avatar_src: string | null
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
      .select('full_name, date_of_birth, address, avatar_src')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        if (!mounted) return
        if (!error && data) {
          setProfile({
            full_name: data.full_name ?? null,
            date_of_birth: data.date_of_birth ?? null,
            address: data.address ?? null,
            avatar_src: data.avatar_src ?? null,
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
        avatar_src: params.avatar_src,
      })
      .eq('id', userId)

    if (error) throw error

    setProfile({
      full_name: params.full_name,
      date_of_birth: params.date_of_birth,
      address: params.address,
      avatar_src: params.avatar_src,
    })
  }

  const uploadAvatar = async (localUri: string): Promise<string> => {
    if (!userId) throw new Error('Not authenticated')

    const fileExt = localUri.split('.').pop() || 'jpeg'
    const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const formData = new FormData()
    formData.append('file', {
      uri: localUri,
      name: fileName,
      type: `image/${fileExt}`,
    } as any)

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, formData)

    if (error) throw error

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    return data.publicUrl
  }

  return { profile, loading, updateProfile, uploadAvatar }
}
