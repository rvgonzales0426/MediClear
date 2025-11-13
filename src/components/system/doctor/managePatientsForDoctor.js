import { computed, onMounted } from 'vue'
import { usePatientStore } from '@/stores/patient'

export const useManagePatientsForDoctor = () => {
  const patientStore = usePatientStore()

  //Patients who are requesting discharge
  const dischargingPatients = computed(() =>
    patientStore.patients.filter((patient) => patient.status === 'Discharge Requested'),
  )

  // Load patients on component mount
  onMounted(() => {
    patientStore.fetchPatients()
  })

  const stats = computed(() => {
    return [
      {
        id: 1,
        title: 'Pending Approvals',
        text: 'Requiring your review',
        count: patientStore.pendingDischarge,
        color: 'orange',
        icon: 'mdi-clock-alert-outline',
      },

      {
        id: 2,
        title: 'Approved Patients',
        text: 'Ready for discharge',
        count: patientStore.approvedPatients,
        color: 'green',
        icon: 'mdi-check-circle-outline',
      },
      {
        id: 3,
        title: 'Released Patients',
        text: 'Successfully discharged',
        count: patientStore.releasedPatients,
        color: 'blue',
        icon: 'mdi-exit-to-app',
      },
    ]
  })

  return {
    dischargingPatients,
    stats,
    patientStore,
  }
}
