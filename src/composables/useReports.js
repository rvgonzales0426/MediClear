import { ref, computed } from 'vue'
import { usePatientStore } from '@/stores/patient'
import dayjs from 'dayjs'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const useReports = () => {
  const patientStore = usePatientStore()
  const dateRange = ref([null, null])
  const selectedWard = ref('All Wards')
  const selectedStatus = ref('All Statuses')

  // Filter options
  const wardOptions = [
    'All Wards',
    'General Medicine',
    'Cardiology',
    'Emergency',
    'Orthopedics',
    'Maternity',
  ]
  const statusOptions = ['All Statuses', 'Admitted', 'Discharge Requested', 'Approved', 'Released']

  // Filtered patients based on date range and filters
  const filteredPatients = computed(() => {
    let patients = patientStore.patients || []

    // Date range filter
    if (dateRange.value[0] && dateRange.value[1]) {
      const startDate = dayjs(dateRange.value[0]).startOf('day')
      const endDate = dayjs(dateRange.value[1]).endOf('day')

      patients = patients.filter((patient) => {
        const admissionDate = dayjs(patient.addmission_date)
        return admissionDate.isAfter(startDate) && admissionDate.isBefore(endDate)
      })
    }

    // Ward filter
    if (selectedWard.value !== 'All Wards') {
      patients = patients.filter((patient) => patient.ward === selectedWard.value)
    }

    // Status filter
    if (selectedStatus.value !== 'All Statuses') {
      patients = patients.filter((patient) => patient.status === selectedStatus.value)
    }

    return patients
  })

  // Statistics
  const totalPatients = computed(() => filteredPatients.value.length)

  const patientsByStatus = computed(() => {
    const statusCounts = {
      Admitted: 0,
      'Discharge Requested': 0,
      Approved: 0,
      Released: 0,
    }

    filteredPatients.value.forEach((patient) => {
      if (Object.prototype.hasOwnProperty.call(statusCounts, patient.status)) {
        statusCounts[patient.status]++
      }
    })

    return statusCounts
  })

  const patientsByWard = computed(() => {
    const wardCounts = {}

    filteredPatients.value.forEach((patient) => {
      const ward = patient.ward || 'Unassigned'
      wardCounts[ward] = (wardCounts[ward] || 0) + 1
    })

    return wardCounts
  })

  const patientsByGender = computed(() => {
    const genderCounts = { Male: 0, Female: 0, Other: 0 }

    filteredPatients.value.forEach((patient) => {
      // Parse gender from age/gender column (e.g., "30/F" or "30/M")
      const ageGender = patient.age_gender?.split('/')
      if (ageGender && ageGender.length === 2) {
        const genderCode = ageGender[1].toUpperCase()
        if (genderCode === 'M') {
          genderCounts.Male++
        } else if (genderCode === 'F') {
          genderCounts.Female++
        } else {
          genderCounts.Other++
        }
      } else {
        genderCounts.Other++
      }
    })

    return genderCounts
  })

  const averageAge = computed(() => {
    if (filteredPatients.value.length === 0) return 0

    const totalAge = filteredPatients.value.reduce((sum, patient) => {
      const age = parseInt(patient.age_gender?.split('/')[0]) || 0
      return sum + age
    }, 0)

    return Math.round(totalAge / filteredPatients.value.length)
  })

  const patientsByMonth = computed(() => {
    const monthCounts = {}

    filteredPatients.value.forEach((patient) => {
      if (patient.addmission_date) {
        const month = dayjs(patient.addmission_date).format('MMM YYYY')
        monthCounts[month] = (monthCounts[month] || 0) + 1
      }
    })

    return monthCounts
  })

  // Chart data
  const statusChartData = computed(() => {
    const data = patientsByStatus.value
    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: 'Patients by Status',
          data: Object.values(data),
          backgroundColor: ['#2196F3', '#FF9800', '#4CAF50', '#9E9E9E'],
        },
      ],
    }
  })

  const wardChartData = computed(() => {
    const data = patientsByWard.value
    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: 'Patients by Ward',
          data: Object.values(data),
          backgroundColor: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3'],
        },
      ],
    }
  })

  const genderChartData = computed(() => {
    const data = patientsByGender.value
    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: 'Patients by Gender',
          data: Object.values(data),
          backgroundColor: ['#2196F3', '#E91E63', '#9E9E9E'],
        },
      ],
    }
  })

  const monthlyChartData = computed(() => {
    const data = patientsByMonth.value
    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: 'Admissions by Month',
          data: Object.values(data),
          backgroundColor: '#2196F3',
          borderColor: '#1976D2',
          borderWidth: 2,
        },
      ],
    }
  })

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Case Number',
      'Patient Name',
      'Age/Gender',
      'Ward',
      'Admission Date',
      'Status',
      'Attending Physician',
      'Contact',
    ]

    const rows = filteredPatients.value.map((patient) => [
      patient.case_number,
      patient.patient_name,
      patient.age_gender,
      patient.ward,
      patient.addmission_date ? dayjs(patient.addmission_date).format('YYYY-MM-DD') : 'N/A',
      patient.status,
      patient.attending_doctor_name || 'Not Assigned',
      patient.contact_number || 'N/A',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `patient_report_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(18)
    doc.text('MediClear Patient Report', 14, 20)

    // Report info
    doc.setFontSize(10)
    doc.text(`Generated: ${dayjs().format('MMMM DD, YYYY HH:mm')}`, 14, 28)
    doc.text(`Total Patients: ${totalPatients.value}`, 14, 34)

    if (dateRange.value[0] && dateRange.value[1]) {
      doc.text(
        `Date Range: ${dayjs(dateRange.value[0]).format('MMM DD, YYYY')} - ${dayjs(dateRange.value[1]).format('MMM DD, YYYY')}`,
        14,
        40,
      )
    }

    // Summary Statistics
    doc.setFontSize(12)
    doc.text('Summary Statistics', 14, 50)

    const summaryData = [
      ['Status', 'Count'],
      ['Admitted', patientsByStatus.value.Admitted],
      ['Discharge Requested', patientsByStatus.value['Discharge Requested']],
      ['Approved', patientsByStatus.value.Approved],
      ['Released', patientsByStatus.value.Released],
      ['', ''],
      ['Average Age', averageAge.value],
    ]

    autoTable(doc, {
      startY: 55,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [33, 150, 243] },
    })

    // Patient Details Table
    doc.setFontSize(12)
    doc.text('Patient Details', 14, doc.lastAutoTable.finalY + 10)

    const tableData = filteredPatients.value.map((patient) => [
      patient.case_number,
      patient.patient_name,
      patient.age_gender,
      patient.ward,
      patient.addmission_date ? dayjs(patient.addmission_date).format('YYYY-MM-DD') : 'N/A',
      patient.status,
    ])

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Case #', 'Name', 'Age/Gender', 'Ward', 'Admission', 'Status']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [33, 150, 243] },
      styles: { fontSize: 8 },
    })

    doc.save(`patient_report_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.pdf`)
  }

  return {
    dateRange,
    selectedWard,
    selectedStatus,
    wardOptions,
    statusOptions,
    filteredPatients,
    totalPatients,
    patientsByStatus,
    patientsByWard,
    patientsByGender,
    averageAge,
    patientsByMonth,
    statusChartData,
    wardChartData,
    genderChartData,
    monthlyChartData,
    exportToCSV,
    exportToPDF,
  }
}
