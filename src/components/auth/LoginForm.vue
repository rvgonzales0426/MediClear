<script setup>
import { ref } from 'vue'
import { supabase } from '../../supabase.js'
import { useRouter } from 'vue-router'

// Reactive state
const formData = ref({ email: '', password: '' })
const loading = ref(false)
const message = ref({ type: '', text: '' })
const router = useRouter()

// Constants
const ERROR_MESSAGES = {
  'Invalid login credentials': 'Invalid email or password. Please check your credentials.',
  'Email not confirmed': 'Please confirm your email address before logging in.',
  'Too many requests': 'Too many login attempts. Please try again later.',
}

// Methods
const setMessage = (type, text) => {
  message.value = { type, text }
}

const validateForm = () => {
  if (!formData.value.email || !formData.value.password) {
    setMessage('error', 'Please fill in all fields')
    return false
  }
  return true
}

const handleSuccess = async (data) => {
  try {
    // Fetch complete user data from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, full_name, username, phone_number')
      .eq('email', data.user.email)
      .single()

    if (userError) throw userError

    // Store complete user data
    const userToStore = {
      ...data.user,
      ...userData, // This includes full_name, role, username, and phone_number
    }
    localStorage.setItem('user', JSON.stringify(userToStore))
    localStorage.setItem('session', JSON.stringify(data.session))

    setMessage('success', 'Login successful! Redirecting...')

    // Redirect based on role
    const roleRedirects = {
      doctor: '/doctor-dashboard',
      nurse: '/nurse-dashboard',
    }

    const redirectPath = roleRedirects[userData.role] || '/login'
    setTimeout(() => router(redirectPath), 1000)
  } catch (error) {
    handleError({ message: error.message || 'Failed to fetch user role. Please try again.' })
  }
}

const handleError = (error) => {
  const errorText = ERROR_MESSAGES[error.message] || `Login failed: ${error.message}`
  setMessage('error', errorText)
}

const handleLogin = async () => {
  if (!validateForm()) return

  loading.value = true
  setMessage('', '')

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.value.email.trim().toLowerCase(),
      password: formData.value.password,
    })

    error ? handleError(error) : handleSuccess(data)
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-form fast-fail @submit.prevent="handleLogin">
    <v-row dense>
      <v-col cols="12">
        <v-text-field
          v-model="formData.email"
          label="Email"
          type="email"
          prepend-inner-icon="mdi-email-outline"
          :disabled="loading"
          required
          placeholder="Enter your registered email"
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="formData.password"
          label="Password"
          type="password"
          prepend-inner-icon="mdi-lock-outline"
          :disabled="loading"
          required
          placeholder="Enter your password"
        />
      </v-col>
    </v-row>

    <!-- Message Alert -->
    <v-alert v-if="message.text" :type="message.type" density="compact" class="mb-4">
      {{ message.text }}
    </v-alert>

    <v-btn
      type="submit"
      color="blue-darken-2"
      block
      :loading="loading"
      :disabled="loading"
      class="mt-2"
    >
      <template v-slot:loader>
        <v-progress-circular indeterminate size="20" width="2" />
      </template>
      Sign In
    </v-btn>
  </v-form>
</template>
