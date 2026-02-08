<script setup>
import { useMedicalHistory } from '@/composables/useMedicalHistory'

const props = defineProps({
  patientId: {
    type: String,
    required: true,
  },
  medical_history: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['added'])

const {
  formAction,
  isUpdate,
  isEditing,
  formData,
  startEditing,
  cancelEditing,
  submitMedicalHistory,
} = useMedicalHistory(props, emit)
</script>

<template>
  <v-card title="Medical History" elevation="4">
    <template v-slot:prepend>
      <v-icon icon="mdi-heart-outline" />
    </template>

    <template v-slot:append>
      <v-btn v-if="!isEditing" size="50" variant="plain" icon @click="startEditing">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="formData.allergies"
              label="Allergies"
              variant="underlined"
              density="compact"
              :disabled="!isEditing"
              placeholder="No allergies recorded"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="formData.past_illnesses"
              label="Past Illnesses"
              variant="underlined"
              density="compact"
              :disabled="!isEditing"
              placeholder="No past illnesses recorded"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="formData.previous_operations"
              label="Past Surgeries"
              variant="underlined"
              density="compact"
              :disabled="!isEditing"
              placeholder="No past surgeries recorded"
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
              @click="submitMedicalHistory"
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
