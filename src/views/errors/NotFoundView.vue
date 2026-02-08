<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-icon size="120" color="grey-lighten-1" class="mb-4">mdi-cloud-question</v-icon>

        <h1 class="text-h2 font-weight-bold mb-4">404</h1>
        <h2 class="text-h4 mb-4">Page Not Found</h2>

        <p class="text-body-1 text-grey mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div class="d-flex ga-4 justify-center flex-wrap">
          <v-btn size="large" color="primary" prepend-icon="mdi-home" @click="goHome">
            Go to Home
          </v-btn>

          <v-btn size="large" variant="outlined" prepend-icon="mdi-arrow-left" @click="goBack">
            Go Back
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
