<script setup>
defineProps({
  columns: {
    type: Object,
    required: true,
  },
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
        <th v-for="column in columns" :key="column.key" class="text-left font-weight-bold">
          {{ column.label }}
        </th>
        <th class="text-left font-weight-bold">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="loading">
        <td :colspan="columns.length" class="text-center">
          <v-progress-circular indeterminate></v-progress-circular>
        </td>
      </tr>
      <template v-else>
        <tr v-for="patient in patients" :key="patient.id">
          <td v-for="column in columns" :key="column.key">
            {{ patient[column.key] }}
          </td>

          <td class="d-flex ga-2 align-center">
            <v-btn size="small" @click="$emit('view', patient.id)"
              ><v-icon>mdi-eye-outline</v-icon>View</v-btn
            >

            <v-btn size="small" color="success" @click="$emit('approve', patient.id)"
              ><v-icon>mdi-check-circle-outline</v-icon>Approve</v-btn
            >

            <v-btn size="small" color="error" @click="$emit('reject', patient.id)"
              ><v-icon>mdi-close-circle-outline</v-icon>Reject</v-btn
            >
          </td>
        </tr>
      </template>
    </tbody>
  </v-table>
</template>
