<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { emailValidator, passwordValidator } from '@/utils/validators.js'

const router = useRouter()
const authStore = useAuthStore()

const state = reactive({
  isPasswordVisible: false,
  isLoading: false,
  errorMessage: '',
  successMessage: '',
})

const formDataDefault = {
  email: '',
  password: '',
}

const formData = ref({
  ...formDataDefault,
})

const refVForm = ref()

const onSubmit = async () => {
  try {
    state.isLoading = true
    state.errorMessage = ''
    state.successMessage = ''

    // Use store's login method
    const { data, error } = await authStore.loginUser(formData.value.email, formData.value.password)

    if (error) {
      state.errorMessage = error.message || 'Login failed'
      return
    }

    if (data?.user) {
      state.successMessage = 'Login successful!'
      refVForm.value?.reset()

      // Redirect based on user role from store
      const role = authStore.userData?.role
      await redirectBasedOnRole(role)
    }
  } catch (err) {
    state.errorMessage = err.message || 'An error occurred'
    console.error('Login error:', err)
  } finally {
    state.isLoading = false
  }
}

// Function to handle role-based redirection
const redirectBasedOnRole = async (role) => {
  const routes = {
    admin: '/admin-dashboard',
    doctor: '/doctor-dashboard',
    nurse: '/nurse-dashboard',
    billing_clerk: '/billing-dashboard',
    philhealth_officer: '/philhealth-dashboard',
  }

  const targetRoute = routes[role] || '/dashboard'
  await router.replace(targetRoute)
}

// Trigger Validators
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>

<template>
  <v-form fast-fail @submit.prevent="onFormSubmit" ref="refVForm">
    <v-row dense>
      <v-col cols="12">
        <v-text-field
          v-model="formData.email"
          label="Email"
          type="email"
          prepend-inner-icon="mdi-email-outline"
          placeholder="Enter your registered email"
          :rules="[emailValidator]"
          autocomplete="email"
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="formData.password"
          label="Password"
          :type="state.isPasswordVisible ? 'text' : 'password'"
          prepend-inner-icon="mdi-lock-outline"
          @click:append-inner="state.isPasswordVisible = !state.isPasswordVisible"
          :append-inner-icon="state.isPasswordConfirmVisible ? 'mdi-eye' : 'mdi-eye-off'"
          placeholder="Enter your password"
          :rules="[passwordValidator]"
          autocomplete="current-password"
        />
      </v-col>
    </v-row>

    <!-- Message Alert -->
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
      type="submit"
      color="blue-darken-2"
      block
      :loading="state.isLoading"
      :disabled="state.isLoading"
      class="mt-2"
    >
      <template v-slot:loader>
        <v-progress-circular indeterminate size="20" width="2" />
      </template>
      Sign In
    </v-btn>
  </v-form>
</template>
