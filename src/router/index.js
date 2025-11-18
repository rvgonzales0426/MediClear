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
    },
    {
      path: '/doctor-dashboard',
      name: 'doctor-dashboard',
      component: DoctorDashboardView,
    },

    {
      path: '/patient-record',
      name: 'patient-record',
      component: PatientRecordView,
    },

    {
      path: '/work-flow',
      name: 'work-flow',
      component: DischargeWorkflowView,
    },
    {
      path: '/patient-info/:id',
      name: 'patient-info',
      component: PatientInfoView,
    },

    {
      path: '/reports',
      name: 'reports',
      component: ReportView,
    },
  ],
})

export default router
