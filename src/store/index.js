import { createStore } from "vuex";

// Create a new store instance.
const store = createStore({
  state() {
    return {
      count: 0,
      sessionkey: "",
    };
  },
  mutations: {
    setSession(state, value) {
      state.sessionkey = value;
      console.log("setup store state:", state);
    },
  },
});

export default store;
