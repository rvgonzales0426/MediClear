import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  //LOGGED VALUES/STATES ARE  FOR DEBUGGING ONLY
  const userData = ref(null)
  const userSession = ref(null)

  //listerForSessions
  async function listenToAuthChanges() {
    supabase.auth.onAuthStateChange((_, session) => {
      userSession.value = session?.user || null
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
  }

  //Signout user
  async function signOutUser() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      userData.value = null
      return { error: null }
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
    //States
    userData,
    userSession,
  }
})
