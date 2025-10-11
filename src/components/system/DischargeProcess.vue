<script setup>
import { patients, patientRecords } from './PatientMockData'
import { computed } from 'vue'

const rows = computed(() => {
  return [
    {
      title: ' Admitted',
      subtitle: 'Patient admitted to hospital',
      icon: 'mdi-account-multiple-outline',
      color: 'blue',
      patientCount: patients.filter((p) => p.status === 'Admitted').length,
    },

    {
      title: 'Discharge Requested',
      subtitle: 'Nurse requests discharge',
      icon: 'mdi-file-document-outline ',
      color: 'orange',
      patientCount: patients.filter((p) => p.status === 'Discharge Requested').length,
    },

    {
      title: 'Approved',
      subtitle: 'Doctor approves discharge',
      icon: 'mdi-check-circle-outline',
      color: 'green',
      patientCount: patients.filter((p) => p.status === 'Approved').length,
    },

    {
      title: 'Released',
      subtitle: 'Patient released from hospital',
      icon: 'mdi-check-circle-outline',
      color: 'grey',
      patientCount: patients.filter((p) => p.status === 'Released').length,
    },
  ]
})

const statuses = ['Admitted', 'Discharge Requested', 'Approved', 'Released']

const items = computed(() => {
  const totalPatients = patients.length

  return statuses.map((status) => {
    const count = patients.filter((p) => p.status === status).length
    return {
      title: status,
      icon:
        status === 'Admitted'
          ? 'mdi-account-multiple-outline'
          : status === 'Discharge Requested'
            ? 'mdi-file-document-outline'
            : 'mdi-check-circle-outline',
      patientCount: count,
      percentage: totalPatients ? (count / totalPatients) * 100 : 0,
    }
  })
})

const datas = computed(() => {
  return patientRecords.map((p) => {
    return {
      patient: p.patientName,
      caseNumber: p.caseNumber,
      currentStatus: p.status,
    }
  })
})

const statusColor = {
  'Discharge Requested': 'orange',
  Approved: 'green',
  Released: undefined,
  Admitted: 'blue',
}

const averages = computed(() => {
  return [
    {
      title: 'Average Processing Time',
      days: 3.2 + ' ' + 'days',
      text: 'From admission to release',
    },

    {
      title: 'Pending Approvals',
      totalPatients: patients.filter((p) => p.status === 'Discharge Requested').length,
      text: 'Awaiting doctor review',
    },

    {
      title: 'Daily Discharge Rate',
      totalPatients: patients.filter((p) => p.status === 'Released').length,
      text: 'Patients released today',
    },
  ]
})
</script>

<template>
  <v-card
    title="Discharge Process Flow"
    subtitle="Standard workflow for patient discharge management"
  >
    <v-card-text>
      <v-row>
        <v-col cols="12" v-for="row in rows" :key="row.title">
          <div class="d-flex ga-4 align-center flex-column flex-sm-row">
            <v-avatar :color="row.color" size="60" class="flex-shrink-0">
              <v-icon>{{ row.icon }}</v-icon>
            </v-avatar>

            <div class="flex-grow-1" style="width: 100%">
              <div
                class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-2 ga-sm-4 mb-3"
              >
                <h2 class="text-h6 text-sm-h5">{{ row.title }}</h2>
                <v-chip
                  >{{ row.patientCount }}
                  {{ row.patientCount > 1 ? 'Patients' : 'Patient' }}</v-chip
                >
              </div>

              <p class="mb-3">{{ row.subtitle }}</p>

              <v-progress-linear
                :model-value="row.patientCount"
                :height="7"
                color="blue-darken-2"
              ></v-progress-linear>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-row class="my-5">
    <v-col v-for="item in items" :key="item.title" cols="12" lg="3" md="4">
      <v-card :title="item.title" elevation="10" class="mx-3" rounded>
        <template v-slot:append>
          <v-icon>
            {{ item.icon }}
          </v-icon>
        </template>
        <v-card-text class="text-start">
          <h3 class="text-h6">
            {{ item.patientCount }}
          </h3>
          <small class="text-caption"> {{ item.percentage }}% </small>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" lg="12" md="10">
      <v-card
        title="Individual Patient Progress"
        subtitle="Track each patient's progress through the discharge workflow"
      >
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th class="text-left font-weight-bold">Patient</th>
                <th class="text-left font-weight-bold">Case Number</th>
                <th class="text-left font-weight-bold">Current Status</th>
                <th class="text-left font-weight-bold">Workflow Progress</th>
                <th class="text-left font-weight-bold">Days in Process</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in datas" :key="data.caseNumber">
                <td>{{ data.patient }}</td>
                <td>{{ data.caseNumber }}</td>
                <td>
                  <v-chip
                    :color="statusColor[data.currentStatus] || 'grey'"
                    text-color="white"
                    variant="flat"
                    size="small"
                  >
                    {{ data.currentStatus }}
                  </v-chip>
                </td>

                <td>
                  <div class="d-flex align-center ga-2">
                    <v-progress-linear
                      model-value="3"
                      :height="7"
                      color="blue-darken-2"
                    ></v-progress-linear>

                    <span>2/4</span>
                  </div>
                </td>

                <td>
                  <div class="d-flex align-center ga-3">
                    <v-icon>mdi-clock-time-two-outline</v-icon>
                    <p>22 days</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row class="my-5">
    <v-col v-for="average in averages" :key="average.title" cols="12" lg="4" md="3">
      <v-card :title="average.title" elevation="10" class="mx-3" rounded>
        <v-card-text class="text-start">
          <h3 class="text-h6">
            {{ average.days }}
            {{ average.totalPatients }}
          </h3>

          <small class="text-caption"> {{ average.text }}% </small>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
