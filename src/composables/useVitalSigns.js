import { ref, watch } from 'vue'
import { useVitalSignsStore } from '@/stores/vitalSigns'
import { toast } from 'vue3-toastify'
import { formActionDefault } from './useSupabase'

export const useVitalSigns = (props, emit) => {
  const vitalSignsStore = useVitalSignsStore()

  const isEditing = ref(false)
  const isUpdate = ref(false)

  const formDataDefault = {
    record_datetime: null,
    temperature: null,
    pulse: null,
    respiration: null,
    blood_pressure: '',
    oxygen_saturation: null,
  }

  const formData = ref({ ...formDataDefault })
  const formAction = ref({ ...formActionDefault })

  watch(
    () => props.vitalSigns,
    (newValue) => {
      isUpdate.value = newValue && newValue.vital_id ? true : false

      if (isUpdate.value) {
        formData.value = {
          record_datetime: newValue.record_datetime || null,
          temperature: newValue.temperature || null,
          pulse: newValue.pulse || null,
          respiration: newValue.respiration || null,
          blood_pressure: newValue.blood_pressure || '',
          oxygen_saturation: newValue.oxygen_saturation || null,
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
        record_datetime: props.vitalSigns.record_datetime || null,
        temperature: props.vitalSigns.temperature || null,
        pulse: props.vitalSigns.pulse || null,
        respiration: props.vitalSigns.respiration || null,
        blood_pressure: props.vitalSigns.blood_pressure || '',
        oxygen_saturation: props.vitalSigns.oxygen_saturation || null,
      }
    } else {
      formData.value = { ...formDataDefault }
    }
    isEditing.value = false
  }

  const submitVitalSigns = async () => {
    if (!props.patientId) return

    formAction.value.formProccess = true

    try {
      let result

      if (isUpdate.value) {
        result = await vitalSignsStore.updatePatientVitalSigns(
          props.vitalSigns.vital_id,
          formData.value,
        )
      } else {
        result = await vitalSignsStore.addPatientVitalSigns(props.patientId, formData.value)
      }

      if (result) {
        formAction.value.formSuccessMessage = isUpdate.value
          ? 'Vital signs updated successfully!'
          : 'Vital signs added successfully!'
        toast.success(formAction.value.formSuccessMessage, { position: 'top-center' })
        isEditing.value = false
        emit('added')
      } else {
        throw new Error('Failed to save vital signs')
      }
    } catch (error) {
      toast.error('Error saving vital signs', { position: 'top-center' })
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
    submitVitalSigns,
  }
}
