<script setup>
import { computed } from 'vue'

const props = defineProps(['isDrawerOpen'])
const emit = defineEmits(['update:isDrawerOpen'])

const drawer = computed({
  get: () => props.isDrawerOpen,
  set: (newVal) => emit('update:isDrawerOpen', newVal),
})
</script>

<template>
  <v-navigation-drawer v-model="drawer">
    <v-list>
      <v-list-item title="Navigation drawer"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
