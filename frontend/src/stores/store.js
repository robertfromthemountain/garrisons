import { createStore } from 'vuex';
import theme from './theme';

const store = createStore({
  modules: {
    theme // Register the theme module here
  },
  state: {
    accessToken: sessionStorage.getItem('accessToken') || null,
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
  },
  actions: {
    login({ commit }, token) {
      commit('setAccessToken', token);
    },
    logout({ commit }) {
      commit('clearAccessToken');
    },
    initializeStore({ commit }) {
      const token = sessionStorage.getItem('accessToken');
      if (token) {
        commit('setAccessToken', token);
      }
    }
  },
  getters: {
    isLoggedIn: state => !!state.accessToken,
    accessToken: state => state.accessToken,
    getCategories(state) {
      return Array.from(state.categories);
    }
  }
});

export default store;
