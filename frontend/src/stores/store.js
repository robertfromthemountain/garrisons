import { createStore } from 'vuex';
import theme from './theme';

const store = createStore({
  modules: {
    theme // Register the theme module here
  },
  state: {
    accessToken: sessionStorage.getItem('accessToken') || null,
    role: sessionStorage.getItem('role') || null,
    isLoggedIn: !!sessionStorage.getItem('accessToken'), // Derived from token presence
    categories: new Set() // Make sure this is used appropriately elsewhere in your code
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
      commit('setRole', role); // Set the role on login
    },
    logout({ commit }) {
      commit('clearAccessToken');
      commit('clearRole'); // Clear the role on logout
    },
    initializeStore({ commit }) {
      const token = sessionStorage.getItem('accessToken');
      const role = sessionStorage.getItem('role');
      if (token) {
        commit('setAccessToken', token);
      }
      if (role) {
        commit('setRole', role);
      }
    }
  },
  getters: {
    isLoggedIn: state => !!state.accessToken,
    accessToken: state => state.accessToken,
    userRole: state => state.role,
    getCategories(state) {
      return Array.from(state.categories);
    }
  }
});

export default store;
