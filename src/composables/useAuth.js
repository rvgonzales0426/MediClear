import { ref } from 'vue'
import { supabase } from '@/composables/useSupabase.js'

export function useAuth() {
  const user = ref(null)
  const session = ref(null)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

  const signIn = async (email, password) => {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      console.log('🔐 Attempting sign in with:', {
        email: email.trim().toLowerCase(),
        passwordLength: password.length,
      })

      // Sign in using Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      })

      if (error) {
        console.error('❌ Sign in error details:', {
          message: error.message,
          status: error.status,
          name: error.name,
        })

        if (error.message?.includes('Invalid login credentials')) {
          errorMessage.value =
            'Invalid email or password. Please check your credentials and try again.'
        } else if (error.message && error.message.toLowerCase().includes('email not confirmed')) {
          errorMessage.value = 'Please confirm your email before logging in.'
        } else {
          errorMessage.value = error.message || 'Error logging in'
        }
        return { error }
      }

      if (data?.user) {
        console.log('✅ Auth successful, user:', data.user)
        console.log('🔄 Fetching user profile...')

        // Fetch user info from custom users table using user_id
        const { data: userInfo, error: userInfoError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', data.user.id)
          .single()

        if (userInfoError) {
          console.error('❌ User profile fetch error:', userInfoError)
          errorMessage.value = 'User profile not found. Please contact administrator.'
          return { error: userInfoError }
        }

        console.log('✅ User profile found:', userInfo)

        // Combine auth user data with custom user profile
        const userWithRole = {
          ...data.user,
          ...userInfo,
          role: userInfo.role,
        }

        user.value = userWithRole
        session.value = data.session
        successMessage.value = `Login successful! Welcome back, ${userInfo.full_name || userInfo.email}`

        console.log('🎉 Login completed with role:', userInfo.role)
        return { data: { user: userWithRole, session: data.session } }
      }
    } catch (error) {
      console.error('💥 Unexpected sign in error:', error)
      errorMessage.value = error.message || 'An unexpected error occurred'
      return { error }
    } finally {
      isLoading.value = false
    }
  }

  const signUp = async (userData) => {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      console.log('Starting registration for:', userData.email)

      // Create auth user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: userData.role,
          },
        },
      })

      if (error) {
        console.error('Auth signup error:', error)
        errorMessage.value = error.message
        return { error }
      }

      if (data?.user) {
        console.log('Auth user created, adding to users table...')

        // Insert user profile into custom users table
        const full_name = `${userData.first_name} ${userData.last_name}`
        const userProfile = {
          user_id: data.user.id,
          full_name: full_name,
          phone_number: userData.phone_number,
          email: userData.email.trim().toLowerCase(),
          role: userData.role || 'user',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const { error: userError } = await supabase.from('users').insert([userProfile])

        if (userError) {
          console.error('User profile creation error:', userError)
          errorMessage.value = `Profile creation failed: ${userError.message}`
          return { error: userError }
        }

        user.value = data.user
        session.value = data.session

        // Set appropriate success message
        if (data.user.identities && data.user.identities.length === 0) {
          successMessage.value = 'Registration completed! This email is already registered.'
        } else {
          successMessage.value =
            'Registration successful! Please check your email to verify your account.'
        }

        console.log('Registration completed successfully')
        return { data: { user: user.value, session: session.value } }
      }
    } catch (error) {
      console.error('Unexpected registration error:', error)
      errorMessage.value = error.message || 'An unexpected error occurred'
      return { error }
    } finally {
      isLoading.value = false
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        errorMessage.value = 'Error signing out'
      } else {
        user.value = null
        session.value = null
        successMessage.value = 'Signed out successfully'
      }
    } catch (error) {
      console.error('Unexpected sign out error:', error)
      errorMessage.value = 'Error signing out'
    }
  }

  // Initialize auth state
  const init = async () => {
    try {
      // Get initial session
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()
      session.value = currentSession

      if (currentSession?.user) {
        // Fetch user profile if session exists
        const { data: userInfo } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', currentSession.user.id)
          .single()

        user.value = { ...currentSession.user, ...userInfo }
      }
    } catch (error) {
      console.error('Auth init error:', error)
    }
  }

  // Listen for auth changes
  supabase.auth.onAuthStateChange(async (event, currentSession) => {
    console.log('Auth state changed:', event)
    session.value = currentSession

    if (currentSession?.user) {
      // Fetch user profile on sign in
      const { data: userInfo } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', currentSession.user.id)
        .single()

      user.value = { ...currentSession.user, ...userInfo }
    } else {
      user.value = null
    }
  })

  return {
    user,
    session,
    isLoading,
    errorMessage,
    successMessage,
    signIn,
    signUp,
    signOut,
    init,
  }
}
