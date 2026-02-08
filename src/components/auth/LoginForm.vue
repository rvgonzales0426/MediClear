<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { emailValidator, passwordValidator } from '@/utils/validators.js'
import { supabase } from '@/composables/useSupabase'

const authStore = useAuthStore()

// Reactive state
const router = useRouter()
const route = useRoute()

// Reactive state
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
  state.isLoading = true

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password,
  })

  if (error) {
    state.errorMessage = error.message || 'Error Logging In'
    state.isLoading = false
  } else if (data) {
    state.successMessage = 'Login Successfully'

    await authStore.getUserInformation()
    refVForm.value?.reset()

    // Check if there's a redirect query parameter
    const redirectPath = route.query.redirect

    if (redirectPath) {
      // Redirect to the intended destination
      router.replace(redirectPath)
    } else {
      // Default dashboard redirect based on role
      router.replace(
        authStore.userData?.role === 'nurse' ? '/nurse-dashboard' : '/doctor-dashboard',
      )
    }

    state.isLoading = false
  }
}

//Trigger Validators
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
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="formData.password"
          label="Password"
          :type="state.isPasswordVisible ? 'text' : 'password'"
          prepend-inner-icon="mdi-lock-outline"
          @click:append-inner="state.isPasswordVisible = !state.isPasswordVisible"
          :append-inner-icon="state.isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
          placeholder="Enter your password"
          :rules="[passwordValidator]"
        />
      </v-col>
    </v-row>

    <!-- Message Alert -->
    <v-alert v-if="state.errorMessage" color="error" density="compact" class="mb-4">
      {{ state.errorMessage }}
    </v-alert>

    <!-- Message Alert -->
    <v-alert v-if="state.successMessage" color="success" density="compact" class="mb-4">
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
