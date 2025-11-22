import { ref, watch } from 'vue'
import { useBillingStore } from '@/stores/billing'
import { toast } from 'vue3-toastify'
import { formActionDefault } from './useSupabase'

export const useBilling = (props, emit) => {
  const billingStore = useBillingStore()

  const isEditing = ref(false)
  const isUpdate = ref(false)

  const formDataDefault = {
    item_description: '',
    amount: null,
  }

  const formData = ref({ ...formDataDefault })
  const formAction = ref({ ...formActionDefault })

  watch(
    () => props.billing,
    (newValue) => {
      isUpdate.value = newValue && newValue.bill_id ? true : false

      if (isUpdate.value) {
        formData.value = {
          item_description: newValue.item_description || '',
          amount: newValue.amount || null,
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
        item_description: props.billing.item_description || '',
        amount: props.billing.amount || null,
      }
    } else {
      formData.value = { ...formDataDefault }
    }
    isEditing.value = false
  }

  const submitBilling = async () => {
    if (!props.patientId) return

    formAction.value.formProccess = true

    try {
      let result

      if (isUpdate.value) {
        result = await billingStore.updatePatientBilling(props.billing.bill_id, formData.value)
      } else {
        result = await billingStore.addPatientBilling(props.patientId, formData.value)
      }

      if (result) {
        formAction.value.formSuccessMessage = isUpdate.value
          ? 'Billing updated successfully!'
          : 'Billing added successfully!'
        toast.success(formAction.value.formSuccessMessage, { position: 'top-center' })
        isEditing.value = false
        emit('added')
      } else {
        throw new Error('Failed to save billing')
      }
    } catch (error) {
      toast.error('Error saving billing', { position: 'top-center' })
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
    submitBilling,
  }
}
