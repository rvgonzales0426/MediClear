import { ref, watch } from 'vue'
import { useDiagnosisStore } from '@/stores/diagnosis'
import { toast } from 'vue3-toastify'
import { formActionDefault } from './useSupabase'

export const useDiagnosis = (props, emit) => {
  const diagnosisStore = useDiagnosisStore()

  const isEditing = ref(false)
  const isUpdate = ref(false)

  const formDataDefault = {
    diagnosis_date: null,
    diagnosis_details: '',
  }

  const formData = ref({ ...formDataDefault })
  const formAction = ref({ ...formActionDefault })

  watch(
    () => props.diagnosis,
    (newValue) => {
      isUpdate.value = newValue && newValue.diagnosis_id ? true : false

      if (isUpdate.value) {
        formData.value = {
          diagnosis_date: newValue.diagnosis_date || null,
          diagnosis_details: newValue.diagnosis_details || '',
        }
      } else {
        formData.value = { ...formDataDefault }
      }
    },
    { immediate: true },
  )

  const startEditing = () => {
    isEditing.value = true
  }

  const cancelEditing = () => {
    if (isUpdate.value) {
      formData.value = {
        diagnosis_date: props.diagnosis.diagnosis_date || null,
        diagnosis_details: props.diagnosis.diagnosis_details || '',
      }
    } else {
      formData.value = { ...formDataDefault }
    }
    isEditing.value = false
  }

  const submitDiagnosis = async () => {
    if (!props.patientId) return

    formAction.value.formProccess = true

    try {
      let result

      if (isUpdate.value) {
        result = await diagnosisStore.updatePatientDiagnosis(
          props.diagnosis.diagnosis_id,
          formData.value,
        )
      } else {
        result = await diagnosisStore.addPatientDiagnosis(props.patientId, formData.value)
      }

      if (result) {
        formAction.value.formSuccessMessage = isUpdate.value
          ? 'Diagnosis updated successfully!'
          : 'Diagnosis added successfully!'
        toast.success(formAction.value.formSuccessMessage, { position: 'top-center' })
        isEditing.value = false
        emit('added')
      } else {
        throw new Error('Failed to save diagnosis')
      }
    } catch (error) {
      toast.error('Error saving diagnosis', { position: 'top-center' })
    } finally {
      formAction.value.formProccess = false
    }
  }

  return {
    isEditing,
    isUpdate,
    formData,
    formAction,
    startEditing,
    cancelEditing,
    submitDiagnosis,
  }
}
