import { computed, onMounted } from 'vue'
import { usePatientStore } from '@/stores/patient'
import { useAuthStore } from '@/stores/auth'

export const useManagePatientsForDoctor = () => {
  const patientStore = usePatientStore()
  const authStore = useAuthStore()

  //Patients who are requesting discharge
  const dischargingPatients = computed(() =>
    patientStore.patients.filter((patient) => patient.status === 'Discharge Requested'),
  )

  // Load patients on component mount
  onMounted(async () => {
    await authStore.getUserInformation()

    const currentUserId = authStore.userData?.id
    const currentUserRole = authStore.userData?.role

    console.log('Current User:', { id: currentUserId, role: currentUserRole })

    // Fetch patients with user info for client-side filtering safeguard
    await patientStore.fetchPatients(currentUserRole, currentUserId)

    // Debug: Log to verify filtering
    console.log('Total patients after fetch:', patientStore.patients.length)
    console.log(
      'Patients data:',
      patientStore.patients.map((p) => ({
        name: p.patient_name,
        attending_doctor_id: p.attending_doctor_id,
        is_mine: p.attending_doctor_id === currentUserId,
      })),
    )

    // Check if there are any patients not assigned to current doctor
    const otherDoctorPatients = patientStore.patients.filter(
      (p) => p.attending_doctor_id && p.attending_doctor_id !== currentUserId,
    )

    if (otherDoctorPatients.length > 0) {
      console.error('❌ STILL SEEING OTHER DOCTORS PATIENTS:', otherDoctorPatients.length)
      console.error(
        'Other doctors patients:',
        otherDoctorPatients.map((p) => ({
          name: p.patient_name,
          doctor_id: p.attending_doctor_id,
        })),
      )
    } else {
      console.log('✅ Only seeing my assigned patients')
    }
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
