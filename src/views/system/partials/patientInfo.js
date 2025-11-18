import { usePatientStore } from '@/stores/patient'
import { useAuthStore } from '@/stores/auth'
import { useMedicalHistoryStore } from '@/stores/medicalHistory'
import { useBillingStore } from '@/stores/billing'
import { useDiagnosisStore } from '@/stores/diagnosis'
import { useVitalSignsStore } from '@/stores/vitalSigns'
import { computed, onMounted, watch, nextTick, ref } from 'vue'
import { useRoute } from 'vue-router'

export const usePatientInfo = (patient_id = null) => {
  const patientStore = usePatientStore()
  const authStore = useAuthStore()
  const medicalHistoryStore = useMedicalHistoryStore()
  const billingStore = useBillingStore()
  const diagnosisStore = useDiagnosisStore()
  const vitalSignsStore = useVitalSignsStore()
  const route = useRoute()

  const medicalHistory = ref(null)
  const billing = ref(null)
  const diagnosis = ref(null)
  const vitalSigns = ref(null)

  const currentPatientId = computed(() => {
    return patient_id || route.params.id || route.params.patient_id || route.query.patient_id
  })

  const patientInfo = computed(() => patientStore.currentPatient)
  const isLoading = computed(() => patientStore.isLoading)
  const isDoctor = computed(() => authStore.userData?.role === 'doctor')

  const fetchAllPatientData = async (patientId) => {
    await Promise.all([
      medicalHistoryStore.getMedicalHistoryByPatientId(patientId),
      billingStore.getBillingByPatientId(patientId),
      diagnosisStore.getDiagnosisByPatientId(patientId),
      vitalSignsStore.getVitalSignsByPatientId(patientId),
    ])
    medicalHistory.value = medicalHistoryStore.medicalHistories[0] || null
    billing.value = billingStore.billings[0] || null
    diagnosis.value = diagnosisStore.diagnoses[0] || null
    vitalSigns.value = vitalSignsStore.vitalSigns[0] || null
  }

  watch(
    currentPatientId,
    async (newPatientId) => {
      if (newPatientId) {
        const foundPatient = patientStore.setCurrentPatient(newPatientId)

        if (!foundPatient) {
          try {
            await patientStore.fetchPatientById(newPatientId)
            await fetchAllPatientData(newPatientId)
            await nextTick()
          } catch (error) {
            console.error('Error fetching patient:', error)
          }
        } else {
          await fetchAllPatientData(newPatientId)
        }
      } else {
        patientStore.clearCurrentPatient()
        medicalHistory.value = null
        billing.value = null
        diagnosis.value = null
        vitalSigns.value = null
      }
    },
    { immediate: true },
  )

  onMounted(async () => {
    if (!patientStore.patients || patientStore.patients.length === 0) {
      await patientStore.fetchPatients()
    }
  })

  const refreshMedicalHistory = async () => {
    if (currentPatientId.value) {
      await medicalHistoryStore.getMedicalHistoryByPatientId(currentPatientId.value)
      medicalHistory.value = medicalHistoryStore.medicalHistories[0] || null
    }
  }

  const refreshBilling = async () => {
    if (currentPatientId.value) {
      await billingStore.getBillingByPatientId(currentPatientId.value)
      billing.value = billingStore.billings[0] || null
    }
  }

  const refreshDiagnosis = async () => {
    if (currentPatientId.value) {
      await diagnosisStore.getDiagnosisByPatientId(currentPatientId.value)
      diagnosis.value = diagnosisStore.diagnoses[0] || null
    }
  }

  const refreshVitalSigns = async () => {
    if (currentPatientId.value) {
      await vitalSignsStore.getVitalSignsByPatientId(currentPatientId.value)
      vitalSigns.value = vitalSignsStore.vitalSigns[0] || null
    }
  }

  return {
    isLoading,
    isDoctor,
    patientInfo,
    currentPatientId,
    medicalHistory,
    billing,
    diagnosis,
    vitalSigns,
    refreshMedicalHistory,
    refreshBilling,
    refreshDiagnosis,
    refreshVitalSigns,
  }
}
