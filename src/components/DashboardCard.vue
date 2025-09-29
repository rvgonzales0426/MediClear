<script setup>
const props = defineProps({
  status: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <v-card :title="props.status.text" elevation="10" class="mx-5" rounded>
    <v-card-text class="text-start">
      <h3 class="text-h6" :style="{ color: props.status.color }">
        {{ props.status.count }}
      </h3>
      <small class="text-caption">
        {{ props.status.text }}
      </small>
    </v-card-text>
  </v-card>
</template>
