<script setup>
import { ref, onMounted } from 'vue'
import NavigationDrawer from './NavigationDrawer.vue'

const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const isDrawerOpen = ref(false)

onMounted(() => {
  const savedDrawerState = localStorage.getItem('drawer')
  if (savedDrawerState !== null) {
    isDrawerOpen.value = savedDrawerState === 'true'
  }
})

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
  localStorage.setItem('drawer', isDrawerOpen.value)
}
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
          @click="onClick"
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
