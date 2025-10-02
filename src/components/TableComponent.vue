<script setup>
defineProps({
  columns: {
    type: Object,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['view'])
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
        <tr v-for="row in data" :key="row.id">
          <td v-for="column in columns" :key="column.key">
            <template v-if="column.key === 'status'">
              <v-chip :color="column.color[row[column.key]]">{{ row[column.key] }}</v-chip>
            </template>
            <template v-else>
              {{ row[column.key] }}
            </template>
          </td>

          <td class="d-flex align-center ga-2">
            <v-btn size="small" @click="$emit('view', data.id)"
              ><v-icon>mdi-eye-outline</v-icon>View</v-btn
            >

            <v-btn
              color="orange"
              size="small"
              prepend-icon="mdi-file-document-outline "
              v-if="row.status === 'Admitted'"
              >Request Discharge</v-btn
            >
          </td>
        </tr>
      </template>
    </tbody>
  </v-table>
</template>
