<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePatientStore } from '@/stores/patient'
import { useAuthStore } from '@/stores/auth'
import PaginationComponent from '../PaginationComponent.vue'
import PatientDialog from '@/views/system/partials/PatientDialog.vue'
import dayjs from 'dayjs'

import { useRouter } from 'vue-router'

const router = useRouter()

const patientStore = usePatientStore()
const authStore = useAuthStore()
const patientData = ref(null)
const isDialogVisible = ref(false)
const isNurse = computed(() => authStore.userData?.role === 'nurse')
const statusColor = {
  'Discharge Requested': 'orange',
  Approved: 'green',
  Released: undefined,
  Admitted: 'blue',
}

//Pagination
const itemsPerPage = 10
const currentPage = ref(1)

// Computed property for total pages
const totalPage = computed(() => {
  return Math.ceil(patientStore.totalPatients / itemsPerPage)
})

// Computed property for paginated patients
const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return patientStore.patients.slice(start, end)
})

const onUpdate = (patient) => {
  patientData.value = patient
  isDialogVisible.value = true
}

onMounted(() => {
  patientStore.fetchPatients()
})

const viewPatientInfo = (patient_id) => {
  if (!patient_id) console.error('Patient ID is undefined')

  router.push({ name: 'patient-info', params: { id: patient_id } })
}
</script>

<template>
  <v-card
    title="Search & Filter Patients"
    subtitle="Find patients by name, case number, status, or ward"
    class="my-10"
    elevation="10"
  >
    <v-card-text>
      <v-row>
        <v-col cols="12" lg="3" md="4">
          <v-text-field
            label="Search by name or case number..."
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-magnify"
          />
        </v-col>

        <v-col cols="12" lg="3" md="4">
          <v-select
            variant="outlined"
            density="compact"
            label="Selec Status"
            :items="['All Statuses', 'Admitted', 'Discharge Requested', 'Approved', 'Released']"
          />
        </v-col>

        <v-col cols="12" lg="3" md="4">
          <v-select
            variant="outlined"
            density="compact"
            label="Select Ward"
            :items="[
              'All Wards',
              'General Medicine',
              'Cardiology',
              'Emergency',
              'Orthopedics',
              'Maternity',
            ]"
          />
        </v-col>

        <v-col cols="12" lg="3" md="4">
          <v-btn prepend-icon="mdi-filter-outline" block ripple>Clear Filters</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-row>
    <v-col cols="12" lg="12" md="10">
      <v-card title="Patient List" subtitle="Click to view, edit, or manage patient records">
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th class="text-left font-weight-bold">Case Number</th>
                <th class="text-left font-weight-bold">Patient Name</th>
                <th class="text-left font-weight-bold">Age/Gender</th>
                <th class="text-left font-weight-bold">Ward</th>
                <th class="text-left font-weight-bold">Admission Date</th>
                <th class="text-left font-weight-bold">Status</th>
                <th class="text-left font-weight-bold">Attending Physician</th>
                <th class="text-left font-weight-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading state -->
              <tr v-if="!patientStore.patients || patientStore.patients.length === 0">
                <td colspan="12" class="text-center py-8">
                  <v-progress-circular indeterminate color="primary" />
                </td>
              </tr>

              <tr v-else v-for="patient in paginatedPatients" :key="patient.id">
                <td>{{ patient.case_number }}</td>
                <td>{{ patient.patient_name }}</td>
                <td>{{ patient.age_gender }}</td>
                <td>{{ patient.ward }}</td>
                <td>
                  {{
                    patient.addmission_date
                      ? dayjs(patient.addmission_date.split('T')[0]).format('YYYY-MMM-DD')
                      : ''
                  }}
                </td>
                <td>
                  <v-chip
                    :color="statusColor[patient.status] || 'grey'"
                    text-color="white"
                    variant="flat"
                    size="small"
                  >
                    {{ patient.status }}
                  </v-chip>
                </td>
                <td>{{ patient.attending_physician }}</td>
                <td>
                  <div class="d-flex align-center ga-2">
                    <v-btn size="small" @click="viewPatientInfo(patient.patient_id)"
                      ><v-icon>mdi-eye-outline</v-icon>View</v-btn
                    >
                    <v-btn size="small" @click="onUpdate(patient)" v-if="isNurse"
                      ><v-icon>mdi-pencil</v-icon>Edit</v-btn
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <PatientDialog v-model:isDialogVisible="isDialogVisible" :patientData="patientData" />
  <PaginationComponent v-model="currentPage" :totalPage="totalPage" />
</template>
