export default {
  namespaced: true,
  state: {
    theme: 'light' // Default theme
  },
  mutations: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    }
  },
  getters: {
    currentTheme: state => state.theme
  }
};
