<script setup>
import { ref, computed } from 'vue'
import { usePatientStore } from '@/stores/patient'

const props = defineProps(['isDialogVisible'])
const emit = defineEmits(['update:isDialogVisible', 'patientAdded'])

const patientStore = usePatientStore()

const modal = computed({
  get: () => props.isDialogVisible,
  set: (newVal) => emit('update:isDialogVisible', newVal),
})

const formDataDefault = {
  case_number: '',
  patient_name: '',
  date_of_birth: null,
  age_gender: '',
  addmission_date: null,
  status: 'Active',
  attending_phyisician: '',
}

const formData = ref({
  ...formDataDefault,
})

// Reset form function
const resetForm = () => {
  formData.value = { ...formDataDefault }
}

// Handle form submission
const handleAddPatient = async () => {
  const result = await patientStore.addPatient(formData.value)

  if (result.success) {
    // Emit success event
    emit('patientAdded', result.data)
    // Reset form and close dialog
    resetForm()
    modal.value = false
  }
  // Error is automatically handled by the store
}
</script>

<template>
  <v-dialog v-model="modal" persistent width="800" @after-leave="resetForm">
    <v-card title="Add Patient">
      <v-card-text>
        <!-- Error Message -->
        <v-alert v-if="patientStore.error" type="error" class="mb-4">
          {{ patientStore.error }}
        </v-alert>

        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Case Number"
              type="number"
              v-model="formData.case_number"
              :error="!!patientStore.error"
              required
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              label="Patient Name"
              type="text"
              v-model="formData.patient_name"
              :error="!!patientStore.error"
              required
            />
          </v-col>

          <v-col cols="12">
            <v-date-input
              label="Date of Birth"
              v-model="formData.date_of_birth"
              :error="!!patientStore.error"
              required
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              label="Age/Gender"
              type="text"
              v-model="formData.age_gender"
              placeholder="e.g., 35/M or 28/F"
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              label="Status"
              type="text"
              v-model="formData.status"
              placeholder="e.g., Active, Stable, Critical"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              label="Attending Physician"
              type="text"
              v-model="formData.attending_phyisician"
            />
          </v-col>

          <v-col cols="12">
            <v-date-input label="Admission Date" v-model="formData.addmission_date" />
          </v-col>

          <v-col cols="12">
            <v-btn
              block
              color="blue-darken-2"
              :loading="patientStore.loading"
              :disabled="patientStore.loading"
              @click="handleAddPatient"
            >
              {{ patientStore.loading ? 'Adding Patient...' : 'Add Patient' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="modal = false" :disabled="patientStore.loading"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
