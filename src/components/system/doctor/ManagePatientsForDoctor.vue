<script setup>
import { computed, ref, onMounted } from 'vue'
import { patients, dischargingPatients } from '../PatientMockData'
import { usePatientStore } from '@/stores/patient'
import TableComponent from '@/components/TableComponent.vue'
import PatientActionTable from './PatientActionTable.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'
import DashBoardWidgets from '@/components/DashBoardWidgets.vue'

const patientStore = usePatientStore()

// Load patients on component mount
onMounted(() => {
  patientStore.fetchPatients()
})

const stats = computed(() => {
  return [
    {
      id: 1,
      title: 'Pending Approvals',
      text: 'Requiring your review',
      count: patientStore.pendingDischarge,
      color: 'orange',
      icon: 'mdi-clock-time-three-outline',
    },

    {
      id: 2,
      title: 'Released Today',
      text: 'Successfully discharged',
      count: patientStore.releasedPatients,
      color: 'green',
      icon: 'mdi-check-circle-outline',
    },
    {
      id: 3,
      title: "Today's Discharges",
      text: 'Total processed today',
      count: patientStore.admittedPatients,
      color: 'blue',
      icon: 'mdi-arrow-top-right',
    },
  ]
})

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

  <!-- Widgets -->
  <v-row>
    <v-col v-for="status in stats" :key="status.id" cols="12" lg="4" md="4">
      <DashBoardWidgets :status="status" />
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

  <!-- Table -->
  <v-row v-if="patientStore.patients">
    <v-col cols="12" lg="12">
      <v-card title="Assigned Patients" subtitle="Patients currently under your care">
        <v-card-text>
          <TableComponent :patients="patientStore.patients" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <PaginationComponent v-model="currentPage" :totalPage="totalPage" />
</template>
