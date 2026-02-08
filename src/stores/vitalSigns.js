import { defineStore } from 'pinia'
import { supabase } from '@/composables/useSupabase'
import { ref } from 'vue'

export const useVitalSignsStore = defineStore('vitalSigns', () => {
  const vitalSigns = ref([])

  const getVitalSignsByPatientId = async (currentPatientId) => {
    const { data, error } = await supabase
      .from('vital_signs')
      .select('*')
      .eq('patient_id', currentPatientId)
      .order('record_datetime', { ascending: false })

    if (error) {
      console.error('Error fetching vital signs:', error)
      return
    }

    if (data) {
      vitalSigns.value = data
    }
  }

  const addPatientVitalSigns = async (patientId, vitalSignsData) => {
    const { data, error } = await supabase
      .from('vital_signs')
      .insert([
        {
          patient_id: patientId,
          ...vitalSignsData,
        },
      ])
      .select()

    if (error) {
      console.error('Error adding vital signs:', error)
      return null
    }

    return data
  }

  const updatePatientVitalSigns = async (vitalId, vitalSignsData) => {
    const { data, error } = await supabase
      .from('vital_signs')
      .update(vitalSignsData)
      .eq('vital_id', vitalId)
      .select()

    if (error) {
      console.error('Error updating vital signs:', error)
      return null
    }

    return data
  }

  const deletePatientVitalSigns = async (vitalId) => {
    const { error } = await supabase.from('vital_signs').delete().eq('vital_id', vitalId)

    if (error) {
      console.error('Error deleting vital signs:', error)
      return false
    }

    return true
  }

  return {
    vitalSigns,
    getVitalSignsByPatientId,
    addPatientVitalSigns,
    updatePatientVitalSigns,
    deletePatientVitalSigns,
  }
})
