import { defineStore } from 'pinia'
import { supabase } from '@/composables/useSupabase'
import { ref } from 'vue'

export const useDiagnosisStore = defineStore('diagnosis', () => {
  const diagnoses = ref([])

  const getDiagnosisByPatientId = async (currentPatientId) => {
    const { data, error } = await supabase
      .from('diagnosis')
      .select('*')
      .eq('patient_id', currentPatientId)
      .order('diagnosis_date', { ascending: false })

    if (error) {
      console.error('Error fetching diagnosis:', error)
      return
    }

    if (data) {
      diagnoses.value = data
    }
  }

  const addPatientDiagnosis = async (patientId, diagnosisData) => {
    const { data, error } = await supabase
      .from('diagnosis')
      .insert([
        {
          patient_id: patientId,
          ...diagnosisData,
        },
      ])
      .select()

    if (error) {
      console.error('Error adding diagnosis:', error)
      return null
    }

    return data
  }

  const updatePatientDiagnosis = async (diagnosisId, diagnosisData) => {
    const { data, error } = await supabase
      .from('diagnosis')
      .update(diagnosisData)
      .eq('diagnosis_id', diagnosisId)
      .select()

    if (error) {
      console.error('Error updating diagnosis:', error)
      return null
    }

    return data
  }

  const deletePatientDiagnosis = async (diagnosisId) => {
    const { error } = await supabase.from('diagnosis').delete().eq('diagnosis_id', diagnosisId)

    if (error) {
      console.error('Error deleting diagnosis:', error)
      return false
    }

    return true
  }

  return {
    diagnoses,
    getDiagnosisByPatientId,
    addPatientDiagnosis,
    updatePatientDiagnosis,
    deletePatientDiagnosis,
  }
})
