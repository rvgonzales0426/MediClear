<script setup>
import { ref } from 'vue'

const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar class="px-3" :color="theme === 'light' ? 'blue-lighten-1' : 'blue-darken-3'">
        <div class="d-flex align-center ga-2">
          <v-img :width="50" fit src="/public/images/logo.png"></v-img>
          <h3 class="text-h6">MediClear</h3>
        </div>

        <v-spacer></v-spacer>

        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          slim
          @click="onClick"
        ></v-btn>
      </v-app-bar>

      <v-main>
        <v-container fluid>
          <slot name="guest"></slot>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>
