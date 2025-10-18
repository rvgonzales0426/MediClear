import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/composables/useSupabase'

export const usePatientStore = defineStore('patient', () => {
  // State
  const patients = ref([])
  const error = ref(null)

  // Computed
  const totalPatients = computed(() => patients.value.length)

  const pendingDischarge = computed(
    () => patients.value.filter((p) => p.status === 'Discharge Requested').length,
  )

  const approvedPatients = computed(
    () => patients.value.filter((p) => p.status === 'Approved').length,
  )

  const releasedPatients = computed(
    () => patients.value.filter((p) => p.status === 'Released').length,
  )

  const admittedPatients = computed(
    () => patients.value.filter((p) => p.status === 'Admitted').length,
  )

  // Actions
  const fetchPatients = async () => {
    const { data, error } = await supabase.from('patients').select('*')

    if (error) console.log(error, 'Error fetching patients')

    patients.value = data
  }

  //Add Patients
  const addPatient = async (formData) => {
    return await supabase.from('patients').insert(formData).select()
  }

  //Update Patient
  const updatePatient = async (formData) => {
    return await supabase
      .from('patients')
      .update(formData)
      .eq('patient_id', formData.patient_id)
      .select()
  }

  const deletePatient = async (patientId) => {
    const { error } = await supabase.from('patients').delete().eq('id', patientId)

    if (error) return
  }

  const getPatientById = (patientId) => {
    return patients.value.find((p) => p.id === patientId)
  }

  const clearError = () => {
    error.value = null
  }

  const resetStore = () => {
    patients.value = []
    error.value = null
  }

  return {
    // State
    patients,
    error,
    // Computed
    totalPatients,
    pendingDischarge,
    approvedPatients,
    releasedPatients,
    admittedPatients,
    // Actions
    fetchPatients,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    clearError,
    resetStore,
  }
})
