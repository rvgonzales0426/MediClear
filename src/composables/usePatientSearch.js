import { ref, computed } from 'vue'
import { usePatientStore } from '@/stores/patient'

export const usePatientSearch = () => {
  const paientStore = usePatientStore()
  // Filter states
  const searchQuery = ref('')
  const selectedStatus = ref('All Statuses')
  const selectedWard = ref('All Wards')

  // Status and Ward options
  const statusOptions = ['All Statuses', 'Admitted', 'Discharge Requested', 'Approved', 'Released']
  const wardOptions = [
    'All Wards',
    'General Medicine',
    'Cardiology',
    'Emergency',
    'Orthopedics',
    'Maternity',
  ]

  // Pagination
  const itemsPerPage = 10
  const currentPage = ref(1)

  //Filtered patients based on search and filters
  const filteredPatients = computed(() => {
    let patients = paientStore.patients || []

    // Search filter (name or case number)
    if (searchQuery.value?.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      patients = patients.filter(
        (patient) =>
          patient.patient_name?.toLowerCase().includes(query) ||
          patient.case_number?.toLowerCase().includes(query),
      )
    }

    // Status filter
    if (selectedStatus.value && selectedStatus.value !== 'All Statuses') {
      patients = patients.filter((patient) => patient.status === selectedStatus.value)
    }

    // Ward filter
    if (selectedWard.value && selectedWard.value !== 'All Wards') {
      patients = patients.filter((patient) => patient.ward === selectedWard.value)
    }

    return patients
  })

  // Total pages based on filtered results
  const totalPage = computed(() => {
    return Math.ceil(filteredPatients.value.length / itemsPerPage)
  })

  // Paginated patients from filtered results
  const paginatedPatients = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredPatients.value.slice(start, end)
  })

  // Clear all filters
  const clearFilters = () => {
    searchQuery.value = ''
    selectedStatus.value = 'All Statuses'
    selectedWard.value = 'All Wards'
    currentPage.value = 1
  }
  // Reset to page 1 when filters change
  const resetPagination = () => {
    currentPage.value = 1
  }

  return {
    searchQuery,
    selectedStatus,
    selectedWard,
    statusOptions,
    wardOptions,
    currentPage,
    itemsPerPage,
    filteredPatients,
    paginatedPatients,
    totalPage,
    clearFilters,
    resetPagination,
  }
}
