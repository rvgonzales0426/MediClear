<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template #content>
  <v-row class="mt-16">
    <v-col cols="12" md="6" class="d-flex flex-column align-center mx-auto">
      <div class="mb-3 d-flex flex-column align-center">
        <v-img width="80" src="/public/images/logo.png" rounded> </v-img>
        <h3 class="font-weight-thin">MediClear</h3>
        <small v-if="mobile">Automated Hospital Discharge Management System</small>
        <span v-else>Automated Hospital Discharge Management System</span>
      </div>

      <v-card :width="!mobile ? 500 : undefined">
        <v-card-title>
          <h3 class="text-center">Sign In</h3>
        </v-card-title>
        <v-card-text>
          <LoginForm />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <p>Don't have an account?</p>
          <RouterLink to="/register" class="text-decoration-none">
            <p class="text-blue">
              Sign up now
              <v-icon icon="mdi-chevron-right"></v-icon>
            </p>
          </RouterLink>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
