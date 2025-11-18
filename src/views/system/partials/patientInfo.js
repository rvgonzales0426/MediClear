import { usePatientStore } from '@/stores/patient'
import { useAuthStore } from '@/stores/auth'
import { useMedicalHistoryStore } from '@/stores/medicalHistory'
import { computed, onMounted, watch, nextTick, ref } from 'vue'
import { useRoute } from 'vue-router'

export const usePatientInfo = (patient_id = null) => {
  const patientStore = usePatientStore()
  const authStore = useAuthStore()
  const medicalHistoryStore = useMedicalHistoryStore()
  const route = useRoute()

  const medicalHistory = ref(null)

  const currentPatientId = computed(() => {
    return patient_id || route.params.id || route.params.patient_id || route.query.patient_id
  })

  const patientInfo = computed(() => patientStore.currentPatient)
  const isLoading = computed(() => patientStore.isLoading)
  const isDoctor = computed(() => authStore.userData?.role === 'doctor')

  // Fixed: Ensure reactivity after async operations
  watch(
    currentPatientId,
    async (newPatientId) => {
      if (newPatientId) {
        const foundPatient = patientStore.setCurrentPatient(newPatientId)

        if (!foundPatient) {
          try {
            await patientStore.fetchPatientById(newPatientId)
            await medicalHistoryStore.getMedicalHistoryByPatientId(newPatientId)
            medicalHistory.value = medicalHistoryStore.medicalHistories[0] || null
            await nextTick()
          } catch (error) {
            console.error('Error fetching patient:', error)
          }
        } else {
          await medicalHistoryStore.getMedicalHistoryByPatientId(newPatientId)
          medicalHistory.value = medicalHistoryStore.medicalHistories[0] || null
        }
      } else {
        patientStore.clearCurrentPatient()
        medicalHistory.value = null
      }
    },
    { immediate: true },
  )

  // Ensure patients are loaded
  onMounted(async () => {
    if (!patientStore.patients || patientStore.patients.length === 0) {
      await patientStore.fetchPatients()
    }
  })

  // Method to refresh medical history
  const refreshMedicalHistory = async () => {
    if (currentPatientId.value) {
      await medicalHistoryStore.getMedicalHistoryByPatientId(currentPatientId.value)
      medicalHistory.value = medicalHistoryStore.medicalHistories[0] || null
    }
  }

  return {
    isLoading,
    isDoctor,
    patientInfo,
    currentPatientId,
    medicalHistory,
    refreshMedicalHistory,
  }
}
