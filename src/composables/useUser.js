import { supabase } from '@/composables/useSupabase.js'
import { ref } from 'vue'

export function useUser() {
  const userProfile = ref(null)

  const fetchUserProfile = async (email) => {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single()
    if (data) userProfile.value = data
    return { data, error }
  }

  return { userProfile, fetchUserProfile }
}
