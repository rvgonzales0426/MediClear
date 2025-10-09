import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const userData = ref(null)

  const isAuthenticated = computed(() => !!userData.value)
  //Fetch User Session
  async function getAuthSession() {
    const { data, error } = await supabase.auth.getSession()

    console.log('Session data:', data)
    console.log('Session error:', error)

    if (error) return false

    if (data.session) {
      const { id, email, user_metadata } = data.session.user
      userData.value = { id, email, ...user_metadata }
      console.log('Logged status', isAuthenticated.value)
      console.log('User data set:', userData.value)
    }

    return !!data.session
  }

  //Get User Info
  async function getUserInformation() {
    const {
      data: {
        user: { id, email, user_metadata },
      },
    } = await supabase.auth.getUser()

    userData.value = { id, email, ...user_metadata }
  }

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
    getAuthSession,
    getUserInformation,
    signOutUser,
    //States
    userData,
    isAuthenticated,
  }
})
