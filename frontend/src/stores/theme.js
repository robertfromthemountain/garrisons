export default {
  namespaced: true,
  state: {
    theme: 'light'
  },
  mutations: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      console.log("Megkaptam a komponenstol");
      console.log(state.theme);
    }
  },
  getters: {
    currentTheme: state => state.theme
  }
};
