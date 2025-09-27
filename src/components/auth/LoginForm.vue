<script setup>
const formData = {
  email: '',
  password: '',
}
</script>

<template>
  <v-form fast-fail>
    <v-row dense>
      <v-col cols="12">
        <v-text-field
          v-model="formData.email"
          label="Email"
          prepend-inner-icon="mdi-email-outline"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="formData.password"
          label="Password"
          type="password"
          prepend-inner-icon="mdi-lock-outline"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-btn class="mt-2" type="submit" color="blue-darken-2" block>sign in</v-btn>
  </v-form>
</template>
