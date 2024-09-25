import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BookingView from '@/views/BookingView.vue'
import ReferencesView from '@/views/ReferencesView.vue'
import RulesView from '@/views/RulesView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ManageEventsView from '@/views/ManageEventsView.vue'
import ManagePendingView from '@/views/ManagePendingView.vue'
import ManageModifiedView from '@/views/ManageModifiedView.vue'
import ManageServicesView from '@/views/ManageServicesView.vue'
import ManageUsersView from '@/views/ManageUsersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/booking',
      name: 'booking',
      component: BookingView
    },
    {
      path: '/references',
      name: 'references',
      component: ReferencesView
    },
    {
      path: '/rules',
      name: 'rules',
      component: RulesView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      children: [
        {
          path: 'manageServices',
          name: 'dashboard-services',
          component: ManageServicesView
        },
        {
          path: 'manageEvents',
          name: 'dashboard-events',
          component: ManageEventsView
        },
        {
          path: 'manageUsers',
          name: 'dashboard-users',
          component: ManageUsersView
        },
        {
          path: 'pendingEvents',
          name: 'dashboard-pendings',
          component: ManagePendingView
        },
        {
          path: 'modifiedEvents',
          name: 'dashboard-modified',
          component: ManageModifiedView
        }
      ]
    }
  ]
})

export default router
