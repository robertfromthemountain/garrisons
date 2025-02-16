import { createStore } from 'vuex';
import theme from './theme';

const store = createStore({
  modules: {
    theme, // 🔹 A témamodul regisztrálása
  },
  state: {
    accessToken: sessionStorage.getItem('accessToken') || null,
    role: sessionStorage.getItem('role') || null,
    isLoggedIn: !!sessionStorage.getItem('accessToken'),
    categories: new Set(), // 🔹 Ellenőrizd, hogy valóban szükséged van-e erre
  },
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
      sessionStorage.setItem('accessToken', token);
    },
    clearAccessToken(state) {
      state.accessToken = null;
      sessionStorage.removeItem('accessToken');
    },
    setRole(state, role) {
      state.role = role;
      sessionStorage.setItem('role', role);
    },
    clearRole(state) {
      state.role = null;
      sessionStorage.removeItem('role');
    },
  },
  actions: {
    login({ commit }, { token, role }) {
      commit('setAccessToken', token);
      commit('setRole', role);
    },
    logout({ commit }) {
      commit('clearAccessToken');
      commit('clearRole');
    },
    initializeStore({ commit }) {
      console.log("Initializing store...");
      const token = sessionStorage.getItem('accessToken');
      const role = sessionStorage.getItem('role');
      if (token) commit('setAccessToken', token);
      if (role) commit('setRole', role);
    },
  },
  getters: {
    isLoggedIn: state => !!state.accessToken,
    accessToken: state => state.accessToken,
    userRole: state => state.role || "guest", // 🔹 Ha a `role` null, akkor "guest"-ként kezeljük
    getCategories: state => Array.from(state.categories),
  },
});

export default store;
