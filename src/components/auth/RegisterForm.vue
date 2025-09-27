<script setup>
import { ref } from 'vue'

//Load variables
const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)

const formDataDefault = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: null,
}

const formData = ref({
  ...formDataDefault,
})

const roles = ref([
  {
    title: 'Nurse',
    value: 'nurse',
  },

  {
    title: 'Doctor',
    value: 'doctor',
  },
])
</script>

<template>
  <v-form fast-fail>
    <v-row dense>
      <v-col cols="12" sm="6">
        <v-text-field v-model="formData.first_name" label="First Name" type="text"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="formData.last_name" label="Last Name" type="text"></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="formData.email"
          label="Email"
          type="email"
          prepend-inner-icon="mdi-email-outline"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="formData.password"
          label="Password"
          :type="isPasswordVisible ? 'text' : 'password'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
          prepend-inner-icon="mdi-lock-outline"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="formData.password_confirmation"
          label="Confirm Password"
          :type="isPasswordConfirmVisible ? 'text' : 'password'"
          @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
          :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye' : 'mdi-eye-off'"
          prepend-inner-icon="mdi-lock-outline"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="formData.role"
          prepend-inner-icon="mdi-account-check-outline"
          density="compact"
          label="Select Role"
          :items="roles"
          item-value="value"
          item-title="title"
        ></v-select>
      </v-col>
    </v-row>
    <v-btn class="mt-2" type="submit" color="blue-darken-2" block>Sign Up</v-btn>
  </v-form>
</template>
