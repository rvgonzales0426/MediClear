// stores/auth.js
import { defineStore } from 'pinia'
import { supabase } from '@/composables/useSupabase.js'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const userData = ref(null)
  const userSession = ref(null)

  // Listen for auth changes
  async function listenToAuthChanges() {
    supabase.auth.onAuthStateChange(async (_, session) => {
      userSession.value = session?.user || null
      console.log('Auth state changed:', session?.user?.email)

      // When auth state changes, fetch user profile
      if (session?.user) {
        await getUserInformation()
      } else {
        userData.value = null
      }
    })
  }

  // Get User Info from both auth and public.users table
  async function getUserInformation() {
    try {
      // Get auth user first
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw authError
      if (!user) {
        userData.value = null
        return
      }

      console.log('🔄 Fetching user profile for:', user.id)

      // Get user profile from public.users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profileError) {
        console.error('❌ Profile fetch error:', profileError)
        // Fallback to auth data only
        userData.value = {
          id: user.id,
          email: user.email,
          ...user.user_metadata,
          // Create firstname/lastname from user_metadata or email
          firstname: user.user_metadata?.first_name || user.email.split('@')[0],
          lastname: user.user_metadata?.last_name || '',
          role: user.user_metadata?.role || 'user',
        }
        return
      }

      console.log('✅ User profile found:', userProfile)

      // Split full_name into firstname and lastname for the componentx
      let firstname = ''
      let lastname = ''

      if (userProfile.full_name) {
        const nameParts = userProfile.full_name.trim().split(' ')
        firstname = nameParts[0] || ''
        lastname = nameParts.slice(1).join(' ') || ''
      } else {
        // Fallback to email username
        firstname = user.email.split('@')[0]
        lastname = ''
      }

      // Combine all data
      userData.value = {
        // From public.users
        ...userProfile,
        // From auth
        id: user.id,
        email: user.email,
        // Split names for the component
        firstname,
        lastname,
        // Ensure role is set
        role: userProfile.role || user.user_metadata?.role || 'user',
      }

      console.log('🎉 Final user data:', userData.value)
    } catch (error) {
      console.error('💥 Error fetching user information:', error)
      userData.value = null
    }
  }

  // Signout user
  async function signOutUser() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      userData.value = null
      userSession.value = null
      return { error: null }
    } catch (error) {
      console.error('Logout error:', error)
      return { error }
    }
  }

  return {
    getUserInformation,
    signOutUser,
    listenToAuthChanges,
    userData,
    userSession,
  }
})
