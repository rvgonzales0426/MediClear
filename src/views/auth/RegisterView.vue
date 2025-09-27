<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row class="mt8">
        <v-col cols="12" md="6" class="d-flex flex-column align-center mx-auto">
          <div class="mb-3 d-flex flex-column align-center">
            <v-img width="80" src="/public/images/logo.png" rounded> </v-img>
            <h3 class="font-weight-thin">MediClear</h3>
            <span>Automated Hospital Discharge Management System</span>
          </div>

          <v-card :width="!mobile ? 500 : undefined">
            <v-card-title>
              <h3 class="text-center">Sign Up</h3>
            </v-card-title>
            <v-card-text>
              <RegisterForm />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn to="/">Sign In</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
