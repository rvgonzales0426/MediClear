<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import DischargeProcess from '@/components/system/DischargeProcess.vue'
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <v-col cols="12" lg="10" md="8">
          <h3 class="text-h4">Discharge Workflow</h3>
          <p class="text-caption">Visual tracking of patient discharge process</p>
        </v-col>

        <v-col cols="12" lg="12" md="10">
          <DischargeProcess />
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
