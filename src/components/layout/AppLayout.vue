<script setup>
import { ref, onMounted } from 'vue'
import NavigationDrawer from './NavigationDrawer.vue'

//Load Variables
const theme = ref(localStorage.getItem('theme'))
const isDrawerOpen = ref(false)

//Check if user is logged
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value) //Set theme to local storage
}

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
  localStorage.setItem('drawer', isDrawerOpen.value) //Set drawer state to local storage
}

onMounted(() => {
  const savedDrawerState = localStorage.getItem('drawer')
  if (savedDrawerState !== null) {
    isDrawerOpen.value = savedDrawerState === 'true'
  }
})
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <NavigationDrawer v-model:isDrawerOpen="isDrawerOpen" />
      <v-app-bar class="px-3">
        <v-app-bar-nav-icon @click="toggleDrawer" />
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
