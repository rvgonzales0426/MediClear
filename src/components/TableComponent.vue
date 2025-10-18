<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'
defineProps({
  patients: {
    type: Array,
    required: true,
  },
})

const authStore = useAuthStore()

defineEmits(['view', 'requestDischarge'])

// Status color mapping
const statusColors = {
  'Discharge Requested': 'orange',
  Approved: 'green',
  Released: undefined,
  Admitted: 'blue',
}

// Computed property for user role
const isNurse = computed(() => authStore.userData?.role === 'nurse')
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left font-weight-bold">Patient Name</th>
        <th class="text-left font-weight-bold">Admission Date</th>
        <th class="text-left font-weight-bold">Status</th>
        <th class="text-left font-weight-bold">Attending Physician</th>
        <th class="text-left font-weight-bold">Actions</th>
      </tr>
    </thead>
    <tbody>
      <!-- Loading state -->
      <tr v-if="!patients || patients.length === 0">
        <td colspan="5" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" />
        </td>
      </tr>

      <!-- Patient rows -->
      <tr v-else v-for="patient in patients" :key="patient.id">
        <td class="py-3">{{ patient.patient_name }}</td>
        <td class="py-3">{{ dayjs(patient.admission_date).format('YYYY-MMM-DD') }}</td>
        <td class="py-3">
          <v-chip
            :color="statusColors[patient.status]"
            variant="flat"
            size="small"
            class="font-weight-medium"
          >
            {{ patient.status }}
          </v-chip>
        </td>
        <td class="py-3">{{ patient.attending_physician }}</td>
        <td class="py-3">
          <div class="d-flex align-center ga-2">
            <v-btn
              size="small"
              variant="outlined"
              prepend-icon="mdi-eye-outline"
              @click="$emit('view', patient.id)"
            >
              View
            </v-btn>

            <v-btn
              v-if="isNurse && patient.status === 'Admitted'"
              color="orange"
              size="small"
              variant="flat"
              prepend-icon="mdi-file-document-outline"
              @click="$emit('requestDischarge', patient.id)"
            >
              Request Discharge
            </v-btn>
          </div>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
