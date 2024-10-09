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
import ManageServicesView from '@/views/ManageServicesView.vue'
import ManageUsersView from '@/views/ManageUsersView.vue'
import ManagePicturesView from '@/views/ManagePicturesView.vue'
import ManageBusinessHoursView from '@/views/ManageBusinessHoursView.vue'
import GuestBookingView from '@/views/GuestBookingView.vue'
import NotFound from "@/components/NotFound.vue"
import apiClient from '@/utils/apiClient'; // Import the custom Axios instance

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
      component: BookingView,
      meta: { requiresAuth: true, role: ['user', 'admin'] } // Allow both user and admin roles
    },
    {
      path: '/guestBooking',
      name: 'guestBooking',
      component: GuestBookingView,
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
      meta: { requiresAuth: true, role: 'admin' }, // Admin-only routes
      children: [
        {
          path: 'manageServices',
          name: 'dashboard-services',
          component: ManageServicesView,
          meta: { requiresAuth: true, role: 'admin' },
        },
        {
          path: 'manageEvents',
          name: 'dashboard-events',
          component: ManageEventsView,
          meta: { requiresAuth: true, role: 'admin' },
        },
        {
          path: 'manageUsers',
          name: 'dashboard-users',
          component: ManageUsersView,
          meta: { requiresAuth: true, role: 'admin' },
        },
        {
          path: 'pendingEvents',
          name: 'dashboard-pendings',
          component: ManagePendingView,
          meta: { requiresAuth: true, role: 'admin' },
        },
        {
          path: 'businessHours',
          name: 'dashboard-businessHours',
          component: ManageBusinessHoursView,
          meta: { requiresAuth: true, role: 'admin' },
        },
        {
          path: 'managePictures',
          name: 'dashboard-managePictures',
          component: ManagePicturesView,
          meta: { requiresAuth: true, role: 'admin' },
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*', // This will catch all invalid routes
      name: 'NotFound',
      component: NotFound
    },
  ]
});

// Add global navigation guard
router.beforeEach(async (to, from, next) => {
  const token = sessionStorage.getItem('accessToken'); // Check if the user is authenticated
  const role = sessionStorage.getItem('role'); // Get the user's role ('admin' or 'user')

  // Check for authentication
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' });
  }

  // If the route requires a specific role
  if (to.meta.role) {
    try {
      // Validate token with backend to prevent sessionStorage tampering
      const response = await apiClient.get('http://localhost:5000/verify-token', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const verifiedRole = response.data.role; // Assuming your backend sends the verified role

      // If the user's role is not in the allowed roles, redirect to home
      if (Array.isArray(to.meta.role)) {
        // If meta.role is an array, check if user's role is included
        if (!to.meta.role.includes(verifiedRole)) {
          return next({ name: 'home' });
        }
      } else {
        // If meta.role is a single string, check if user's role matches
        if (to.meta.role !== verifiedRole) {
          return next({ name: 'home' });
        }
      }

      next(); // Allow navigation if the token and role are valid
    } catch (error) {
      console.error('Token validation failed:', error);
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('role');
      return next({ name: 'login' }); // Redirect to login if token is invalid
    }
  } else {
    // No specific role required, just allow navigation
    next();
  }
});

export default router;
