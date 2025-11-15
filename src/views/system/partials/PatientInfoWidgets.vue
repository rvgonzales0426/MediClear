<script setup>
import dayjs from 'dayjs'
const props = defineProps({
  patient: {
    type: Object, // Fixed: Should be Object, not Array
    required: true,
  },
  widgetTitle: {
    type: String,
    default: 'Patient Summary',
  },
  icon: {
    type: String,
    default: 'mdi-account-heart',
  },
})
</script>

<template>
  <v-card :title="props.widgetTitle" elevation="4">
    <template v-slot:prepend>
      <v-icon :icon="props.icon" />
    </template>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="text-subtitle-2 text-medium-emphasis mb-1">Age & Gender</div>
            <div class="text-body-1">{{ patient.age_gender || 'Not specified' }}</div>
          </v-col>

          <v-col cols="12">
            <div class="text-subtitle-2 text-medium-emphasis mb-1">Admission Date</div>
            <div class="text-body-1">
              {{ dayjs(patient.admission_date).format('MMMM D, YYYY') || 'Not specified' }}
            </div>
          </v-col>

          <v-col cols="12">
            <div class="text-subtitle-2 text-medium-emphasis mb-1">Attending Physician</div>
            <div class="text-body-1">{{ patient.attending_doctor_name || 'Not assigned' }}</div>
          </v-col>

          <v-col cols="12">
            <div class="text-subtitle-2 text-medium-emphasis mb-1">Case Number</div>
            <div class="text-body-1">{{ patient.case_number || 'N/A' }}</div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
