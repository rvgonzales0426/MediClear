<script setup>
import { ref, computed, onMounted } from 'vue'
import TableComponent from '@/components/TableComponent.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'
import PatientDialog from '@/views/system/partials/PatientDialog.vue'
import { usePatientStore } from '@/stores/patient'
import DashBoardWidgets from '@/components/DashBoardWidgets.vue'
import { useRouter } from 'vue-router'

const patientStore = usePatientStore()
const router = useRouter()

// Load patients on component mount
onMounted(() => {
  patientStore.fetchPatients()
})

//Load variables
const stats = computed(() => {
  return [
    {
      id: 1,
      title: 'Total Patients',
      text: 'Currently assigned',
      count: patientStore.totalPatients,
      color: 'blue',
    },
    {
      id: 2,
      title: ' Pending Discharge',
      text: 'Awaiting approval',
      count: patientStore.pendingDischarge,
      color: 'orange',
    },
    {
      id: 3,
      title: 'Approved',
      text: 'Ready for release',
      count: patientStore.approvedPatients,
      color: 'green',
    },
    {
      id: 4,
      title: 'Released',
      text: 'Completed today',
      count: patientStore.releasedPatients,
      color: null,
    },
  ]
})

//Sample PageLink
const totalPage = ref(3)
const currentPage = ref(1)

const isDialogVisible = ref(false)

const viewPatientInfo = (patient_id) => {
  if (!patient_id) console.error('Patient ID is undefined')

  router.push({ name: 'patient-info', params: { id: patient_id } })
}

// Handle discharge request following MediClear patient workflow
const handleRequestDischarge = (patient_id) => {
  // TODO: Implement discharge request logic
}
</script>

<template>
  <v-row>
    <v-col cols="12" lg="10" md="8">
      <h3 class="text-h4">Nurse Dashboard</h3>
      <p class="text-caption">Manage patient care and discharge requests</p>
    </v-col>

    <v-col cols="12" md="4" lg="2">
      <v-btn
        prepend-icon="mdi-account-plus-outline"
        size="small"
        color="blue-darken-2"
        @click="isDialogVisible = !isDialogVisible"
      >
        Add patient
      </v-btn>
    </v-col>
  </v-row>

  <!-- Card Header -->
  <v-row>
    <v-col v-for="status in stats" :key="status.id" cols="12" lg="3" md="4">
      <DashBoardWidgets :status="status" />
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
  <PatientDialog v-model:isDialogVisible="isDialogVisible" />
</template>
