<script setup>
import { ref, computed } from 'vue'
import DashboardCard from '@/components/DashboardCard.vue'
import { patients } from './PatientMockData'

const stats = computed(() => {
  return [
    {
      id: 1,
      text: 'Total Patients',
      count: patients.length,
      color: 'blue',
    },
    {
      id: 2,
      text: 'Pending Discharge',
      count: patients.filter((p) => p.status === 'Discharge Requested').length,
      color: 'orange',
    },
    {
      id: 3,
      text: 'Approved',
      count: patients.filter((p) => p.status === 'Approved').length,
      color: 'green',
    },
    {
      id: 4,
      text: 'Released',
      count: patients.filter((p) => p.status === 'Released').length,
      color: null,
    },
  ]
})
</script>

<template>
  <v-row>
    <v-col cols="12" lg="10" md="8">
      <h3 class="text-h4">Nurse Dashboard</h3>
      <p class="text-caption">Manage patient care and discharge requests</p>
    </v-col>

    <v-col cols="12" md="4" lg="2">
      <v-btn prepend-icon="mdi-account-plus-outline" color="blue-darken-2"> Add patient </v-btn>
    </v-col>
  </v-row>

  <v-row>
    <v-col v-for="status in stats" :key="status.id" cols="12" lg="3" md="4">
      <DashboardCard :status="status" />
    </v-col>
  </v-row>
</template>
