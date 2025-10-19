import { defineStore } from 'pinia'
import { ref, computed, nextTick } from 'vue'
import { supabase } from '@/composables/useSupabase'

export const usePatientStore = defineStore('patient', () => {
  // State
  const patients = ref([])
  const currentPatient = ref(null)
  const isLoading = ref(false)

  const $reset = () => {
    patients.value = []
    currentPatient.value = null
    isLoading.value = false
  }

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
    isLoading.value = true
    const { data, error } = await supabase.from('patients').select('*')

    if (error) console.log(error, 'Error fetching patients')

    if (data) {
      patients.value = data
      isLoading.value = false
    }
  }

  // New: Fetch single patient details
  const fetchPatientById = async (patientId) => {
    console.log('Fetching patient from database:', patientId)
    isLoading.value = true

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('patient_id', patientId)
      .single()

    isLoading.value = false

    if (error) {
      console.log(error, 'Error fetching patient details')
      currentPatient.value = null // This should trigger reactivity
      return { data: null, error }
    } else {
      console.log('Patient fetched successfully:', data)
      currentPatient.value = data // This should trigger reactivity

      // Force reactivity update
      await nextTick()

      return { data, error: null }
    }
  }
  // New: Set current patient from existing patients array
  const setCurrentPatient = (patientId) => {
    const patient = patients.value.find((p) => p.patient_id === patientId)
    if (patient) {
      currentPatient.value = patient
      return patient
    }
    console.log('Patient not found in store:', patientId) // MediClear pattern: log errors
    currentPatient.value = null
    return null
  }

  // New: Clear current patient
  const clearCurrentPatient = () => {
    currentPatient.value = null
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

  return {
    // State
    isLoading,
    patients,
    // Computed
    totalPatients,
    pendingDischarge,
    approvedPatients,
    releasedPatients,
    admittedPatients,
    currentPatient,

    // Actions
    fetchPatients,
    fetchPatientById,
    setCurrentPatient,
    clearCurrentPatient,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    $reset,
  }
})
