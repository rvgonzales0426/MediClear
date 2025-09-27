<script setup>
import GuestLayout from '@/components/layout/GuestLayout.vue'
import { ref, onMounted } from 'vue'

const showContent = ref(false)
const showCards = ref(false)

onMounted(() => {
  setTimeout(() => {
    showContent.value = true
  }, 100)
  setTimeout(() => {
    showCards.value = true
  }, 600)
})

const features = [
  {
    icon: 'mdi-clipboard-check-outline',
    title: 'Streamlined Discharge Process',
    description:
      'Automate and optimize patient discharge workflows with intelligent task management.',
    color: 'blue-darken-2',
  },
  {
    icon: 'mdi-account-group-outline',
    title: 'Team Collaboration',
    description:
      'Enable seamless communication between doctors, nurses, and administrative staff throughout the discharge process.',
    color: 'blue-darken-1',
  },
  {
    icon: 'mdi-chart-line',
    title: 'Analytics & Insights',
    description:
      'Track discharge metrics,  and improve patient satisfaction with comprehensive reporting.',
    color: 'blue',
  },
]
</script>

<template>
  <GuestLayout>
    <template #guest>
      <!-- Hero Section -->
      <v-row class="mb-8">
        <v-col cols="12">
          <v-fade-transition>
            <div v-show="showContent" class="text-center">
              <v-chip color="blue" text-color="blue-darken-3" class="mb-4" size="large">
                <v-icon start>mdi-medical-bag</v-icon>
                Healthcare Innovation
              </v-chip>

              <h1 class="text-h3 text-md-h2 font-weight-bold text-blue-darken-2 mb-4">
                Welcome to
                <span class="text-gradient">MediCLear</span>
              </h1>

              <p
                class="text-h6 text-md-h5 text-grey-darken-1 mb-6 mx-auto"
                style="max-width: 600px"
              >
                Your comprehensive solution for managing patient discharge workflows efficiently and
                effectively
              </p>

              <div class="d-flex flex-column flex-sm-row justify-center gap-4">
                <v-btn
                  color="blue-darken-2"
                  size="large"
                  variant="elevated"
                  prepend-icon="mdi-rocket-launch"
                  class="px-8"
                  to="/login"
                >
                  Get Started
                </v-btn>
              </div>
            </div>
          </v-fade-transition>
        </v-col>
      </v-row>

      <!-- Features Section -->
      <v-row>
        <v-col cols="12">
          <v-slide-y-transition group>
            <div v-show="showCards" key="title" class="text-center mb-8">
              <h2 class="text-h4 font-weight-bold text-blue-darken-2 mb-3">
                Why Choose MediCLear?
              </h2>
              <p class="text-body-1 text-grey-darken-1">
                Discover the features that make patient discharge management seamless
              </p>
            </div>
          </v-slide-y-transition>
        </v-col>
      </v-row>

      <v-row>
        <v-col v-for="(feature, index) in features" :key="feature.title" cols="12" md="6" lg="4">
          <v-slide-y-transition :delay="index * 100">
            <v-card
              v-show="showCards"
              :color="feature.color"
              variant="elevated"
              class="feature-card h-100"
              hover
            >
              <v-card-text class="text-center pa-6">
                <v-avatar :color="feature.color" size="64" class="mb-4 elevation-4">
                  <v-icon :icon="feature.icon" size="32" color="white"></v-icon>
                </v-avatar>

                <h3 class="text-h6 font-weight-bold text-white mb-3">
                  {{ feature.title }}
                </h3>

                <p class="text-body-2 text-blue-lighten-5 mb-0">
                  {{ feature.description }}
                </p>
              </v-card-text>
            </v-card>
          </v-slide-y-transition>
        </v-col>
      </v-row>

      <!-- Call to Action -->
      <v-row class="mt-12">
        <v-col cols="12">
          <v-slide-y-transition>
            <v-card
              v-show="showCards"
              color="blue-darken-2"
              variant="elevated"
              class="text-center pa-8"
            >
              <v-card-text>
                <h2 class="text-h4 font-weight-bold text-white mb-4">
                  Join the Healthcare Revolution
                </h2>
                <p class="text-body-1 text-blue-lighten-4 mb-6">
                  Empower your medical team with MediCLear's innovative discharge management system.
                  Built by excellent IT students, for healthcare professionals.
                </p>

                <p class="text-caption text-blue-lighten-3 mb-0">
                  Making healthcare workflows simpler, safer, and more efficient
                </p>
              </v-card-text>
            </v-card>
          </v-slide-y-transition>
        </v-col>
      </v-row>
    </template>
  </GuestLayout>
</template>

<style scoped>
.text-gradient {
  background: linear-gradient(45deg, #1976d2, #42a5f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.feature-card {
  transition: all 0.3s ease;
  border-radius: 16px !important;
}

.feature-card:hover {
  transform: translateY(-8px);
}

.gap-4 {
  gap: 1rem;
}
</style>
