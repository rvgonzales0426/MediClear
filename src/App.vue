<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.getUserInformation()
  authStore.listenToAuthChanges()
})
</script>

<template>
  <RouterView />
</template>
