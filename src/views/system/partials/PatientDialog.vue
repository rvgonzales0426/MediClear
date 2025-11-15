<script setup>
import { onMounted, watch } from 'vue'
import { usePatientOperations } from '@/composables/usePatientOperations'
import { useDoctors } from '@/composables/useDoctors'
import { requiredValidator } from '@/utils/validators'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    default: false,
  },
  patientData: {
    type: Object,
    default: null,
  },
})
const emits = defineEmits(['update:isDialogVisible'])

const { formAction, isUpdate, modal, formData, refVForm, onFormSubmit } = usePatientOperations(
  props,
  emits,
)

const { doctors, fetchDoctors, doctorOptions, isLoading, error } = useDoctors()

// Fetch doctors when component mounts
onMounted(async () => {
  console.log('PatientDialog mounted, fetching doctors...')
  await fetchDoctors()
  console.log('Doctors after fetch:', doctors.value)
  console.log('Doctor options:', doctorOptions())
})

// Watch for patient data changes (when editing)
watch(
  () => props.patientData,
  (newPatientData) => {
    if (newPatientData && newPatientData.attending_doctor_id && doctors.value.length > 0) {
      // If editing and doctor name is missing, populate it from doctors list
      if (!newPatientData.attending_doctor_name) {
        const doctor = doctors.value.find((d) => d.id === newPatientData.attending_doctor_id)
        if (doctor) {
          formData.value.attending_doctor_name = doctor.full_name || doctor.email
        }
      }
    }
  },
  { immediate: true },
)

// Watch for doctor selection and update attending_doctor_name
watch(
  () => formData.value.attending_doctor_id,
  (newDoctorId) => {
    console.log('Doctor ID changed to:', newDoctorId)
    if (newDoctorId) {
      const selectedDoctor = doctors.value.find((d) => d.id === newDoctorId)
      console.log('Selected doctor:', selectedDoctor)
      if (selectedDoctor) {
        formData.value.attending_doctor_name = selectedDoctor.full_name || selectedDoctor.email
        console.log('Set attending_doctor_name to:', formData.value.attending_doctor_name)
      } else {
        console.warn('⚠️ Doctor not found in list for ID:', newDoctorId)
      }
    } else {
      formData.value.attending_doctor_name = ''
      console.log('Cleared attending_doctor_name')
    }
  },
)

const patientStatus = [
  {
    title: 'Admitted',
    value: 'Admitted',
  },
  {
    title: 'Discharge Requested',
    value: 'Discharge Requested',
  },
  {
    title: 'Approved',
    value: 'Approved',
  },
  {
    title: 'Released',
    value: 'Released',
  },
]
</script>

<template>
  <v-dialog v-model="modal" persistent width="800">
    <v-card :title="isUpdate ? 'Update Patient' : 'Add Patient'">
      <v-card-text>
        <v-form fast-fail ref="refVForm" @submit.prevent="onFormSubmit">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Case Number"
                type="number"
                v-model="formData.case_number"
                :rules="[requiredValidator]"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="Patient Name"
                type="text"
                v-model="formData.patient_name"
                :rules="[requiredValidator]"
              />
            </v-col>

            <v-col cols="6">
              <v-text-field
                label="Age/Gender"
                type="text"
                v-model="formData.age_gender"
                :rules="[requiredValidator]"
              />
            </v-col>

            <v-col cols="6 ">
              <v-select
                label="Status"
                v-model="formData.status"
                :items="patientStatus"
                :tile="patientStatus.title"
                :value="patientStatus.value"
                :rules="[requiredValidator]"
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-select
                label="Attending Physician"
                v-model="formData.attending_doctor_id"
                :items="doctorOptions()"
                item-title="title"
                item-value="value"
                :rules="[requiredValidator]"
                :loading="isLoading"
                :disabled="isLoading || error"
                :hint="error || 'Select the doctor assigned to this patient'"
                :error="!!error"
                persistent-hint
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :subtitle="item.raw.subtitle"> </v-list-item>
                </template>
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-title>
                      {{ error || 'No doctors registered. Please register a doctor first.' }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>

            <v-col cols="12">
              <v-date-input
                label="Admission Date"
                format="yyyy/MM/dd"
                v-model="formData.addmission_date"
                :rules="[requiredValidator]"
              />
            </v-col>
          </v-row>

          <v-btn
            block
            color="blue-darken-2"
            type="submit"
            :loading="formAction.formProccess"
            :disabled="formAction.formProccess"
            ripple
            >{{ isUpdate ? 'Update Patient' : 'Add Patient' }}</v-btn
          >
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="modal = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
