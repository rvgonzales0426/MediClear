<script setup>
import { ref } from 'vue'
import TableComponent from '@/components/TableComponent.vue'
import PatientActionTable from './PatientActionTable.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'
import DashBoardWidgets from '@/components/DashBoardWidgets.vue'
import { useManagePatientsForDoctor } from './managePatientsForDoctor'

import { useRouter } from 'vue-router'

const router = useRouter()

//Sample PageLink
const totalPage = ref(3)
const currentPage = ref(1)

const { dischargingPatients, stats, patientStore } = useManagePatientsForDoctor()

const viewPatientInfo = (patient_id) => {
  if (!patient_id) console.error('Patient ID is undefined')

  router.push({ name: 'patient-info', params: { id: patient_id } })
}
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
          <PatientActionTable :patients="dischargingPatients" @view="viewPatientInfo" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- Table -->
  <v-row v-if="patientStore.patients">
    <v-col cols="12" lg="12">
      <v-card title="Assigned Patients" subtitle="Patients currently under your care">
        <v-card-text>
          <TableComponent :patients="patientStore.patients" @view="viewPatientInfo" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <PaginationComponent v-model="currentPage" :totalPage="totalPage" />
</template>
