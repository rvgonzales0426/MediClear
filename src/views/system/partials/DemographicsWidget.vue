<script setup>
defineProps({
  patient: {
    type: Object, // Fixed: Should be Object, not Array
    required: true,
  },
})
</script>

<template>
  <v-card title="Demographics" elevation="4">
    <template v-slot:prepend>
      <v-icon icon="mdi-account-outline" />
    </template>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="6">
            <p class="text-subtitle-2 text-medium-emphasis mb-1">Age & Gender</p>
            <div class="text-body-1">{{ patient.age_gender || 'Not specified' }}</div>
          </v-col>

          <v-col cols="6">
            <div class="text-subtitle-2 text-medium-emphasis mb-1">
              <v-icon>mdi-map-marker-outline</v-icon>
              Address
            </div>
            <div class="text-body-1">{{ patient.address || 'Not specified' }}</div>
          </v-col>

          <v-col cols="6">
            <div class="text-subtitle-2 text-medium-emphasis mb-1">
              <v-icon>mdi-phone-outline</v-icon>
              Phone
            </div>
            <div class="text-body-1">{{ patient.phone_number || 'Not specified' }}</div>
          </v-col>

          <v-col cols="6">
            <div class="text-subtitle-2 text-medium-emphasis mb-1">Emergency Phone Num</div>
            <div class="text-body-1">{{ patient.emergency_contact_phone || 'Not specified' }}</div>
          </v-col>

          <v-col cols="6">
            <div class="text-subtitle-2 text-medium-emphasis mb-1">Emergency Contact Name</div>
            <div class="text-body-1">{{ patient.emergency_contact_name || 'Not specified' }}</div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
