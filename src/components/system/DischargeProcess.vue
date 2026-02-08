<script setup>
import { onMounted, ref, computed } from 'vue'
import { usePatientStore } from '@/stores/patient'
import { useDischargeWorkflow } from '@/composables/useDischargeWorkflow'
import { useAuthStore } from '@/stores/auth'
import PaginationComponent from '@/components/PaginationComponent.vue'

// Load patient store following MediClear pattern
const patientStore = usePatientStore()
const authStore = useAuthStore()

// Use discharge workflow composable
const { statusColors, workflowRows, workflowItems, patientWorkflowData, workflowMetrics } =
  useDischargeWorkflow()

// Pagination
const itemsPerPage = 10
const currentPage = ref(1)

// Computed property for total pages
const totalPage = computed(() => {
  return Math.ceil(patientWorkflowData.value.length / itemsPerPage)
})

// Computed property for paginated workflow data
const paginatedWorkflowData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return patientWorkflowData.value.slice(start, end)
})

// Fetch patients on component mount
onMounted(async () => {
  await authStore.getUserInformation()
  const userRole = authStore.userData?.role
  const userId = authStore.userData?.id
  // Fetch all patients for discharge workflow tracking
  await patientStore.fetchPatients(userRole, userId, true)
})
</script>

<template>
  <v-card
    title="Discharge Process Flow"
    subtitle="Standard workflow for patient discharge management"
  >
    <v-card-text>
      <v-row>
        <v-col cols="12" v-for="row in workflowRows" :key="row.title">
          <div class="d-flex ga-4 align-center flex-column flex-sm-row">
            <v-avatar :color="row.color" size="60" class="flex-shrink-0">
              <v-icon>{{ row.icon }}</v-icon>
            </v-avatar>

            <div class="flex-grow-1" style="width: 100%">
              <div
                class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-2 ga-sm-4 mb-3"
              >
                <h2 class="text-h6 text-sm-h5">{{ row.title }}</h2>
                <v-chip
                  >{{ row.patientCount }}
                  {{ row.patientCount !== 1 ? 'Patients' : 'Patient' }}</v-chip
                >
              </div>

              <p class="mb-3">{{ row.subtitle }}</p>

              <v-progress-linear
                :model-value="row.patientCount"
                :height="7"
                color="blue-darken-2"
              ></v-progress-linear>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-row class="my-5">
    <v-col v-for="item in workflowItems" :key="item.title" cols="12" lg="3" md="4">
      <v-card :title="item.title" elevation="10" class="mx-3">
        <template v-slot:append>
          <v-icon :color="item.color">
            {{ item.icon }}
          </v-icon>
        </template>
        <v-card-text class="text-start">
          <h3 class="text-h6">
            {{ item.patientCount }}
          </h3>
          <small class="text-caption"> {{ item.percentage }}% </small>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" lg="12" md="10">
      <v-card
        title="Individual Patient Progress"
        subtitle="Track each patient's progress through the discharge workflow"
      >
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th class="text-left font-weight-bold">Patient</th>
                <th class="text-left font-weight-bold">Case Number</th>
                <th class="text-left font-weight-bold">Current Status</th>
                <th class="text-left font-weight-bold">Workflow Progress</th>
                <th class="text-left font-weight-bold">Days in Process</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!patientWorkflowData || patientWorkflowData.length === 0">
                <td colspan="5" class="text-center py-8">
                  <v-progress-circular indeterminate color="primary" />
                  <div class="text-body-2 mt-2">Loading patient data...</div>
                </td>
              </tr>
              <tr v-else v-for="data in paginatedWorkflowData" :key="data.patient_id">
                <td>{{ data.patient_name }}</td>
                <td>{{ data.case_number }}</td>
                <td>
                  <v-chip
                    :color="statusColors[data.current_status] || 'grey'"
                    variant="flat"
                    size="small"
                    class="font-weight-medium"
                  >
                    {{ data.current_status }}
                  </v-chip>
                </td>

                <td>
                  <div class="d-flex align-center ga-2">
                    <v-progress-linear
                      :model-value="data.workflow_progress"
                      :height="7"
                      color="blue-darken-2"
                    ></v-progress-linear>

                    <span>{{ data.workflow_progress_text }}</span>
                  </div>
                </td>

                <td>
                  <div class="d-flex align-center ga-3">
                    <v-icon>mdi-clock-time-two-outline</v-icon>
                    <p>
                      {{ data.days_in_process }} {{ data.days_in_process !== 1 ? 'days' : 'day' }}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <PaginationComponent v-model="currentPage" :totalPage="totalPage" />

  <v-row class="my-5">
    <v-col v-for="metric in workflowMetrics" :key="metric.title" cols="12" lg="4" md="4">
      <v-card :title="metric.title" elevation="10" class="mx-3">
        <template v-slot:prepend>
          <v-icon :icon="metric.icon" />
        </template>
        <v-card-text class="text-start">
          <h3 class="text-h6">
            {{ metric.value }}
          </h3>

          <small class="text-caption"> {{ metric.text }} </small>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
