<template>
  <section v-if="step === 'confirm'" class="px-4 pt-4 pb-4 space-y-4">
    <div>Select Your Mnemonic In Order:</div>
    <div class="grid grid-cols-3 gap-1">
      <input
        v-for="(w, i) in confirms"
        :key="i"
        :placeholder="`${i + 1}`"
        v-model="confirms[i]"
        readonly
        name="confirm"
        :class="
          confirms[i]
            ? confirms[i] === words[i]
              ? 'border-green-500'
              : 'border-red-500'
            : ''
        "
        class="border border-gray-200 w-24 px-1 text-center rounded"
        @click="clear(i)"
      />
    </div>
    <div class="grid grid-cols-3 gap-1 mt-2">
      <input
        v-for="w in wordsOptions"
        name="confirm"
        :key="w"
        :value="w"
        :disabled="disabled[w]"
        readonly
        :class="disabled[w] ? 'bg-red-50 text-white' : ''"
        class="border border-gray-200 w-24 text-center rounded"
        @click="select(w, this)"
      />
    </div>
    <div class="flex justify-center">
      <button
        v-if="!valid"
        class="hover:bg-blue-400 group flex items-center rounded-md bg-blue-500 opacity-50 text-white text-sm font-medium px-10 py-4 shadow-sm"
      >
        Save
      </button>
      <button
        v-else
        class="hover:bg-blue-400 group flex items-center rounded-md bg-blue-500 text-white text-sm font-medium px-10 py-4 shadow-sm"
        @click="save()"
      >
        Save
      </button>
    </div>
  </section>
  <section v-else class="px-4 pt-4 pb-4 space-y-4">
    <div class="flex flex-row">
      <RadioGroup v-model="length">
        <!-- This Label is for the root `RadioGroup` -->
        <div class="bg-white rounded-md flex flex-row">
          <RadioGroupOption value="12" as="template" v-slot="{ checked }">
            <div
              :class="
                checked ? 'bg-indigo-50 border-indigo-200' : 'border-gray-200'
              "
              class="relative flex pl-7 pr-6 py-2 border"
            >
              <div class="flex flex-col">
                <!-- This Label is for the `RadioGroupOption` -->
                <RadioGroupLabel as="template">
                  <span
                    :class="checked ? 'text-indigo-900' : 'text-gray-900'"
                    class="block text-sm font-medium"
                    >12 Words</span
                  >
                </RadioGroupLabel>
              </div>
            </div>
          </RadioGroupOption>
          <RadioGroupOption value="18" as="template" v-slot="{ checked }">
            <div
              :class="
                checked ? 'bg-indigo-50 border-indigo-200' : 'border-gray-200'
              "
              class="relative flex px-6 py-2 border"
            >
              <div class="flex flex-col">
                <!-- This Label is for the `RadioGroupOption` -->
                <RadioGroupLabel as="template">
                  <span
                    :class="checked ? 'text-indigo-900' : 'text-gray-900'"
                    class="block text-sm font-medium"
                    >18 Words</span
                  >
                </RadioGroupLabel>
              </div>
            </div>
          </RadioGroupOption>
          <RadioGroupOption value="24" as="template" v-slot="{ checked }">
            <div
              :class="
                checked ? 'bg-indigo-50 border-indigo-200' : 'border-gray-200'
              "
              class="relative flex pl-6 pr-8 py-2 border"
            >
              <div class="flex flex-col">
                <!-- This Label is for the `RadioGroupOption` -->
                <RadioGroupLabel as="template">
                  <span
                    :class="checked ? 'text-indigo-900' : 'text-gray-900'"
                    class="block text-sm font-medium"
                    >24 Words</span
                  >
                </RadioGroupLabel>
              </div>
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>
    </div>
    <div>
      <label
        for="mnenonic"
        class="text-sm font-medium text-gray-700 flex flex-row place-content-between"
      >
        <span>Mnemonic Seed</span>
        <span class="hover:text-blue-400 text-blue-600" @click="generate()"
          >Random Generate</span
        >
      </label>
      <div class="mt-1">
        <textarea
          v-model="mnemonic"
          id="mnenonic"
          name="mnenonic"
          rows="4"
          class="focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
          placeholder="Input 12/18/24 words here"
          @change="onchange()"
        />
      </div>
    </div>
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">
        Account Name
      </label>
      <div class="mt-1">
        <input
          v-model="name"
          id="name"
          name="name"
          class="focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
          placeholder=""
        />
      </div>
    </div>
    <div>
      <label
        for="hdpath"
        class="text-sm font-medium text-gray-700 flex flex-row place-content-between"
      >
        <span>HD Path</span>
        <span @click="showChains()"></span>
      </label>
      <div class="mt-1">
        <input
          v-model="hdpath"
          id="hdpath"
          name="hdpath"
          class="focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
          placeholder="m/44'/118'/0'/0/0"
        />
      </div>
    </div>
    <div class="text-red-500">{{ error }}</div>
    <div class="flex justify-center">
      <button
        v-if="step === 'input'"
        @click="parse()"
        class="hover:bg-indigo-400 group flex items-center rounded-md bg-indigo-500 text-white text-sm font-medium px-10 py-2 shadow-sm"
      >
        Next
      </button>
    </div>
  </section>
</template>
<script>
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue";
import { generateMnemonic } from "bip39";
import { stringToPath } from "@cosmjs/crypto";
import {
  readAccounts,
  aesEncrypt,
  writeAccounts,
  readCurrent,
  writeCurrent,
  createAccounts,
} from "../libs/utils";

export default {
  components: { RadioGroup, RadioGroupLabel, RadioGroupOption },

  setup() {
    return {};
  },
  data() {
    return {
      hdpath: "m/44'/118'/0'/0/0",
      error: "",
      step: "input",
      length: "24",
      mnemonic: "",
      name: "",
      confirms: [],
      disabled: {},
    };
  },
  computed: {
    words() {
      const words = this.mnemonic
        .trim()
        .split(" ")
        .filter((x) => x !== "");
      return words;
    },
    wordsOptions() {
      const words = this.mnemonic
        .trim()
        .split(" ")
        .filter((x) => x !== "");
      return words.sort();
    },
    sessionkey() {
      return this.$store.state.sessionkey;
    },
    valid() {
      let valid = true;
      this.words.forEach((x, i) => {
        if (x !== this.confirms[i]) {
          valid = false;
        }
      });
      return valid;
    },
  },
  methods: {
    onchange() {
      this.mnemonic = this.mnemonic.trim();
      if ([12, 18, 24].includes(this.words.length))
        this.length = String(this.words.length);
    },
    generate() {
      const strength =
        this.length === "12" ? 128 : this.length === "18" ? 192 : 256;
      this.mnemonic = generateMnemonic(strength);
    },
    select(v) {
      this.disabled[v] = true;
      const len = Number(this.length);
      for (let i = 0; i < len; i++) {
        if (!this.confirms[i]) {
          this.confirms[i] = v;
          return;
        }
      }
    },
    clear(i) {
      const v = this.confirms[i];
      if (v) {
        this.disabled[v] = false;
        this.confirms[i] = "";
      }
    },

    save() {
      readAccounts().then((a) => {
        const hdpath = stringToPath(this.hdpath);
        const addresses = this.$store.state.chains
          .filter((chain) => {
            const hd2 = stringToPath(`m/44'/${chain.coin_type}'/0'/0/0`);
            return hdpath[1].toNumber() === hd2[1].toNumber();
          })
          .map((chain) =>
            createAccounts(
              this.mnemonic,
              this.hdpath,
              chain.addr_prefix,
              chain.chain_name
            )
          );

        Promise.all(addresses).then((x) => {
          const accounts = a || {};
          accounts[this.name] = {
            mnemonic: aesEncrypt(this.mnemonic, this.sessionkey),
            hdpath: this.hdpath,
            addresses: x.flat(),
          };
          console.log(accounts);
          writeAccounts(accounts);
          readCurrent().then((x) => {
            if (!x) {
              writeCurrent(this.name);
            }
          });
          this.$router.push("/home");
        });
      });
    },
    parse() {
      if (this.words.length === Number(this.length)) {
        if (this.mnemonic && this.name) {
          this.confirms = new Array(Number(this.length));
          this.step = "confirm";
        } else {
          this.error = "All fields are required";
        }
      } else {
        this.error = "Mnemonic is invalid";
      }
    },
  },
};
</script>
