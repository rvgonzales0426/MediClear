import { ref, watch, computed } from 'vue'
import { usePatientStore } from '@/stores/patient'
import { formatDateForSubmission } from '@/utils/helpers'

export const usePatientOperations = (props, emits) => {
  const modal = computed({
    get: () => props?.isDialogVisible,
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
    status: null,
    attending_phyisician: '',
  }

  const formData = ref({
    ...formDataDefault,
  })

  watch(
    () => props?.patientData,
    () => {
      isUpdate.value = props?.patientData ? true : false
      formData.value = isUpdate.value ? { ...props.patientData } : { ...formDataDefault }
    },
    { immediate: true },
  )

  const onSubmit = async () => {
    isLoading.value = true

    try {
      // Format the data before submission
      const submissionData = {
        ...formData.value,
        date_of_birth: formatDateForSubmission(formData.value.date_of_birth),
        addmission_date: formatDateForSubmission(formData.value.addmission_date),
      }

      if (isUpdate.value) {
        await patientStore.updatePatient(submissionData.id, submissionData)
      } else {
        await patientStore.addPatient(submissionData)
      }

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
