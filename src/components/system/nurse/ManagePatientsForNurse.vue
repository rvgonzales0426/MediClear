<script setup>
import { ref, computed, onMounted } from 'vue'
import DashboardCard from '@/components/DashboardCard.vue'
import TableComponent from '@/components/TableComponent.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'
import PatientDialog from '@/views/system/partials/PatientDialog.vue'
import { usePatientStore } from '@/stores/patient'

const patientStore = usePatientStore()

// Success/Error messages
const successMessage = ref('')

// Load patients on component mount
onMounted(() => {
  patientStore.fetchPatients()
})

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

//Sample PageLink
const totalPage = ref(3)
const currentPage = ref(1)

const isDialogVisible = ref(false)

// Handle patient added successfully
const handlePatientAdded = async (newPatient) => {
  successMessage.value = 'Patient added successfully!'

  // Auto-hide success message after 5 seconds
  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
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

  <!-- Success/Error Messages -->
  <v-row v-if="successMessage || patientStore.error">
    <v-col cols="12">
      <v-alert
        v-if="successMessage"
        type="success"
        variant="tonal"
        closable
        @click:close="successMessage = ''"
      >
        {{ successMessage }}
      </v-alert>
      <v-alert
        v-if="patientStore.error"
        type="error"
        variant="tonal"
        closable
        @click:close="patientStore.clearError()"
      >
        {{ patientStore.error }}
      </v-alert>
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
          <TableComponent
            :columns="columns"
            :data="patientStore.patients"
            :loading="patientStore.loading"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <PaginationComponent v-model="currentPage" :totalPage="totalPage" />
  <PatientDialog v-model:isDialogVisible="isDialogVisible" @patientAdded="handlePatientAdded" />
</template>
