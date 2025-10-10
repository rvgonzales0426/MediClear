import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  //LOGGED VALUES/STATES ARE  FOR DEBUGGING ONLY
  const userData = ref(null)
  const userSession = ref(null)

  //listerForSessions
  async function listenToAuthChanges() {
    supabase.auth.onAuthStateChange((_, session) => {
      userSession.value = session?.user || null
      console.log('Logging current session', userSession.value)
    })
  }

  //Get User Info
  async function getUserInformation() {
    const {
      data: {
        user: { email, id, user_metadata },
      },
    } = await supabase.auth.getUser()

    userData.value = { id, email, ...user_metadata }
    console.log(userData.value)
  }

  //Signout user
  async function signOutUser() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      userData.value = null
      return { error: null }
    } catch (error) {
      console.error('Logout error:', error)
      return { error }
    }
  }

  return {
    //Actions
    // getAuthSession,
    getUserInformation,
    signOutUser,
    listenToAuthChanges,
    //States
    userData,
    userSession,
  }
})
