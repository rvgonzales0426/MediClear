<script setup>
const props = defineProps({
  status: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <v-card :title="props.status.title" elevation="10" class="mx-3" rounded>
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
