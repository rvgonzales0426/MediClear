<script setup>
import { onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import StatisticsCard from './partials/StatisticsCard.vue'
import ChartCard from './partials/ChartCard.vue'
import ReportFilters from './partials/ReportFilters.vue'
import { useReports } from '@/composables/useReports'
import { usePatientStore } from '@/stores/patient'
import { useAuthStore } from '@/stores/auth'

const patientStore = usePatientStore()
const authStore = useAuthStore()

const {
  dateRange,
  selectedWard,
  selectedStatus,
  wardOptions,
  statusOptions,
  totalPatients,
  patientsByStatus,
  averageAge,
  statusChartData,
  wardChartData,
  genderChartData,
  monthlyChartData,
  exportToCSV,
  exportToPDF,
} = useReports()

const clearFilters = () => {
  dateRange.value = [null, null]
  selectedWard.value = 'All Wards'
  selectedStatus.value = 'All Statuses'
}

onMounted(async () => {
  await authStore.getUserInformation()
  const userRole = authStore.userData?.role
  const userId = authStore.userData?.id
  // Pass true as third parameter to fetch ALL patients for reports (regardless of doctor assignment)
  await patientStore.fetchPatients(userRole, userId, true)
})
</script>

<template>
  <AppLayout>
    <template #content>
      <!-- Header -->
      <v-row>
        <v-col cols="12" lg="8">
          <h3 class="text-h4">Reports & Analytics</h3>
          <p class="text-caption">View patient statistics and export reports</p>
        </v-col>
        <v-col cols="12" lg="4" class="d-flex ga-2 justify-lg-end">
          <v-btn prepend-icon="mdi-file-delimited" color="success" @click="exportToCSV">
            Export CSV
          </v-btn>
          <v-btn prepend-icon="mdi-file-pdf-box" color="error" @click="exportToPDF">
            Export PDF
          </v-btn>
        </v-col>
      </v-row>

      <!-- Filters -->
      <ReportFilters
        v-model:date-range="dateRange"
        v-model:selected-ward="selectedWard"
        v-model:selected-status="selectedStatus"
        :ward-options="wardOptions"
        :status-options="statusOptions"
        @clear="clearFilters"
      />

      <!-- Loading State -->
      <v-row v-if="patientStore.isLoading">
        <v-col cols="12" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="64" />
          <div class="text-body-1 mt-4">Loading report data...</div>
        </v-col>
      </v-row>

      <template v-else>
        <!-- Statistics Cards -->
        <v-row>
          <v-col cols="12" md="3">
            <StatisticsCard
              title="Total Patients"
              :value="totalPatients"
              icon="mdi-account-group"
              color="primary"
            />
          </v-col>
          <v-col cols="12" md="3">
            <StatisticsCard
              title="Admitted"
              :value="patientsByStatus.Admitted"
              icon="mdi-hospital-box"
              color="blue"
            />
          </v-col>
          <v-col cols="12" md="3">
            <StatisticsCard
              title="Discharge Requested"
              :value="patientsByStatus['Discharge Requested']"
              icon="mdi-clipboard-check"
              color="orange"
            />
          </v-col>
          <v-col cols="12" md="3">
            <StatisticsCard
              title="Average Age"
              :value="averageAge + ' yrs old'"
              icon="mdi-account-clock"
              color="purple"
            />
          </v-col>
        </v-row>

        <!-- Status Breakdown -->
        <v-row>
          <v-col cols="12" md="6">
            <StatisticsCard
              title="Approved"
              :value="patientsByStatus.Approved"
              icon="mdi-check-circle"
              color="green"
            />
          </v-col>
          <v-col cols="12" md="6">
            <StatisticsCard
              title="Released"
              :value="patientsByStatus.Released"
              icon="mdi-home-account"
              color="grey"
            />
          </v-col>
        </v-row>

        <!-- Charts -->
        <v-row>
          <v-col cols="12" lg="6">
            <ChartCard
              title="Patients by Status"
              :chart-data="statusChartData"
              chart-type="doughnut"
              :height="350"
            />
          </v-col>
          <v-col cols="12" lg="6">
            <ChartCard
              title="Patients by Ward"
              :chart-data="wardChartData"
              chart-type="bar"
              :height="350"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" lg="6">
            <ChartCard
              title="Patients by Gender"
              :chart-data="genderChartData"
              chart-type="pie"
              :height="350"
            />
          </v-col>
          <v-col cols="12" lg="6">
            <ChartCard
              title="Admissions Over Time"
              :chart-data="monthlyChartData"
              chart-type="line"
              :height="350"
            />
          </v-col>
        </v-row>
      </template>
    </template>
  </AppLayout>
</template>
