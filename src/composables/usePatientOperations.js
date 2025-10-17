import { ref } from 'vue'
import { supabase } from '@/supabase'

export const usePatientOperations = () => {
  const loading = ref(false)
  const error = ref(null)

  const addPatient = async (patientData) => {
    try {
      loading.value = true
      error.value = null

      // Validate required fields
      if (!patientData.case_number?.trim()) {
        throw new Error('Case number is required')
      }
      if (!patientData.patient_name?.trim()) {
        throw new Error('Patient name is required')
      }
      if (!patientData.date_of_birth) {
        throw new Error('Date of birth is required')
      }

      // Transform data to match your database schema
      const patientToInsert = {
        caseNumber: patientData.case_number,
        patientName: patientData.patient_name,
        date_of_birth:
          patientData.date_of_birth instanceof Date
            ? patientData.date_of_birth.toISOString().split('T')[0]
            : patientData.date_of_birth,
        ageGender: patientData.age_gender || null,
        status: patientData.status || 'Active',
        attendingPhysician: patientData.attending_phyisician,
        admissionDate: patientData.addmission_date
          ? patientData.addmission_date instanceof Date
            ? patientData.addmission_date.toISOString().split('T')[0]
            : patientData.addmission_date
          : new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { data, error: supabaseError } = await supabase
        .from('patients')
        .insert([patientToInsert])
        .select()

      if (supabaseError) throw supabaseError

      return { success: true, data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    addPatient,
  }
}
