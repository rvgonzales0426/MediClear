<script setup>
import { computed, ref, onMounted } from 'vue'
import { supabase } from '../../supabase.js'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const props = defineProps(['isDrawerOpen'])
const emit = defineEmits(['update:isDrawerOpen'])

const authStore = useAuthStore()

const drawer = computed({
  get: () => props.isDrawerOpen,
  set: (newVal) => emit('update:isDrawerOpen', newVal),
})

const router = useRouter()
const user = ref(null)

const isLoading = ref(false)

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
  }
})

// Get user initials from full name
const userInitials = computed(() => {
  if (!user.value?.full_name) return 'U'
  return user.value.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
})

const handleSignOut = async () => {
  isLoading.value = true
  try {
    await authStore.signOutUser() // Use auth store logout method
    localStorage.removeItem('user')
    localStorage.removeItem('session')

    router.replace('/login')
  } catch (error) {
    console.error('Error signing out:', error)
  } finally {
    isLoading.value = false
  }
}

const routes = [
  ['Dashboard', 'mdi-view-dashboard-outline', '/nurse-dashboard'],
  ['Patients', 'mdi-account-multiple-outline', '/patient-record'],
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

    <v-row class="position-fixed bottom-row">
      <v-divider></v-divider>
      <v-col cols="12" class="d-flex justify-center ga-2">
        <v-avatar color="blue-lighten-2">
          <span class="text-white text-h5">{{ userInitials }}</span>
        </v-avatar>
        <div class="text-start">
          <p class="font-weight-bold">{{ user?.full_name || 'User' }}</p>
          <span class="text-caption text-capitalize">{{ user?.role || 'No Role' }}</span>
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
