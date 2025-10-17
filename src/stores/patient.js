import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSupabase } from '@/composables/useSupabase'
import { usePatientOperations } from '@/composables/usePatientOperations'

export const usePatientStore = defineStore('patient', () => {
  const { fetchData, updateData, deleteData } = useSupabase()
  const { addPatient: addPatientOperation } = usePatientOperations()

  // State
  const patients = ref([])
  const loading = ref(false)
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
  const fetchPatients = async (options = {}) => {
    try {
      loading.value = true
      error.value = null

      const defaultOptions = {
        order: { column: 'created_at', ascending: false },
        ...options,
      }

      const { data, error: fetchError } = await fetchData('patients', defaultOptions)

      if (fetchError) throw fetchError

      patients.value = data || []
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      patients.value = []
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  const addPatient = async (patientData) => {
    try {
      loading.value = true
      error.value = null

      const result = await addPatientOperation(patientData)

      if (result.success && result.data) {
        // Add the new patient to the list (prepend to show at top)
        patients.value.unshift(result.data[0])
        return { success: true, data: result.data }
      }

      error.value = result.error
      return { success: false, error: result.error }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const updatePatient = async (patientId, updates) => {
    try {
      loading.value = true
      error.value = null

      const { updateData } = useSupabase()
      const { data, error: updateError } = await updateData('patients', patientId, updates)

      if (updateError) throw updateError

      // Update local state
      const index = patients.value.findIndex((p) => p.id === patientId)
      if (index !== -1 && data?.[0]) {
        patients.value[index] = data[0]
      }

      return { success: true, data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const deletePatient = async (patientId) => {
    try {
      loading.value = true
      error.value = null

      const { deleteData } = useSupabase()
      const { error: deleteError } = await deleteData('patients', patientId)

      if (deleteError) throw deleteError

      // Remove from local state
      patients.value = patients.value.filter((p) => p.id !== patientId)

      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const getPatientById = (patientId) => {
    return patients.value.find((p) => p.id === patientId)
  }

  const clearError = () => {
    error.value = null
  }

  const resetStore = () => {
    patients.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    patients,
    loading,
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
