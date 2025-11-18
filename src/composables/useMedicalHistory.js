import { ref, watch } from 'vue'
import { useMedicalHistoryStore } from '@/stores/medicalHistory'
import { toast } from 'vue3-toastify'
import { formActionDefault } from './useSupabase'

export const useMedicalHistory = (props, emit) => {
  const medicalHistoryStore = useMedicalHistoryStore()

  const isEditing = ref(false)
  const isUpdate = ref(false)

  const formDataDefault = {
    allergies: '',
    past_illnesses: '',
    previous_operations: '',
  }

  const formData = ref({ ...formDataDefault })

  const formAction = ref({ ...formActionDefault })

  // Check if medical_history exists to determine add or update
  watch(
    () => props.medical_history,
    (newValue) => {
      // Fixed: Check for history_id instead of id
      isUpdate.value = newValue && newValue.history_id ? true : false

      if (isUpdate.value) {
        // Only extract editable fields
        formData.value = {
          allergies: newValue.allergies || '',
          past_illnesses: newValue.past_illnesses || '',
          previous_operations: newValue.previous_operations || '',
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
        allergies: props.medical_history.allergies || '',
        past_illnesses: props.medical_history.past_illnesses || '',
        previous_operations: props.medical_history.previous_operations || '',
      }
    } else {
      formData.value = { ...formDataDefault }
    }
    isEditing.value = false
  }

  const submitMedicalHistory = async () => {
    if (!props.patientId) return

    formAction.value.formProccess = true

    try {
      let result

      if (isUpdate.value) {
        // Fixed: Use history_id instead of id
        result = await medicalHistoryStore.updatePatientMedicalHistory(
          props.medical_history.history_id,
          formData.value,
        )
      } else {
        result = await medicalHistoryStore.addPatientMedicalHistory(props.patientId, formData.value)
      }

      if (result) {
        formAction.value.formSuccessMessage = isUpdate.value
          ? 'Medical history updated successfully!'
          : 'Medical history added successfully!'
        toast.success(formAction.value.formSuccessMessage, { position: 'top-center' })
        isEditing.value = false
        emit('added')
      } else {
        throw new Error('Failed to save medical history')
      }
    } catch (error) {
      toast.error('Error saving medical history', { position: 'top-center' })
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
    submitMedicalHistory,
  }
}
