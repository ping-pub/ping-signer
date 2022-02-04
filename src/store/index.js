import { createStore } from "vuex";

const loader = require.context(
  "../../reference/src/chains/mainnet",
  false,
  /\.json$/
);
const chains = [];
loader.keys().forEach((k) => {
  chains.push(loader(k));
});

// Create a new store instance.
const store = createStore({
  state: {
    count: 0,
    sessionkey: "",
    chains,
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
