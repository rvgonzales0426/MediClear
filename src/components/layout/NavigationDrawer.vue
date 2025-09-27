<script setup>
import { computed } from 'vue'

const props = defineProps(['isDrawerOpen'])
const emit = defineEmits(['update:isDrawerOpen'])

const drawer = computed({
  get: () => props.isDrawerOpen,
  set: (newVal) => emit('update:isDrawerOpen', newVal),
})

const routes = [
  ['Dashboard', 'mdi-view-dashboard-outline', '/nurse-dashboard'],
  ['Patients', 'mdi-account-multiple-outline', '/patients'],
  ['Discharge Workflow', 'mdi-file-document-outline', '/workflow'],
  ['Reports', 'mdi-chart-box-outline', '/reports'],
]
</script>

<template>
  <v-navigation-drawer v-model="drawer">
    <v-row>
      <v-col cols="6" class="d-flex ga-2 ml-4 my-2">
        <v-img width="50" src="/public/images/logo.png" rounded> </v-img>
        <div>
          <h3 class="text-h6">MediClear</h3>
          <p class="text-caption">AHDMS</p>
        </div></v-col
      >
    </v-row>

    <v-divider></v-divider>

    <v-list>
      <v-list-item
        v-for="([title, icon, routes], i) in routes"
        :key="i"
        :prepend-icon="icon"
        :title="title"
        :value="title"
        :to="routes"
        ripple
        color="blue-darken-2"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
