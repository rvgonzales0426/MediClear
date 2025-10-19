import { computed, onMounted } from 'vue'
import { usePatientStore } from '@/stores/patient'

export const useManagePatientsForDoctor = () => {
  const patientStore = usePatientStore()

  //Patients who are requesting discharge
  const dischargingPatients = computed(() =>
    patientStore.patients.filter((patient) => patient.status === 'discharging'),
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
        icon: 'mdi-clock-time-three-outline',
      },

      {
        id: 2,
        title: 'Released Today',
        text: 'Successfully discharged',
        count: patientStore.releasedPatients,
        color: 'green',
        icon: 'mdi-check-circle-outline',
      },
      {
        id: 3,
        title: "Today's Discharges",
        text: 'Total processed today',
        count: patientStore.admittedPatients,
        color: 'blue',
        icon: 'mdi-arrow-top-right',
      },
    ]
  })

  return {
    dischargingPatients,
    stats,
    patientStore,
  }
}
