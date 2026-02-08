<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePatientStore } from '@/stores/patient'
import { useAuthStore } from '@/stores/auth'
import PaginationComponent from '../PaginationComponent.vue'
import PatientDialog from '@/views/system/partials/PatientDialog.vue'
import { usePatientSearch } from '@/composables/usePatientSearch'
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

const {
  paginatedPatients,
  currentPage,
  totalPage,
  searchQuery,
  selectedStatus,
  statusOptions,
  selectedWard,
  filteredPatients,
  wardOptions,
  clearFilters,
  resetPagination,
} = usePatientSearch()

const onUpdate = (patient) => {
  patientData.value = patient
  isDialogVisible.value = true
}

onMounted(async () => {
  await authStore.getUserInformation()
  const userRole = authStore.userData?.role
  const userId = authStore.userData?.id
  // Pass true as third parameter to fetch ALL patients regardless of role
  await patientStore.fetchPatients(userRole, userId, true)
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
            v-model="searchQuery"
            label="Search by name or case number..."
            variant="outlined"
            density="compact"
            clearable
            prepend-inner-icon="mdi-magnify"
            @update:model-value="resetPagination"
          />
        </v-col>

        <v-col cols="12" lg="3" md="4">
          <v-select
            v-model="selectedStatus"
            variant="outlined"
            density="compact"
            label="Selec Status"
            :items="statusOptions"
            @update:model-value="resetPagination"
          />
        </v-col>

        <v-col cols="12" lg="3" md="4">
          <v-select
            v-model="selectedWard"
            variant="outlined"
            density="compact"
            label="Select Ward"
            :items="wardOptions"
            @update:model-value="resetPagination"
          />
        </v-col>

        <v-col cols="12" lg="3" md="4">
          <v-btn prepend-icon="mdi-filter-outline" block ripple @click="clearFilters"
            >Clear Filters</v-btn
          >
        </v-col>
      </v-row>

      <!-- Results count -->
      <v-row
        v-if="searchQuery || selectedStatus !== 'All Statuses' || selectedWard !== 'All Wards'"
      >
        <v-col cols="12">
          <v-chip color="primary" variant="outlined" size="small">
            {{ filteredPatients.length }} result{{ filteredPatients.length !== 1 ? 's' : '' }} found
          </v-chip>
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
                <td>{{ patient.attending_doctor_name || 'Not Assigned' }}</td>
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
