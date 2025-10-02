<script setup>
import { computed, ref } from 'vue'
import DashboardCard from '@/components/DashboardCard.vue'
import { patients, dischargingPatients } from '../PatientMockData'
import TableComponent from '@/components/TableComponent.vue'
import PatientActionTable from './PatientActionTable.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'

const stats = computed(() => {
  return [
    {
      id: 1,
      title: 'Pending Approvals',
      text: 'Requiring your review',
      count: patients.filter((p) => p.status === 'Discharge Requested').length,
      color: 'orange',
      icon: 'mdi-clock-time-three-outline',
    },

    {
      id: 2,
      title: 'Released Today',
      text: 'Successfully discharged',
      count: patients.filter((p) => p.status === 'Approved').length,
      color: 'green',
      icon: 'mdi-check-circle-outline',
    },
    {
      id: 3,
      title: "Today's Discharges",
      text: 'Total processed today',
      count: patients.filter((p) => p.status === 'Admitted').length,
      color: 'blue',
      icon: 'mdi-arrow-top-right',
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

const actionTableColumns = [
  { key: 'patientName', label: 'Patient Name' },
  { key: 'admissionDate', label: 'Admission Date' },
  { key: 'requestedBy', label: 'Requested By' },
  { key: 'requestDate', label: 'Request Date' },
]

//Sample PageLink
const totalPage = ref(3)
const currentPage = ref(1)
</script>

<template>
  <v-row>
    <v-col cols="12" lg="10" md="8">
      <h3 class="text-h4">Doctor Dashboard</h3>
      <p class="text-caption">Review and approve discharge requests</p>
    </v-col>
  </v-row>

  <!-- Card Header -->
  <v-row>
    <v-col v-for="status in stats" :key="status.id" cols="12" lg="4" md="4">
      <DashboardCard :status="status" />
    </v-col>
  </v-row>

  <!-- Discharge Action Table -->
  <v-row>
    <v-col cols="12" lg="12" md="10">
      <v-card
        title="Discharge Requests Awaiting Approval"
        subtitle="Discharge Requests Awaiting Approval"
      >
        <v-card-text>
          <PatientActionTable :patients="dischargingPatients" :columns="actionTableColumns" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- Patient Overview -->
  <v-row>
    <v-col cols="12" lg="12" md="10">
      <v-card title="All Patients Overview" subtitle="Current status of all patients in the system">
        <v-card-text>
          <TableComponent :columns="columns" :data="patients" :loading="isLoading" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <PaginationComponent v-model="currentPage" :totalPage="totalPage" />
</template>
