<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth.js'
import { emailValidator, passwordValidator } from '@/utils/validators.js'

const router = useRouter()
const authStore = useAuthStore()
const { signIn, isLoading, errorMessage, successMessage, init } = useAuth()

// Initialize auth on component mount
onMounted(() => {
  init()
})

const state = reactive({
  isPasswordVisible: false,
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
    // Clear previous messages
    errorMessage.value = ''
    successMessage.value = ''

    // Call signIn with email and password
    const { data, error } = await signIn(formData.value.email, formData.value.password)

    if (error) {
      console.error('Sign in error:', error)
      return
    }

    if (data?.user) {
      console.log('Login successful:', data.user)

      // Update auth store if you're using it
      if (authStore && authStore.getUserInformation) {
        await authStore.getUserInformation()
      }

      refVForm.value?.reset()

      // Redirect based on user role
      await redirectBasedOnRole(data.user.role)
    }
  } catch (err) {
    console.error('Login error:', err)
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

  console.log(`Redirecting ${role} to: ${targetRoute}`)
  await router.replace(targetRoute)
}

// Trigger Validators
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}

// Clear messages when form is interacted with
const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}
</script>

<template>
  <v-form fast-fail @submit.prevent="onFormSubmit" ref="refVForm" @input="clearMessages">
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
          @focus="clearMessages"
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
          @focus="clearMessages"
        />
      </v-col>
    </v-row>

    <!-- Message Alert -->
    <v-alert
      v-if="errorMessage"
      type="error"
      density="compact"
      class="mb-4"
      closable
      @click:close="errorMessage = ''"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-alert-circle" class="mr-2" />
        <span>{{ errorMessage }}</span>
      </div>
    </v-alert>

    <v-alert
      v-if="successMessage"
      type="success"
      density="compact"
      class="mb-4"
      closable
      @click:close="successMessage = ''"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-check-circle" class="mr-2" />
        <span>{{ successMessage }}</span>
      </div>
    </v-alert>

    <v-btn
      type="submit"
      color="blue-darken-2"
      block
      :loading="isLoading"
      :disabled="isLoading"
      class="mt-2"
      size="large"
    >
      <template v-slot:loader>
        <v-progress-circular indeterminate size="20" width="2" />
      </template>
      Sign In
    </v-btn>
  </v-form>
</template>
