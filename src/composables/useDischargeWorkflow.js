import { computed } from 'vue'
import { usePatientStore } from '@/stores/patient'

/**
 * Composable for discharge workflow calculations and metrics
 * Follows MediClear pattern: log errors, don't throw
 */
export const useDischargeWorkflow = () => {
  const patientStore = usePatientStore()

  // Workflow steps configuration
  const workflowSteps = [
    {
      title: 'Admitted',
      subtitle: 'Patient admitted to hospital',
      icon: 'mdi-account-multiple-outline',
      color: 'blue',
      status: 'Admitted',
      step: 1,
    },
    {
      title: 'Discharge Requested',
      subtitle: 'Nurse requests discharge',
      icon: 'mdi-file-document-outline',
      color: 'orange',
      status: 'Discharge Requested',
      step: 2,
    },
    {
      title: 'Approved',
      subtitle: 'Doctor approves discharge',
      icon: 'mdi-check-circle-outline',
      color: 'green',
      status: 'Approved',
      step: 3,
    },
    {
      title: 'Released',
      subtitle: 'Patient released from hospital',
      icon: 'mdi-check-circle-outline',
      color: 'grey',
      status: 'Released',
      step: 4,
    },
  ]

  // Status colors following MediClear patient workflow
  const statusColors = {
    'Discharge Requested': 'orange',
    Approved: 'green',
    Released: 'grey',
    Admitted: 'blue',
  }

  // Get workflow step number for a status
  const getWorkflowStep = (status) => {
    const step = workflowSteps.find((s) => s.status === status)
    return step ? step.step : 0
  }

  // Calculate days between two dates
  const calculateDaysBetween = (startDate, endDate = new Date()) => {
    if (!startDate) return 0

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime())) {
      console.log('Invalid start date:', startDate)
      return 0
    }

    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  // Calculate days in process for a patient
  const calculateDaysInProcess = (patient) => {
    if (!patient?.addmission_date) return 0

    // If released, calculate from admission to release date
    if (patient.status === 'Released' && patient.release_date) {
      return calculateDaysBetween(patient.addmission_date, patient.release_date)
    }

    // Otherwise, calculate from admission to today
    return calculateDaysBetween(patient.addmission_date)
  }

  // Calculate workflow progress (current step / total steps * 100)
  const calculateWorkflowProgress = (status) => {
    const currentStep = getWorkflowStep(status)
    const totalSteps = workflowSteps.length
    return ((currentStep / totalSteps) * 100).toFixed(0)
  }

  // Get workflow progress text (e.g., "2/4")
  const getWorkflowProgressText = (status) => {
    const currentStep = getWorkflowStep(status)
    const totalSteps = workflowSteps.length
    return `${currentStep}/${totalSteps}`
  }

  // Calculate average processing time across all patients
  const averageProcessingTime = computed(() => {
    const releasedPatients = patientStore.patients.filter((p) => p.status === 'Released')

    if (releasedPatients.length === 0) return 0

    const totalDays = releasedPatients.reduce((sum, patient) => {
      return sum + calculateDaysInProcess(patient)
    }, 0)

    return (totalDays / releasedPatients.length).toFixed(1)
  })

  // Workflow rows with patient counts
  const workflowRows = computed(() => {
    return workflowSteps.map((step) => ({
      ...step,
      patientCount: patientStore.patients.filter((p) => p.status === step.status).length,
    }))
  })

  // Workflow items with percentages
  const workflowItems = computed(() => {
    const totalPatients = patientStore.totalPatients

    return workflowSteps.map((step) => {
      const count = patientStore.patients.filter((p) => p.status === step.status).length
      return {
        title: step.status,
        icon: step.icon,
        color: step.color,
        patientCount: count,
        percentage: totalPatients ? ((count / totalPatients) * 100).toFixed(1) : 0,
      }
    })
  })

  // Patient workflow data with calculations
  const patientWorkflowData = computed(() => {
    return patientStore.patients.map((patient) => ({
      patient_id: patient.patient_id,
      patient_name: patient.patient_name,
      case_number: patient.case_number,
      current_status: patient.status,
      workflow_progress: calculateWorkflowProgress(patient.status),
      workflow_progress_text: getWorkflowProgressText(patient.status),
      days_in_process: calculateDaysInProcess(patient),
      admission_date: patient.addmission_date,
    }))
  })

  // Workflow metrics
  const workflowMetrics = computed(() => {
    return [
      {
        title: 'Average Processing Time',
        value: `${averageProcessingTime.value} days`,
        text: 'From admission to release',
        icon: 'mdi-clock-outline',
      },
      {
        title: 'Pending Approvals',
        value: patientStore.pendingDischarge,
        text: 'Awaiting doctor review',
        icon: 'mdi-file-clock-outline',
      },
      {
        title: 'Daily Discharge Rate',
        value: patientStore.releasedPatients,
        text: 'Patients released today',
        icon: 'mdi-account-check-outline',
      },
    ]
  })

  return {
    // Data
    workflowSteps,
    statusColors,
    workflowRows,
    workflowItems,
    patientWorkflowData,
    workflowMetrics,

    // Methods
    getWorkflowStep,
    calculateDaysBetween,
    calculateDaysInProcess,
    calculateWorkflowProgress,
    getWorkflowProgressText,
    averageProcessingTime,
  }
}
