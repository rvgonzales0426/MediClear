<script setup>
import { usePatientOperations } from '@/composables/usePatientOperations'
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

const { formAction, isUpdate, modal, formData, refVForm, isLoading, onFormSubmit } =
  usePatientOperations(props, emits)

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
              <v-text-field
                label="Attending Physician"
                type="text"
                v-model="formData.attending_physician"
                :rules="[requiredValidator]"
              />
            </v-col>

            <v-col cols="12">
              <v-date-input
                label="Addmission Date"
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
