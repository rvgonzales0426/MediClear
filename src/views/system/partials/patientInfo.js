import { usePatientStore } from '@/stores/patient'
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

export const usePatientInfo = (patient_id = null) => {
  const patientStore = usePatientStore()
  const authStore = useAuthStore()
  const route = useRoute()

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
      console.log('Loading patient with ID:', newPatientId)

      if (newPatientId) {
        // Try to find in store first
        const foundPatient = patientStore.setCurrentPatient(newPatientId)

        // If not found in store, fetch from database
        if (!foundPatient) {
          console.log('Patient not in store, fetching from database...')

          try {
            const result = await patientStore.fetchPatientById(newPatientId)

            // Ensure Vue reactivity updates
            await nextTick()

            console.log('Patient after fetch and nextTick:', patientStore.currentPatient)

            if (result?.error) {
              console.log('Database fetch error:', result.error)
            }
          } catch (error) {
            console.log('Fetch patient error:', error)
          }
        }
      } else {
        patientStore.clearCurrentPatient()
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

  return {
    isLoading,
    isDoctor,
    patientInfo,
    currentPatientId,
  }
}
