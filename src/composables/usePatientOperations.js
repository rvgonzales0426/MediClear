import { ref, watch, computed } from 'vue'
import { usePatientStore } from '@/stores/patient'
import { defineProps } from 'vue'
import { defineEmits } from 'vue'

export const usePatientOperations = () => {
  const props = defineProps(['patientData', 'isDialogVisible'])
  const emits = defineEmits(['update:isDialogVisible'])

  const modal = computed({
    get: () => props.isDialogVisible,
    set: (newVal) => emits('update:isDialogVisible', newVal),
  })

  //Load variables
  const patientStore = usePatientStore()
  const isLoading = ref(false)
  const isUpdate = ref(false)
  const refVForm = ref()

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

  watch(
    () => props.patientData,
    () => {
      isUpdate.value = props.patientData ? true : false
      formData.value = isUpdate.value ? { ...props.patientData } : { ...formDataDefault }
    },
  )

  const onSubmit = async (id) => {
    isLoading.value = true

    try {
      isUpdate.value
        ? await patientStore.updatePatient(id)
        : await patientStore.addPatient(formData.value)

      await patientStore.fetchPatients()
      refVForm.value?.reset()
      modal.value = false
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  //Trigger Validators
  const onFormSubmit = () => {
    refVForm.value?.validate().then(({ valid }) => {
      if (valid) onSubmit()
    })
  }

  return {
    modal,
    isLoading,
    formData,
    onFormSubmit,
    refVForm,
  }
}
