<script setup>
import { ref, reactive } from 'vue'
import { supabase } from '../../supabase.js'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { emailValidator, passwordValidator } from '@/utils/validators.js'

const authStore = useAuthStore()

// Reactive state
const router = useRouter()

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
  } else if (data) {
    state.successMessage = 'Login Successfully'

    refVForm.value?.reset()
    router.replace(authStore.userData?.role === 'nurse' ? '/nurse-dashboard' : 'doctor-dashboard') //Check role from session
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
          :type="state.isPasswordVisible ? 'password' : 'text'"
          prepend-inner-icon="mdi-lock-outline"
          @click:append-inner="state.isPasswordVisible = !state.isPasswordVisible"
          :append-inner-icon="state.isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
          placeholder="Enter your password"
          :rules="[passwordValidator]"
        />
      </v-col>
    </v-row>

    <!-- Message Alert -->
    <v-alert v-if="state.errorMessage" :type="message.type" density="compact" class="mb-4">
      {{ state.errorMessage }}
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
