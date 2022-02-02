<template>
  <section class="px-4 pt-4 pb-4 space-y-4">
    <ul class="grid grid-cols-1 gap-4">
      <li v-for="(v, k) in accounts" :key="k">
        <a
          href="item.url"
          class="hover:bg-gray-200 hover:border-transparent hover:shadow-lg group block rounded-lg px-4 pt-2 border border-gray-200"
        >
          <dl class="grid grid-cols-2 grid-rows-2 items-center">
            <div>
              <dt class="sr-only">Account Name</dt>
              <dd class="leading-6 font-medium text-black">{{ k }}</dd>
            </div>
            <div>
              <dt class="sr-only">Address</dt>
              <dd class="text-sm text-gray-400 mb-4">m/60'/118/0'/0/0</dd>
            </div>
            <div class="col-start-2 row-start-1 row-end-3">
              <dt class="sr-only">Chains</dt>
              <dd
                class="flex justify-end sm:justify-start lg:justify-end xl:justify-start -space-x-2"
              >
                <img
                  src="https://dl.airtable.com/.attachments/f25737491bd0034240093a7b4e039b15/afec77ff/logo.png"
                  width="48"
                  height="48"
                  class="w-7 h-7 rounded-full bg-gray-100 border-2 border-white"
                />

                <img
                  src="https://dl.airtable.com/.attachments/e54f814bba8c0f9af8a3056020210de0/2d1155fb/cosmos-hub.svg"
                  width="48"
                  height="48"
                  class="w-7 h-7 rounded-full bg-gray-100 border-2 border-white"
                />

                <img
                  src="https://dl.airtable.com/.attachments/e54f814bba8c0f9af8a3056020210de0/2d1155fb/cosmos-hub.svg"
                  width="48"
                  height="48"
                  class="w-7 h-7 rounded-full bg-gray-100 border-2 border-white"
                />

                <img
                  src="https://dl.airtable.com/.attachments/e54f814bba8c0f9af8a3056020210de0/2d1155fb/cosmos-hub.svg"
                  width="48"
                  height="48"
                  class="w-7 h-7 rounded-full bg-gray-100 border-2 border-white"
                />

                <img
                  src="https://dl.airtable.com/.attachments/f25737491bd0034240093a7b4e039b15/afec77ff/logo.png"
                  width="48"
                  height="48"
                  class="w-7 h-7 rounded-full bg-gray-100 border-2 border-white"
                />

                <img
                  src="https://dl.airtable.com/.attachments/e54f814bba8c0f9af8a3056020210de0/2d1155fb/cosmos-hub.svg"
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
  created() {
    if (!this.sessionkey) {
      this.$router.push({ name: "login" });
    }
    readAccounts().then((a) => {
      this.accounts = a;
    });
  },
};
</script>
