import { ref, watch, computed } from 'vue'
import { usePatientStore } from '@/stores/patient'
import { formatDateForSubmission } from '@/utils/helpers'
import { formActionDefault } from './useSupabase'
import { toast } from 'vue3-toastify'

export const usePatientOperations = (props, emits) => {
  const modal = computed({
    get: () => props?.isDialogVisible,
    set: (newVal) => emits('update:isDialogVisible', newVal),
  })

  //Load variables
  const patientStore = usePatientStore()
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

  const formAction = ref({ ...formActionDefault })

  //E check niya if isa patentdata ang na pass sa props para ma determine kung add or update
  watch(
    () => props?.patientData,
    () => {
      isUpdate.value = props?.patientData ? true : false
      formData.value = isUpdate.value ? { ...props.patientData } : { ...formDataDefault }
    },
    { immediate: true },
  )

  const onSubmit = async () => {
    formAction.value.formProccess = true

    // Format the data before submission
    const submissionData = {
      ...formData.value,
      addmission_date: formatDateForSubmission(formData.value.addmission_date),
    }

    const { data, error } = isUpdate.value
      ? await patientStore.updatePatient(submissionData)
      : await patientStore.addPatient(submissionData)

    if (error) {
      console.error('Error submitting patient data:', error.message)
      // Handle error (e.g., show notification to user)

      toast.error(error.message, { position: 'top-center' })
      formAction.value.formProccess = false
      return
    } else if (data) {
      toast.success(
        isUpdate.value ? 'Successfully updated patient data.' : 'Successfully added patient data.',
        { position: 'top-center' },
      )
      formAction.value.formProccess = false
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

  // Reset Form
  const onFormReset = () => {
    const form = refVForm.value
    if (form) form.reset()
    formData.value = { ...formDataDefault }
    formAction.value = { ...formActionDefault }
    modal.value = false
  }
  return {
    modal,
    isUpdate,
    formAction,
    formData,
    onFormSubmit,
    refVForm,
  }
}
