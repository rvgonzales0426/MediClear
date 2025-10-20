<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { usePatientInfo } from './partials/patientInfo'
import PatientInfoWidgets from './partials/PatientInfoWidgets.vue'

const { currentPatientId, patientInfo, refreshPatientInfo, isLoading, isDoctor } = usePatientInfo()

// Status colors following MediClear patient workflow
const statusColors = {
  'Discharge Requested': 'orange',
  Approved: 'green',
  Released: 'grey',
  Admitted: 'blue',
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
          <v-col cols="12">
            <v-card elevation="4">
              <v-card-title class="d-flex align-center">
                <v-btn
                  icon="mdi-arrow-left"
                  variant="text"
                  size="small"
                  @click="$router.go(-1)"
                  class="me-2"
                />
                <span class="text-h5">Patient Information</span>
                <v-spacer />
                <v-btn
                  icon="mdi-refresh"
                  variant="text"
                  @click="refreshPatientInfo"
                  :loading="isLoading"
                />
              </v-card-title>

              <v-card-text>
                <v-row class="align-center">
                  <!-- Patient Info Section -->
                  <v-col cols="12" md="7">
                    <div class="mb-2">
                      <div class="text-h4 mb-2">{{ patientInfo.patient_name }}</div>
                      <div class="text-subtitle-1 text-medium-emphasis mb-3">
                        Case #{{ patientInfo.case_number }}
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
                    v-if="isDoctor && patientInfo.status === 'Discharge Requested'"
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
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Patient Details with Widget -->
        <v-row>
          <v-col cols="12" lg="4">
            <PatientInfoWidgets :patient="patientInfo" />
          </v-col>
        </v-row>
      </template>

      <!-- Error/No Patient State -->
      <v-row v-else>
        <v-col cols="12" class="text-center py-8">
          <v-icon size="64" color="error">mdi-alert-circle-outline</v-icon>
          <div class="text-h6 mt-4">Patient Not Found</div>
          <div class="text-body-2 text-medium-emphasis mt-2">
            Patient ID: {{ currentPatientId }}
          </div>
          <v-btn @click="refreshPatientInfo" class="mt-4">Refresh</v-btn>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
