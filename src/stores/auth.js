import { defineStore } from 'pinia'
import { supabase } from '@/composables/useSupabase'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  //LOGGED VALUES/STATES ARE  FOR DEBUGGING ONLY
  const userData = ref(null)
  const userSession = ref(null)
  const session = ref(null)

  function $reset() {
    userData.value = null
    userSession.value = null
    session.value = null
  }

  //listerForSessions
  async function listenToAuthChanges() {
    supabase.auth.onAuthStateChange((_, session) => {
      userSession.value = session?.user || null
    })
  }

  //Get User Info
  async function getUserInformation() {
    try {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()

      if (!currentSession) {
        // No session found, but don't reset if we're just checking
        // Only reset if we were expecting a session
        if (session.value) {
          $reset()
        }
        return
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        $reset()
        return
      }

      session.value = currentSession
      userData.value = { id: user.id, email: user.email, ...user.user_metadata }
    } catch (error) {
      console.error('Error getting user information:', error)
      // Don't reset on network errors, only on auth errors
    }
  }

  //Signout user
  async function signOutUser() {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      $reset()
    } catch (error) {
      return { error }
    }
  }

  return {
    //Actions
    // getAuthSession,
    getUserInformation,
    signOutUser,
    listenToAuthChanges,
    $reset,
    //States
    userData,
    userSession,
    session,
  }
})
