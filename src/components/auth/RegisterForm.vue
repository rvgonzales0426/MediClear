<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import {
  emailValidator,
  passwordValidator,
  confirmedValidator,
  requiredValidator,
  integerValidator,
} from '@/utils/validators.js'

const router = useRouter()
const authStore = useAuthStore()

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
  email: '',
  password: '',
  password_confirmation: '',
  role: null,
}

const refVForm = ref()
const formData = ref({ ...formDataDefault })

// Constants
const ROLES = [
  { title: 'Nurse', value: 'nurse' },
  { title: 'Doctor', value: 'doctor' },
]

// Form submission
const onSubmit = async () => {
  const metadata = {
    firstname: formData.value.first_name,
    lastname: formData.value.last_name,
    role: formData.value.role,
    phone_number: formData.value.phone_number,
  }

  const { data, error: signUpError } = await signUp(
    formData.value.email,
    formData.value.password,
    metadata,
  )

  if (!signUpError && data) {
    state.successMessage = 'Registered Successfully'
    // Reset Form
    refVForm.value?.reset()
    router.replace(formData.value.role === 'nurse' ? '/nurse-dashboard' : '/doctor-dashboard')
  }
}

// Trigger Validators
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>

<template>
  <v-form @submit.prevent="onFormSubmit" ref="refVForm" fast-fail>
    <v-row dense>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.first_name"
          label="First Name"
          type="text"
          :rules="[requiredValidator]"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.last_name"
          label="Last Name"
          type="text"
          :rules="[requiredValidator]"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="formData.phone_number"
          label="Phone"
          type="tel"
          prepend-inner-icon="mdi-phone-outline"
          :rules="[integerValidator]"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="formData.email"
          label="Email"
          type="email"
          prepend-inner-icon="mdi-email-outline"
          :rules="[emailValidator]"
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
          :rules="[passwordValidator]"
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
          :rules="[
            requiredValidator,
            confirmedValidator(formData.password_confirmation, formData.password),
          ]"
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
          :rules="[requiredValidator]"
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
