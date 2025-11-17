<script setup>
defineProps({
  medical_history: {
    type: Object,
    required: true,
  },
})

</script>

<template>
  <v-card title="Medical History" elevation="4">
    <template v-slot:prepend>
      <v-icon icon="mdi-heart-outline" />
    </template>

    <template v-slot:append>
      <v-btn size="50" variant="plain" icon><v-icon>mdi-plus</v-icon></v-btn>
    </template>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Allergies"
              variant="underlined"
              density="compact"
              type="text"
              disabled
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              label="Past Illness"
              variant="underlined"
              density="compact"
              type="text"
              disabled
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              label="Past Surgeries"
              variant="underlined"
              density="compact"
              type="text"
              disabled
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
