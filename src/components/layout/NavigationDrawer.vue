<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { getAvatarText } from '@/utils/helpers.js'

const props = defineProps(['isDrawerOpen'])
const emit = defineEmits(['update:isDrawerOpen'])

const authStore = useAuthStore()

const drawer = computed({
  get: () => props.isDrawerOpen,
  set: (newVal) => emit('update:isDrawerOpen', newVal),
})

const router = useRouter()
const assignedRoutes = ref(null)
const isLoading = ref(false)

const handleSignOut = async () => {
  isLoading.value = true
  try {
    await authStore.signOutUser() // Use auth store logout method

    router.replace('/login')
  } catch (error) {
    console.error('Error signing out:', error)
  } finally {
    isLoading.value = false
  }
}

const routes = computed(() => [
  [
    'Dashboard',
    'mdi-view-dashboard-outline',
    assignedRoutes.value, // Now this will update when assignedRoutes changes
  ],
  ['Patients', 'mdi-account-multiple-outline', '/patient-record'],
  ['Discharge Workflow', 'mdi-file-document-outline', '/work-flow'],
  ['Reports', 'mdi-chart-box-outline', '/reports'],
])

onMounted(async () => {
  await authStore.getUserInformation() // get user info from store

  if (authStore.userData?.role === 'nurse') {
    assignedRoutes.value = '/nurse-dashboard'
  } else if (authStore.userData?.role === 'doctor') {
    assignedRoutes.value = '/doctor-dashboard'
  }
})
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
        v-for="([title, icon, route], i) in routes"
        :key="i"
        :prepend-icon="icon"
        :title="title"
        :value="title"
        :to="route"
        ripple
        color="blue-darken-2"
      ></v-list-item>
    </v-list>
    <v-row class="position-fixed bottom-row" v-if="authStore.userData">
      <v-divider></v-divider>
      <v-col cols="12" class="d-flex justify-center ga-2">
        <v-avatar color="blue-lighten-2">
          <span class="text-white text-h5">{{
            getAvatarText(authStore.userData?.firstname + ' ' + authStore.userData?.lastname)
          }}</span>
        </v-avatar>
        <div class="text-start">
          <p class="font-weight-bold">
            {{ authStore.userData?.firstname + ' ' + authStore.userData?.lastname || 'User' }}
          </p>
          <span class="text-caption text-capitalize">{{
            authStore.userData?.role || 'No Role'
          }}</span>
        </div>
      </v-col>
      <v-col cols="12" lg="6" class="mx-auto">
        <v-btn
          size="small"
          color="red"
          variant="text"
          prepend-icon="mdi-logout"
          :loading="isLoading"
          @click="handleSignOut"
          >Sign out</v-btn
        >
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<style scoped>
.bottom-row {
  bottom: 20px;
  right: 12px;
  left: 0px;
}
</style>
