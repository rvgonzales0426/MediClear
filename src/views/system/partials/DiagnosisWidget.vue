<script setup>
import { useDiagnosis } from '@/composables/useDiagnosis'

const props = defineProps({
  patientId: {
    type: String,
    required: true,
  },
  diagnosis: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['added'])

const { formAction, isUpdate, isEditing, formData, startEditing, cancelEditing, submitDiagnosis } =
  useDiagnosis(props, emit)
</script>

<template>
  <v-card title="Diagnosis" elevation="4" class="pb-13">
    <template v-slot:prepend>
      <v-icon icon="mdi-stethoscope" />
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
              v-model="formData.diagnosis_date"
              label="Diagnosis Date"
              type="date"
              variant="underlined"
              density="compact"
              :disabled="!isEditing"
              placeholder="No diagnosis date recorded"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="formData.diagnosis_details"
              label="Diagnosis Details"
              variant="underlined"
              density="compact"
              :disabled="!isEditing"
              rows="2"
              placeholder="No diagnosis details recorded"
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
              @click="submitDiagnosis"
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
