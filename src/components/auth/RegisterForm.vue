<script setup>
import { ref, reactive } from 'vue'
import { supabase } from '../../supabase.js'

// Reactive state
const state = reactive({
  isPasswordVisible: false,
  isPasswordConfirmVisible: false,
  isLoading: false,
  errorMessage: '',
  successMessage: '',
})

// Form data
const formDataDefault = {
  first_name: '',
  last_name: '',
  phone_number: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: null,
}

const formData = ref({ ...formDataDefault })

// Constants
const ROLES = [
  { title: 'Nurse', value: 'nurse' },
  { title: 'Doctor', value: 'doctor' },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Utility functions
const hashPassword = async (password) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

const clearMessages = () => {
  if (state.errorMessage || state.successMessage) {
    state.errorMessage = ''
    state.successMessage = ''
  }
}

// Validation
const validateForm = () => {
  const {
    first_name,
    last_name,
    phone_number,
    username,
    email,
    password,
    password_confirmation,
    role,
  } = formData.value

  if (!first_name || !last_name || !phone_number || !username || !email || !password || !role) {
    state.errorMessage = 'Please fill in all required fields'
    return false
  }

  if (password !== password_confirmation) {
    state.errorMessage = 'Passwords do not match'
    return false
  }

  if (password.length < 6) {
    state.errorMessage = 'Password must be at least 6 characters long'
    return false
  }

  if (!EMAIL_REGEX.test(email)) {
    state.errorMessage = 'Please enter a valid email address'
    return false
  }

  return true
}

// Error handling
const handleSupabaseError = (error) => {
  if (error.code === '23505') {
    if (error.message.includes('email')) {
      state.errorMessage = `Email "${formData.value.email}" is already registered.`
    } else if (error.message.includes('username')) {
      state.errorMessage = `Username "${formData.value.username}" is already taken.`
    } else {
      state.errorMessage = 'User already exists. Check your email and username.'
    }
  } else if (error.code === '42501') {
    state.errorMessage = 'Permission denied. Check Supabase settings.'
  } else {
    state.errorMessage = `Registration failed: ${error.message}`
  }
}

// Form submission
const handleSubmit = async () => {
  state.isLoading = true
  state.errorMessage = ''
  state.successMessage = ''

  if (!validateForm()) {
    state.isLoading = false
    return
  }

  try {
    // 1. First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.value.email,
      password: formData.value.password,
    })

    if (authError) {
      state.errorMessage = authError.message
      throw authError
    }

    // 2. Then create the user profile in our users table
    const full_name = `${formData.value.first_name} ${formData.value.last_name}`

    const { error: profileError } = await supabase.from('users').insert([
      {
        user_id: authData.user.id, // Use the Supabase Auth user ID
        full_name,
        phone_number: formData.value.phone_number,
        username: formData.value.username,
        email: formData.value.email,
        password_hash: '', // We don't need to store password hash as Supabase Auth handles this
        role: formData.value.role,
        created_at: new Date().toISOString(),
      },
    ])

    if (profileError) {
      handleSupabaseError(profileError)
      // If profile creation fails, we should clean up the auth user
      await supabase.auth.signOut()
      throw profileError
    }

    state.successMessage = 'Registration successful! You can now log in.'
    formData.value = { ...formDataDefault }
  } catch (error) {
    console.error('Error during registration:', error)
  } finally {
    state.isLoading = false
  }
}
</script>

<template>
  <v-form @submit.prevent="handleSubmit" fast-fail>
    <v-row dense>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.first_name"
          label="First Name"
          type="text"
          required
          @input="clearMessages"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.last_name"
          label="Last Name"
          type="text"
          required
          @input="clearMessages"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="formData.phone_number"
          label="Phone"
          type="tel"
          prepend-inner-icon="mdi-phone-outline"
          required
          @input="clearMessages"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="formData.username"
          label="Username"
          type="text"
          prepend-inner-icon="mdi-account-outline"
          required
          @input="clearMessages"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="formData.email"
          label="Email"
          type="email"
          prepend-inner-icon="mdi-email-outline"
          required
          @input="clearMessages"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="formData.password"
          label="Password"
          :type="state.isPasswordVisible ? 'text' : 'password'"
          @click:append-inner="state.isPasswordVisible = !state.isPasswordVisible"
          :append-inner-icon="state.isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
          prepend-inner-icon="mdi-lock-outline"
          required
          @input="clearMessages"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="formData.password_confirmation"
          label="Confirm Password"
          :type="state.isPasswordConfirmVisible ? 'text' : 'password'"
          @click:append-inner="state.isPasswordConfirmVisible = !state.isPasswordConfirmVisible"
          :append-inner-icon="state.isPasswordConfirmVisible ? 'mdi-eye' : 'mdi-eye-off'"
          prepend-inner-icon="mdi-lock-outline"
          required
          @input="clearMessages"
        />
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="formData.role"
          prepend-inner-icon="mdi-account-check-outline"
          density="compact"
          label="Select Role"
          :items="ROLES"
          item-value="value"
          item-title="title"
          required
          @update:model-value="clearMessages"
        />
      </v-col>
    </v-row>

    <!-- Messages -->
    <v-alert
      v-if="state.errorMessage"
      type="error"
      density="compact"
      class="mb-4"
      closable
      @click:close="state.errorMessage = ''"
    >
      {{ state.errorMessage }}
    </v-alert>

    <v-alert
      v-if="state.successMessage"
      type="success"
      density="compact"
      class="mb-4"
      closable
      @click:close="state.successMessage = ''"
    >
      {{ state.successMessage }}
    </v-alert>

    <v-btn
      class="mt-2"
      type="submit"
      color="blue-darken-2"
      block
      :loading="state.isLoading"
      :disabled="state.isLoading"
    >
      <template v-slot:loader>
        <v-progress-circular indeterminate size="20" width="2" />
      </template>
      {{ state.isLoading ? 'Creating Account...' : 'Sign Up' }}
    </v-btn>
  </v-form>
</template>
