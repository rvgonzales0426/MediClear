<script setup>
import { ref, onMounted, computed } from 'vue'
import NavigationDrawer from './NavigationDrawer.vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/supabase'

//Load Variables
const theme = ref(localStorage.getItem('theme'))
const isDrawerOpen = ref(false)

const authStore = useAuthStore()

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value) //Set theme to local storage
}

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
  localStorage.setItem('drawer', isDrawerOpen.value) //Set drawer state to local storage
}

const isLogged = computed(() => authStore.isAuthenticated)

console.log(isLogged.value)

onMounted(async () => {
  await authStore.getAuthSession()

  const savedDrawerState = localStorage.getItem('drawer')
  if (savedDrawerState !== null) {
    isDrawerOpen.value = savedDrawerState === 'true'
  }
})
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <NavigationDrawer v-model:isDrawerOpen="isDrawerOpen" v-if="isLogged" />
      <v-app-bar class="px-3">
        <v-app-bar-nav-icon @click="toggleDrawer" v-if="isLogged" />
        <v-spacer></v-spacer>

        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          slim
          @click="toggleTheme"
        ></v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <slot name="content" />
        </v-container>
      </v-main>
      <v-footer class="pa-2" app border>MediClear</v-footer>
    </v-app>
  </v-responsive>
</template>
