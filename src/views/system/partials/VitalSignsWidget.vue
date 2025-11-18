<script setup>
import { useVitalSigns } from '@/composables/useVitalSigns'
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  patientId: {
    type: String,
    required: true,
  },
  vitalSigns: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['added'])

const { formAction, isUpdate, isEditing, formData, startEditing, cancelEditing, submitVitalSigns } =
  useVitalSigns(props, emit)

// Computed label for datetime field
const datetimeLabel = computed(() => {
  if (formData.value.record_datetime) {
    const formatted = dayjs(formData.value.record_datetime).format('MMM DD, YYYY h:mm A')
    return `Last Updated: ${formatted}`
  }
  return 'Date & Time'
})
</script>

<template>
  <v-card title="Vital Signs" elevation="4">
    <template v-slot:prepend>
      <v-icon icon="mdi-heart-pulse" />
    </template>

    <template v-slot:append>
      <v-btn v-if="!isEditing" size="50" variant="plain" icon @click="startEditing">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="6">
            <p class="text-caption" v-if="!isEditing">{{ datetimeLabel }}</p>
            <v-text-field
              v-model="formData.record_datetime"
              label="Date & Time"
              type="datetime-local"
              variant="underlined"
              density="compact"
              :disabled="!isEditing"
              placeholder="No date recorded"
              v-if="isEditing"
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              v-model.number="formData.temperature"
              label="Temperature (°C)"
              type="number"
              step="0.1"
              variant="underlined"
              density="compact"
              :disabled="!isEditing"
              placeholder="No temperature recorded"
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              v-model.number="formData.pulse"
              label="Pulse (bpm)"
              type="number"
              variant="underlined"
              density="compact"
              :disabled="!isEditing"
              placeholder="No pulse recorded"
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              v-model.number="formData.respiration"
              label="Respiration (/min)"
              type="number"
              variant="underlined"
              density="compact"
              :disabled="!isEditing"
              placeholder="No respiration recorded"
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              v-model="formData.blood_pressure"
              label="Blood Pressure"
              variant="underlined"
              density="compact"
              :disabled="!isEditing"
              placeholder="No blood pressure recorded"
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              v-model.number="formData.oxygen_saturation"
              label="Oxygen Saturation (%)"
              type="number"
              variant="underlined"
              density="compact"
              :disabled="!isEditing"
              placeholder="No oxygen saturation recorded"
            />
          </v-col>
        </v-row>

        <v-row v-if="isEditing">
          <v-col cols="12" class="d-flex ga-2 justify-end">
            <v-btn @click="cancelEditing" :disabled="formAction.formProccess" variant="outlined">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              @click="submitVitalSigns"
              :loading="formAction.formProccess"
              :disabled="formAction.formProccess"
            >
              {{ isUpdate ? 'Update' : 'Save' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
