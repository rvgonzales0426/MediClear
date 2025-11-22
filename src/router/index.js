import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import NurseDashboardView from '@/views/system/NurseDashboardView.vue'
import LandingPageView from '@/views/Guest/LandingPageView.vue'
import DoctorDashboardView from '@/views/system/DoctorDashboardView.vue'
import PatientRecordView from '@/views/system/PatientRecordView.vue'
import DischargeWorkflowView from '@/views/system/DischargeWorkflowView.vue'
import PatientInfoView from '@/views/system/PatientInfoView.vue'
import ReportView from '@/views/system/ReportView.vue'
import NotFoundView from '@/views/errors/NotFoundView.vue'
import ForbiddenView from '@/views/errors/ForbiddenView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: LandingPageView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },

    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },

    {
      path: '/nurse-dashboard',
      name: 'nurse-dashboard',
      component: NurseDashboardView,
      meta: { requiresAuth: true, roles: ['nurse'] },
    },
    {
      path: '/doctor-dashboard',
      name: 'doctor-dashboard',
      component: DoctorDashboardView,
      meta: { requiresAuth: true, roles: ['doctor'] },
    },

    {
      path: '/patient-record',
      name: 'patient-record',
      component: PatientRecordView,
      meta: { requiresAuth: true },
    },

    {
      path: '/work-flow',
      name: 'work-flow',
      component: DischargeWorkflowView,
      meta: { requiresAuth: true },
    },
    {
      path: '/patient-info/:id',
      name: 'patient-info',
      component: PatientInfoView,
      meta: { requiresAuth: true },
    },

    {
      path: '/reports',
      name: 'reports',
      component: ReportView,
      meta: { requiresAuth: true },
    },

    // Error Pages
    {
      path: '/forbidden',
      name: 'forbidden',
      component: ForbiddenView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize session if not already done
  if (!authStore.session && !authStore.userData) {
    await authStore.getUserInformation()
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    // Check if user is authenticated
    if (!authStore.session) {
      // Redirect to login if not authenticated
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    // Check role-based access
    if (to.meta.roles && to.meta.roles.length > 0) {
      const userRole = authStore.userData?.role

      if (!to.meta.roles.includes(userRole)) {
        // User doesn't have required role
        return next({ name: 'forbidden' })
      }
    }
  }

  // If user is authenticated and tries to access login/register, redirect to dashboard
  if ((to.name === 'login' || to.name === 'register') && authStore.session) {
    const userRole = authStore.userData?.role

    if (userRole === 'nurse') {
      return next({ name: 'nurse-dashboard' })
    } else if (userRole === 'doctor') {
      return next({ name: 'doctor-dashboard' })
    }
  }

  next()
})

export default router
