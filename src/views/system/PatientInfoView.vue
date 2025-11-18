<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { usePatientInfo } from './partials/patientInfo'
import DemographicsWidget from './partials/DemographicsWidget.vue'
import AdmissionDetailsWidget from './partials/AdmissionDetailsWidget.vue'
import MedicalHistoryWidget from './partials/MedicalHistoryWidget.vue'
import BillingWidget from './partials/BillingWidget.vue'
import DiagnosisWidget from './partials/DiagnosisWidget.vue'
import VitalSignsWidget from './partials/VitalSignsWidget.vue'
import { computed } from 'vue'

const {
  authStore,
  patientInfo,
  isLoading,
  isDoctor,
  currentPatientId,
  medicalHistory,
  billing,
  diagnosis,
  vitalSigns,
  refreshMedicalHistory,
  refreshBilling,
  refreshDiagnosis,
  refreshVitalSigns,
} = usePatientInfo()

const isAssignedDoctor = computed(() => {
  // Check if current patient is assigned to the logged-in doctor
  return patientInfo.value && patientInfo.value.attending_doctor_id === authStore.userData?.id
})

// Status colors following MediClear patient workflow
const statusColors = {
  'Discharge Requested': 'orange',
  Approved: 'green',
  Released: 'grey',
  Admitted: 'blue',
}

const handleMedicalHistoryAdded = async () => {
  await refreshMedicalHistory()
}

const handleBillingAdded = async () => {
  await refreshBilling()
}

const handleDiagnosisAdded = async () => {
  await refreshDiagnosis()
}

const handleVitalSignsAdded = async () => {
  await refreshVitalSigns()
}
</script>

<template>
  <AppLayout>
    <template #content>
      <!-- Loading State -->
      <v-row v-if="isLoading">
        <v-col cols="12" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="64" />
          <div class="text-body-1 mt-4">Loading patient information...</div>
        </v-col>
      </v-row>

      <!-- Patient Info Content -->
      <template v-else-if="patientInfo">
        <!-- Patient Header Card -->

        <v-row>
          <v-col cols="12" lg="10">
            <v-row class="align-center">
              <!-- Patient Info Section -->
              <v-col cols="12" md="7">
                <div class="mb-2">
                  <div class="text-h4 mb-2">{{ patientInfo.patient_name }}</div>
                  <div class="text-subtitle-1 text-medium-emphasis mb-3">
                    Case Number:{{ patientInfo.case_number }}
                  </div>
                  <v-chip
                    :color="statusColors[patientInfo.status]"
                    variant="flat"
                    size="default"
                    class="font-weight-medium"
                  >
                    {{ patientInfo.status }}
                  </v-chip>
                </div>
              </v-col>

              <!-- Action Buttons Section (Doctor Only) -->
              <v-col
                cols="12"
                md="5"
                v-if="isDoctor && patientInfo.status === 'Discharge Requested' && isAssignedDoctor"
              >
                <div class="d-flex flex-column flex-sm-row ga-2 justify-md-end">
                  <v-btn
                    prepend-icon="mdi-check-circle-outline"
                    color="green"
                    variant="flat"
                    block
                    class="text-none"
                  >
                    Approve Discharge
                  </v-btn>
                  <v-btn
                    prepend-icon="mdi-close-circle-outline"
                    color="red"
                    variant="outlined"
                    block
                    class="text-none"
                  >
                    Reject Request
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- Patient Details with Widget -->
        <v-row>
          <v-col cols="12" lg="6">
            <DemographicsWidget :patient="patientInfo" />
          </v-col>
          <v-col cols="12" lg="6">
            <AdmissionDetailsWidget :patient="patientInfo" />
          </v-col>

          <v-col cols="12" lg="6">
            <MedicalHistoryWidget
              :patient-id="currentPatientId"
              :medical_history="medicalHistory"
              @added="handleMedicalHistoryAdded"
            />
          </v-col>

          <v-col cols="12" lg="6">
            <DiagnosisWidget
              :patient-id="currentPatientId"
              :diagnosis="diagnosis"
              @added="handleDiagnosisAdded"
            />
          </v-col>

          <v-col cols="12" lg="6">
            <BillingWidget
              :patient-id="currentPatientId"
              :billing="billing"
              @added="handleBillingAdded"
            />
          </v-col>

          <v-col cols="12" lg="6">
            <VitalSignsWidget
              :patient-id="currentPatientId"
              :vital-signs="vitalSigns"
              @added="handleVitalSignsAdded"
            />
          </v-col>
        </v-row>
      </template>
    </template>
  </AppLayout>
</template>
