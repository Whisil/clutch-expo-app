import AsyncStorage from "@react-native-async-storage/async-storage"
import { createClient } from "@supabase/supabase-js"
import { AppState } from "react-native"
import "react-native-url-polyfill/auto"
import { Database } from "../types/supabase"

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_KEY

if (!supabaseUrl) {
  throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL")
}

if (!supabaseAnonKey) {
  throw new Error("Missing EXPO_PUBLIC_SUPABASE_ANON_KEY (or EXPO_PUBLIC_SUPABASE_KEY)")
}

const globalWithSupabase = globalThis as typeof globalThis & {
  __supabaseAutoRefreshBound?: boolean
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

if (!globalWithSupabase.__supabaseAutoRefreshBound) {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh()
      return
    }

    supabase.auth.stopAutoRefresh()
  })

  globalWithSupabase.__supabaseAutoRefreshBound = true
}
