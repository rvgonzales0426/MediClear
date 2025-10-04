<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['isDialogVisible'])
const emit = defineEmits(['update:isDialogVisible'])

const modal = computed({
  get: () => props.isDialogVisible,
  set: (newVal) => emit('update:isDialogVisible', newVal),
})

const formDatDefault = {
  case_number: '',
  patient_name: '',
  age_gender: '',
  addmission_date: '',
  status: '',
  attending_phyisician: '',
}

const formData = ref({
  ...formDatDefault,
})
</script>

<template>
  <v-dialog v-model="modal" persistent width="800">
    <v-card title="Add Patient">
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field label="Case Number" type="number" v-model="formData.case_number" />
          </v-col>

          <v-col cols="12">
            <v-text-field label="Patient Name" type="text" v-model="formData.patient_name" />
          </v-col>

          <v-col cols="6">
            <v-text-field label="Age/Gender" type="text" v-model="formData.age_gender" />
          </v-col>

          <v-col cols="6 ">
            <v-text-field label="Status" type="text" v-model="formData.status" />
          </v-col>

          <v-col cols="12">
            <v-text-field
              label="Attending Physician"
              type="text"
              v-model="formData.attending_phyisician"
            />
          </v-col>

          <v-col cols="12">
            <v-date-input label="Addmission Date" v-model="formData.addmission_date" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="modal = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
