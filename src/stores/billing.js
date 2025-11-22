import { defineStore } from 'pinia'
import { supabase } from '@/composables/useSupabase'
import { ref } from 'vue'

export const useBillingStore = defineStore('billing', () => {
  const billings = ref([])

  const getBillingByPatientId = async (currentPatientId) => {
    const { data, error } = await supabase
      .from('billing')
      .select('*')
      .eq('patient_id', currentPatientId)

    if (error) {
      console.error('Error fetching billing:', error)
      return
    }

    if (data) {
      billings.value = data
    }
  }

  const addPatientBilling = async (patientId, billingData) => {
    const { data, error } = await supabase
      .from('billing')
      .insert([
        {
          patient_id: patientId,
          ...billingData,
        },
      ])
      .select()

    if (error) {
      console.error('Error adding billing:', error)
      return null
    }

    return data
  }

  const updatePatientBilling = async (billId, billingData) => {
    const { data, error } = await supabase
      .from('billing')
      .update(billingData)
      .eq('bill_id', billId)
      .select()

    if (error) {
      console.error('Error updating billing:', error)
      return null
    }

    return data
  }

  const deletePatientBilling = async (billId) => {
    const { error } = await supabase.from('billing').delete().eq('bill_id', billId)

    if (error) {
      console.error('Error deleting billing:', error)
      return false
    }

    return true
  }

  return {
    billings,
    getBillingByPatientId,
    addPatientBilling,
    updatePatientBilling,
    deletePatientBilling,
  }
})
