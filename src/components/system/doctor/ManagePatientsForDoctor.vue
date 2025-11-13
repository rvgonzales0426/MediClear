<script setup>
import { ref } from 'vue'
import TableComponent from '@/components/TableComponent.vue'
import PatientActionTable from './PatientActionTable.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'
import DashBoardWidgets from '@/components/DashBoardWidgets.vue'
import { useManagePatientsForDoctor } from './managePatientsForDoctor'
import { usePatientStore } from '@/stores/patient'
import { toast } from 'vue3-toastify'

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

// Handle approve discharge request
const handleApprove = async (patient_id) => {
  if (!patient_id) {
    console.error('Patient ID is undefined')
    toast.error('Invalid patient ID', { position: 'top-center' })
    return
  }

  try {
    const { data, error } = await patientStore.updatePatient({
      patient_id: patient_id,
      status: 'Approved',
    })

    if (error) {
      console.error('Error approving discharge:', error.message)
      toast.error('Failed to approve discharge', { position: 'top-center' })
      return
    }

    if (data) {
      toast.success('Discharge approved successfully', { position: 'top-center' })
      await patientStore.fetchPatients()
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    toast.error('An unexpected error occurred', { position: 'top-center' })
  }
}

// Handle reject discharge request
const handleReject = async (patient_id) => {
  if (!patient_id) {
    console.error('Patient ID is undefined')
    toast.error('Invalid patient ID', { position: 'top-center' })
    return
  }

  try {
    const { data, error } = await patientStore.updatePatient({
      patient_id: patient_id,
      status: 'Admitted',
    })

    if (error) {
      console.error('Error rejecting discharge:', error.message)
      toast.error('Failed to reject discharge', { position: 'top-center' })
      return
    }

    if (data) {
      toast.success('Discharge request rejected', { position: 'top-center' })
      await patientStore.fetchPatients()
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    toast.error('An unexpected error occurred', { position: 'top-center' })
  }
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
          <PatientActionTable
            :patients="dischargingPatients"
            @view="viewPatientInfo"
            @approve="handleApprove"
            @reject="handleReject"
          />
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
