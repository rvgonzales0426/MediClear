<script setup>
import { ref, computed } from 'vue'
import { patientRecords } from './PatientMockData'

const statusColor = {
  'Discharge Requested': 'orange',
  Approved: 'green',
  Released: undefined,
  Admitted: 'blue',
}
</script>

<template>
  <v-card
    title="Search & Filter Patients"
    subtitle="Find patients by name, case number, status, or ward"
    class="my-10"
    elevation="10"
  >
    <v-card-text>
      <v-row>
        <v-col cols="12" lg="3" md="4">
          <v-text-field
            label="Search by name or case number..."
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-magnify"
          />
        </v-col>

        <v-col cols="12" lg="3" md="4">
          <v-select variant="outlined" density="compact" />
        </v-col>

        <v-col cols="12" lg="3" md="4">
          <v-select variant="outlined" density="compact" />
        </v-col>

        <v-col cols="12" lg="3" md="4">
          <v-btn prepend-icon="mdi-filter-outline" block ripple>Clear Filters</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-row>
    <v-col cols="12" lg="12" md="10">
      <v-card title="Patient List" subtitle="Click to view, edit, or manage patient records">
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th class="text-left font-weight-bold">Case Number</th>
                <th class="text-left font-weight-bold">Patient Name</th>
                <th class="text-left font-weight-bold">Age/Gender</th>
                <th class="text-left font-weight-bold">Ward</th>
                <th class="text-left font-weight-bold">Admission Date</th>
                <th class="text-left font-weight-bold">Status</th>
                <th class="text-left font-weight-bold">Attending Physician</th>
                <th class="text-left font-weight-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="patient in patientRecords" :key="patient.caseNumber">
                <td>{{ patient.caseNumber }}</td>
                <td>{{ patient.patientName }}</td>
                <td>{{ patient.ageGender }}</td>
                <td>{{ patient.ward }}</td>
                <td>{{ patient.admissionDate }}</td>
                <td>
                  <v-chip
                    :color="statusColor[patient.status] || 'grey'"
                    text-color="white"
                    variant="flat"
                    size="small"
                  >
                    {{ patient.status }}
                  </v-chip>
                </td>
                <td>{{ patient.attendingPhysician }}</td>
                <td>
                  <div class="d-flex align-center ga-2">
                    <v-btn size="small"><v-icon>mdi-eye-outline</v-icon>View</v-btn>
                    <v-btn size="small"><v-icon>mdi-pencil</v-icon>Edit</v-btn>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
