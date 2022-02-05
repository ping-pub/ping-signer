<template>
  <section class="px-4 pt-4 pb-4 space-y-4">
    <ul class="grid grid-cols-1 gap-4">
      <li v-for="(v, k) in accounts" :key="k">
        <a
          :href="`#address?account=${v.name}`"
          class="hover:bg-gray-200 hover:border-transparent hover:shadow-lg group block rounded-lg px-4 pt-2 border border-gray-200"
        >
          <dl class="grid grid-cols-2 grid-rows-2 items-center">
            <div>
              <dt class="sr-only">Account Name</dt>
              <dd class="leading-6 font-medium text-black">{{ v.name }}</dd>
            </div>
            <div>
              <dt class="sr-only">Address</dt>
              <dd class="text-xs text-gray-400 mb-4">{{ v.hdpath }}</dd>
            </div>
            <div class="col-start-2 row-start-1 row-end-3">
              <dt class="sr-only">Chains</dt>
              <dd
                class="flex justify-end sm:justify-start lg:justify-end xl:justify-start -space-x-2"
              >
                <img
                  v-for="logo in v.logos"
                  :key="logo"
                  :src="logo"
                  width="48"
                  height="48"
                  class="w-7 h-7 rounded-full bg-gray-100 border-2 border-white"
                />
              </dd>
            </div>
          </dl>
        </a>
      </li>
      <li class="hover:shadow flex rounded-lg">
        <a
          href="#/new"
          class="hover:border-transparent hover:shadow-xs w-full flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-sm font-medium py-4"
        >
          New Account
        </a>
      </li>
    </ul>
  </section>
</template>

<script>
import { readAccounts } from "../libs/utils";
export default {
  components: {},
  data() {
    return {
      accounts: [],
    };
  },
  computed: {
    sessionkey() {
      return this.$store.state.sessionkey;
    },
  },
  methods: {
    showlogo(name) {
      const chain = this.$store.state.chains.find((x) => x.chain_name === name);
      if (chain) {
        return chain.logo;
      }
      return "";
    },
  },
  created() {
    if (!this.sessionkey) {
      this.$router.push("/login");
      return;
    }
    readAccounts().then((a) => {
      console.log(a);
      this.accounts = Object.keys(a).map((k) => {
        const v = a[k];

        const addresses = v.addresses || [];
        const logos = addresses
          .map((addr) => this.showlogo(addr.name))
          .filter(
            (i) =>
              i.startsWith("https://dl.airtable.com") ||
              i.startsWith("https://ping.pub")
          )
          .slice(0, 8);
        return {
          name: k,
          hdpath: v.hdpath,
          logos,
        };
      });
    });
  },
};
</script>
