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
    age_gender: null,
    addmission_date: null,
    status: 'Admitted',
    attending_physician: '',
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

    console.log('Submitting form data:', formData.value)

    // Format the data before submission
    const submissionData = {
      ...formData.value,
      addmission_date: formatDateForSubmission(formData.value.addmission_date),
    }

    const { data, error } = isUpdate.value
      ? await patientStore.updatePatient(submissionData.id, submissionData)
      : await patientStore.addPatient(submissionData)

    if (error) {
      console.error('Error submitting patient data:', error.message)
      // Handle error (e.g., show notification to user)
      isLoading.value = false
      return
    } else if (data) {
      await patientStore.fetchPatients()
      onFormReset()
      modal.value = false
    }
  }

  //Trigger Validators
  const onFormSubmit = async () => {
    const form = refVForm.value
    const { valid: isValid } = await form?.validate()
    if (isValid) onSubmit()
  }

  const onFormReset = () => {
    const form = refVForm.value
    if (form) form.reset()
    formData.value = { ...formDataDefault }
    modal.value = false
  }
  return {
    modal,
    isLoading,
    formData,
    onFormSubmit,
    refVForm,
  }
}
