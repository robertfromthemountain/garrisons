import { createApp, watch } from 'vue';
import '@/assets/styles/main.css';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import App from './App.vue';
import axios from 'axios';
import router from './router';
import i18n from './i18n';
import store from './stores/store';
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css'; // Import the CSS for the toast

// Axios interceptor to add the accessToken from sessionStorage
axios.interceptors.request.use(function (config) {
  const token = sessionStorage.getItem('accessToken'); // Use sessionStorage
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

// Vuetify setup
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    defaultTheme: store.getters['theme/currentTheme'],
  },
  typography: {
    fontFamily: 'Bebas Neue, sans-serif',
  },
});

// Vue app setup
const app = createApp(App);

// Initialize the store (refresh token from sessionStorage)
store.dispatch('initializeStore'); // Ensure token is available

// Use Vuetify, router, i18n, and Toast in the app
app.use(vuetify);
app.use(router);
app.use(i18n);
app.use(store);
app.use(Toast, {
  position: POSITION.BOTTOM_LEFT,
  timeout: 5000,
  transition: "Vue-Toastification__fade",
  maxToasts: 5,
  newestOnTop: true
});

// Watch theme changes
watch(
  () => store.getters['theme/currentTheme'],
  (newTheme) => {
    console.log('Watcher triggered, new theme:', newTheme);
    vuetify.theme.defaultTheme = newTheme === 'dark';
  },
  { immediate: true }
);

// Mount the app
app.mount('#app');
