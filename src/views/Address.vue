<template>
  <section class="px-4 pt-4 pb-4 space-y-4 text-md">
    <input type="checkbox" v-model="defaultAccount" @change="change()" />
    {{ account }} -
    <small>{{ hdpath }}</small>
    <ul class="grid grid-cols-1 gap-2">
      <li v-for="(v, k) in derived" :key="k">
        <div class="relative rounded-md shadow-sm">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <img
              :src="v.logo"
              width="16"
              height="16"
              class="rounded-full bg-gray-100 border-2 border-white"
            />
          </div>
          <input
            type="text"
            name="price"
            id="price"
            :class="v.compatible ? 'text-green-500' : 'text-red-500'"
            class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
            placeholder="0.00"
            :value="v.address"
          />
          <div class="absolute inset-y-0 right-2 flex items-center">
            <input
              v-model="selected"
              type="checkbox"
              name="address"
              :value="v.name"
            />
          </div>
        </div>
      </li>
    </ul>
    <div class="flex justify-center">
      <button
        @click="back()"
        class="hover:bg-gray-400 group flex items-center rounded-md bg-gray-500 text-white text-sm font-medium px-10 py-2 shadow-sm mr-1"
      >
        Cancel
      </button>
      <button
        @click="save()"
        class="hover:bg-indigo-400 group flex items-center rounded-md bg-indigo-500 text-white text-sm font-medium px-10 py-2 shadow-sm"
      >
        Save
      </button>
    </div>
  </section>
</template>

<script>
import { stringToPath } from "@cosmjs/crypto";
import {
  aesDecrypt,
  createAccounts,
  readAccounts,
  readCurrent,
  writeAccounts,
  writeCurrent,
} from "../libs/utils";
export default {
  components: {},
  data() {
    return {
      account: "",
      hdpath: "",
      addresses: [],
      selected: [],
      toSave: [],
      defaultAccount: "",
    };
  },
  computed: {
    sessionkey() {
      return this.$store.state.sessionkey;
    },
    derived() {
      if (!this.hdpath || !this.hdpath.startsWith("m")) return [];

      const coin_type = stringToPath(this.hdpath)[1].toNumber();
      const addresses = this.addresses.map((a) => {
        const a2 = a;
        const chain = this.$store.state.chains.find(
          (x) => x.chain_name === a.name
        );
        if (chain) {
          a2.logo = chain.logo;
          const hd2 = stringToPath(
            `m/44'/${chain.coin_type}'/0'/0/0`
          )[1].toNumber();
          a2.compatible = hd2 === coin_type;
        } else {
          a2.compatible = false;
        }

        return a2;
      });
      return addresses;
    },
  },
  methods: {
    change() {
      writeCurrent(this.account);
    },
    back() {
      this.$router.push("/home");
    },
    save() {
      readAccounts().then((a) => {
        const accounts = a || {};
        accounts[this.account].addresses = this.addresses.filter((x) =>
          this.selected.includes(x.name)
        );
        writeAccounts(accounts).then(() => this.$router.push("/home"));
      });
    },
  },
  created() {
    this.account = this.$route.query.account;
    readCurrent().then((c) => {
      this.defaultAccount = c === this.account;
    });
    readAccounts().then((a) => {
      const acc = a[this.account];
      this.hdpath = acc.hdpath;
      this.selected = acc.addresses.map((x) => x.name);
      this.mnemonic = aesDecrypt(acc.mnemonic, this.sessionkey);
      console.log("hdpath:", this.hdpath);
      const wallet = this.$store.state.chains.map((x) =>
        createAccounts(this.mnemonic, this.hdpath, x.addr_prefix, x.chain_name)
      );
      const promise = Promise.all(wallet);
      promise.then((x) => (this.addresses = x.flat()));
    });
  },
};
</script>
