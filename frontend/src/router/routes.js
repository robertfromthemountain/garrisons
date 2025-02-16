import HomeView from '@/views/HomeView.vue';
import BookingView from '@/views/BookingView.vue';
import ReferencesView from '@/views/ReferencesView.vue';
import RulesView from '@/views/RulesView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import DashboardView from '@/views/DashboardView.vue';
import ManageEventsView from '@/views/ManageEventsView.vue';
import ManagePendingView from '@/views/ManagePendingView.vue';
import ManageServicesView from '@/views/ManageServicesView.vue';
import ManageUsersView from '@/views/ManageUsersView.vue';
import ManagePicturesView from '@/views/ManagePicturesView.vue';
import ManageBusinessHoursView from '@/views/ManageBusinessHoursView.vue';
import ManageCalendarView from '@/views/ManageCalendarView.vue';
import GuestBookingView from '@/views/GuestBookingView.vue';
import NotFound from "@/components/NotFound.vue";
import ForgotPasswordView from '@/views/ForgotPasswordView.vue';
import ResetPasswordView from '@/views/ResetPasswordView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/booking',
    name: 'booking',
    component: BookingView,
    meta: { requiresAuth: true, role: ['user', 'admin'] }
  },
  {
    path: '/guestBooking',
    name: 'guestBooking',
    component: GuestBookingView
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
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'manageServices',
        name: 'dashboard-services',
        component: ManageServicesView,
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: 'manageEvents',
        name: 'dashboard-events',
        component: ManageEventsView,
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: 'manageUsers',
        name: 'dashboard-users',
        component: ManageUsersView,
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: 'pendingEvents',
        name: 'dashboard-pendings',
        component: ManagePendingView,
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: 'businessHours',
        name: 'dashboard-businessHours',
        component: ManageBusinessHoursView,
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: 'managePictures',
        name: 'dashboard-managePictures',
        component: ManagePicturesView,
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: 'manageCalendar',
        name: 'dashboard-manageCalendar',
        component: ManageCalendarView,
        meta: { requiresAuth: true, role: 'admin' }
      }
    ]
  },
  {
    path: '/forgot-password',
    name: 'forgotPassword',
    component: ForgotPasswordView
  },
  {
    path: '/reset-password',
    name: 'resetPassword',
    component: ResetPasswordView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

export default routes;
