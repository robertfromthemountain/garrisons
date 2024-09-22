import { createApp, watch } from 'vue';
import './assets/styles/main.css';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import App from './App.vue';
import axios from 'axios';
import router from './router';
import i18n from './i18n';
import store from './stores/store';

// // FullCalendar styles
// import '@fullcalendar/core/index.css';
// import '@fullcalendar/daygrid/index.css'; // For dayGrid view
// // Add other FullCalendar styles as needed, e.g. timeGrid if used
// // import '@fullcalendar/timegrid/main.css';

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('accessToken');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

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

const app = createApp(App);

app.use(vuetify);
app.use(router);
app.use(i18n);
app.use(store);

watch(
  () => store.getters['theme/currentTheme'],
  (newTheme) => {
    console.log('Watcher triggered, new theme:', newTheme);
    vuetify.theme.defaultTheme = newTheme === 'dark';
  },
  { immediate: true }
);

app.mount('#app');
