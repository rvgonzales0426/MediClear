<script setup>
defineProps({
  patients: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['view', 'approve', 'reject'])
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left font-weight-bold">Patient Name</th>
        <th class="text-left font-weight-bold">Admission Date</th>
        <th class="text-left font-weight-bold">Requested By</th>
        <th class="text-left font-weight-bold">Request Date</th>
        <th class="text-left font-weight-bold">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="loading">
        <td colspan="5" class="text-center">
          <v-progress-circular indeterminate></v-progress-circular>
        </td>
      </tr>

      <tr v-else-if="!patients || patients.length === 0">
        <td colspan="5" class="text-center py-8">
          <v-icon size="64" color="grey-lighten-1" class="mb-2">mdi-clipboard-check-outline</v-icon>
          <div class="text-h6 text-grey-darken-1">No Pending Discharge Requests</div>
          <div class="text-caption text-grey">All discharge requests have been processed</div>
        </td>
      </tr>

      <template v-else>
        <tr v-for="patient in patients" :key="patient.id">
          <td>{{ patient.patient_name }}</td>
          <td>{{ patient.addmission_date }}</td>
          <td>{{ patient.requested_by || 'Not Specified' }}</td>
          <td>{{ patient.request_date || 'Not Specified' }}</td>

          <td class="d-flex ga-2 align-center">
            <v-btn size="small" @click="$emit('view', patient.patient_id)">
              <v-icon>mdi-eye-outline</v-icon>View
            </v-btn>

            <v-btn size="small" color="success" @click="$emit('approve', patient.patient_id)">
              <v-icon>mdi-check-circle-outline</v-icon>Approve
            </v-btn>

            <v-btn size="small" color="error" @click="$emit('reject', patient.patient_id)">
              <v-icon>mdi-close-circle-outline</v-icon>Reject
            </v-btn>
          </td>
        </tr>
      </template>
    </tbody>
  </v-table>
</template>
