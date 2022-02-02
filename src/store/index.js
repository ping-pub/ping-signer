import { createStore } from "vuex";

const loader = require.context(
  "../../reference/src/chains/mainnet",
  false,
  /\.json$/
);
console.log(loader);
loader.keys().forEach((k) => {
  console.log(k, loader(k));
});

// Create a new store instance.
const store = createStore({
  state: {
    count: 0,
    sessionkey: "",
  },
  getters: {
    key: (state) => {
      return state.sessionkey;
    },
  },
  mutations: {
    setSession(state, value) {
      state.sessionkey = value;
    },
  },
});

export default store;
