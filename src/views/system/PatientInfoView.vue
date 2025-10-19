<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { usePatientInfo } from './partials/patientInfo'
import PatientInfoWidgets from './partials/PatientInfoWidgets.vue'

const { currentPatientId, patientInfo, refreshPatientInfo, isLoading } = usePatientInfo()

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
        <v-row>
          <v-col cols="12">
            <v-card title="Patient Information">
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <h3>{{ patientInfo.patient_name }}</h3>
                      <p>Case: {{ patientInfo.case_number }}</p>
                      <p>Status: {{ patientInfo.status }}</p>
                    </v-col>
                  </v-row>
                </v-container>
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
