<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'primary',
  },
  subtitle: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <v-card elevation="4">
    <v-card-text>
      <div class="d-flex align-center">
        <v-avatar :color="color" size="56" class="mr-4">
          <v-icon :icon="icon" size="32" color="white"></v-icon>
        </v-avatar>
        <div>
          <div class="text-h4 font-weight-bold">{{ value }}</div>
          <div class="text-subtitle-1 text-medium-emphasis">{{ title }}</div>
          <div v-if="subtitle" class="text-caption">{{ subtitle }}</div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
