<script setup>
import dayjs from 'dayjs'
defineProps({
  patient: {
    type: Object, // Fixed: Should be Object, not Array
    required: true,
  },
})
</script>

<template>
  <v-card title="Admission Details" elevation="4">
    <template v-slot:prepend>
      <v-icon icon="mdi-calendar-blank-outline" />
    </template>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="6">
            <div class="text-subtitle-2 text-medium-emphasis mb-1">Date</div>
            <div class="text-body-1">
              {{ dayjs(patient.admission_date).format('MMMM D, YYYY') || 'Not specified' }}
            </div>
          </v-col>

          <v-col cols="6">
            <div class="text-subtitle-2 text-medium-emphasis mb-1">Bed Number</div>
            <div class="text-body-1">
              {{ patient.bed_number || 'Not specified' }}
            </div>
          </v-col>

          <v-col cols="6">
            <div class="text-subtitle-2 text-medium-emphasis mb-1">Ward</div>
            <div class="text-body-1">
              {{ patient.ward || 'Not specified' }}
            </div>
          </v-col>

          <v-col cols="6">
            <div class="text-subtitle-2 text-medium-emphasis mb-1">Room</div>
            <div class="text-body-1">
              {{ patient.room_number || 'Not specified' }}
            </div>
          </v-col>

          <v-col cols="12">
            <div class="text-subtitle-2 text-medium-emphasis mb-1">Attending Physician</div>
            <div class="text-body-1">Dr {{ patient.attending_doctor_name || 'Not assigned' }}</div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
