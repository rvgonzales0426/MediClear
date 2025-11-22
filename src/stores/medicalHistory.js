import { defineStore } from 'pinia'
import { supabase } from '@/composables/useSupabase'
import { ref } from 'vue'

export const useMedicalHistoryStore = defineStore('medicalHistory', () => {
  // State
  const medicalHistories = ref([])

  const getMedicalHistoryByPatientId = async (currentPatientId) => {
    const { data, error } = await supabase.from('medical_history').select('*')
    if (error) console.log('Error fetching medical history:', error.message)
    if (data) {
      medicalHistories.value = data.filter((history) => history.patient_id === currentPatientId)
    }
  }

  const addPatientMedicalHistory = async (patientId, medicalHistoryData) => {
    const { data, error } = await supabase
      .from('medical_history')
      .insert([
        {
          patient_id: patientId,
          ...medicalHistoryData,
        },
      ])
      .select()

    if (error) {
      console.error('Error adding medical history:', error)
      return null
    }

    return data
  }

  const updatePatientMedicalHistory = async (medicalHistoryId, medicalHistoryData) => {
    const { data, error } = await supabase
      .from('medical_history')
      .update(medicalHistoryData)
      .eq('history_id', medicalHistoryId)
      .select()

    if (error) {
      console.error('Error updating medical history:', error)
      return null
    }

    return data
  }

  return {
    medicalHistories,
    getMedicalHistoryByPatientId,
    addPatientMedicalHistory,
    updatePatientMedicalHistory,
  }
})
