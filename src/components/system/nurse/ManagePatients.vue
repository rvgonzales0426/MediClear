<script setup>
import { ref, computed } from 'vue'
import DashboardCard from '@/components/DashboardCard.vue'
import { patients } from './PatientMockData'
import TableComponent from '@/components/TableComponent.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'

const stats = computed(() => {
  return [
    {
      id: 1,
      title: 'Total Patients',
      text: 'Currently assigned',
      count: patients.length,
      color: 'blue',
    },
    {
      id: 2,
      title: ' Pending Discharge',
      text: 'Awaiting approval',
      count: patients.filter((p) => p.status === 'Discharge Requested').length,
      color: 'orange',
    },
    {
      id: 3,
      title: 'Approved',
      text: 'Ready for release',
      count: patients.filter((p) => p.status === 'Approved').length,
      color: 'green',
    },
    {
      id: 4,
      title: 'Released',
      text: 'Completed today',
      count: patients.filter((p) => p.status === 'Released').length,
      color: null,
    },
  ]
})

const columns = [
  { key: 'patientName', label: 'Patient Name' },
  {
    key: 'admissionDate',
    label: 'Admission Date',
  },

  {
    key: 'status',
    label: 'Status',
    color: {
      'Discharge Requested': 'orange',
      Approved: 'green',
      Released: undefined,
      Admitted: 'blue',
    },
  },
  {
    key: 'attendingPhysician',
    label: 'Attendting Physician',
  },
]

console.log(columns[2].color)

// Optional: Add loading state if needed
const isLoading = ref(false)

//Sample PageLink

const totalPage = ref(3)
const currentPage = ref(1)
</script>

<template>
  <v-row>
    <v-col cols="12" lg="10" md="8">
      <h3 class="text-h4">Nurse Dashboard</h3>
      <p class="text-caption">Manage patient care and discharge requests</p>
    </v-col>

    <v-col cols="12" md="4" lg="2">
      <v-btn prepend-icon="mdi-account-plus-outline" size="small" color="blue-darken-2">
        Add patient
      </v-btn>
    </v-col>
  </v-row>

  <!-- Card Header -->
  <v-row>
    <v-col v-for="status in stats" :key="status.id" cols="12" lg="3" md="4">
      <DashboardCard :status="status" />
    </v-col>
  </v-row>

  <!-- Table -->
  <v-row>
    <v-col cols="12" lg="12">
      <v-card title="Assigned Patients" subtitle="Patients currently under your care">
        <v-card-text>
          <TableComponent :columns="columns" :data="patients" :loading="isLoading" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <PaginationComponent v-model="currentPage" :totalPage="totalPage" />
</template>
