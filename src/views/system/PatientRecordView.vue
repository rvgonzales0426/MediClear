<script setup>
import PatientList from '@/components/system/PatientList.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <v-col cols="12" lg="10" md="8">
          <h3 class="text-h4">Patient Records</h3>
          <p class="text-caption">Manage patient information and records</p>
        </v-col>

        <v-col cols="12" lg="2" md="4">
          <v-btn prepend-icon="mdi-account-plus-outline" size="small" color="blue-darken-2">
            Add patient
          </v-btn>
        </v-col>
      </v-row>
      <PatientList />
    </template>
  </AppLayout>
</template>
