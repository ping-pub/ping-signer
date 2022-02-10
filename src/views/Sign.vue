<template>
  <div class="p-2">
    <div class="text-lg font-medium my-3">Sign Transaction</div>
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">
        Address
      </label>
      <div class="mt-1">
        <input
          v-model="address"
          id="name"
          name="name"
          class="focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
          placeholder=""
        />
      </div>
    </div>
    <div>
      <label
        for="signdoc"
        class="text-sm font-medium text-gray-700 flex flex-row place-content-between mt-1"
      >
        <span>Transaction</span>
      </label>
      <div class="mt-1">
        <textarea
          v-model="signDoc"
          id="signdoc"
          name="signdoc"
          rows="10"
          class="focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
        />
      </div>
    </div>
    <div v-if="!sessionkey">
      <label
        for="password"
        class="block text-sm font-medium text-gray-700 mt-1"
      >
        Password
      </label>
      <div class="mt-1">
        <input
          v-model="password"
          id="password"
          type="password"
          name="password"
          class="focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
          placeholder="Input your password"
        />
      </div>
    </div>
    <div v-if="error" class="m-1 text-red-500">{{ error }}</div>
    <div class="flex justify-center m-3">
      <button
        @click="reject()"
        class="hover:bg-red-400 group flex items-center rounded-md bg-red-500 text-white text-sm font-medium px-10 py-2 shadow-sm mr-2"
      >
        Reject
      </button>
      <button
        @click="sign()"
        class="hover:bg-green-400 group flex items-center rounded-md bg-green-500 text-white text-sm font-medium px-10 py-2 shadow-sm"
      >
        Sign
      </button>
    </div>
  </div>
</template>

<script>
import {
  getSessionKey,
  internRequest,
  readPassword,
  readSignInput,
  signAmino,
} from "../libs/utils";

export default {
  methods: {
    sign() {
      readPassword(this.password).then((p) => {
        if (p === this.password) {
          signAmino(this.address, this.signDoc, p).then((res) => {
            internRequest("approve", res).then(() => {
              window.close();
            });
          });
        } else {
          this.error = "password is incorrect";
          setTimeout(() => (this.error = ""), 5000);
        }
      });
    },
    reject() {
      internRequest("reject", { error: "Rejected" }).then(() => {
        window.close();
      });
    },
  },
  data() {
    return {
      password: "",
      sessionkey: null,
      address: "",
      signDoc: "",
      input: null,
      error: "",
    };
  },
  created() {
    getSessionKey().then((v) => (this.sessionkey = v));
    readSignInput().then((input) => {
      this.input = input;
      this.address = input.address;
      this.signDoc = JSON.stringify(input.signDoc);
    });
    window.unload = (e) => {
      console.log("before unload:", e);
      internRequest("reject", { error: "Rejected" }).then(() => {
        // console.log("closed");
      });
    };
  },
  beforeUnmount(e) {
    console.log("===========", e);
    internRequest("reject", { error: "Rejected" }).then(() => {
      console.log("closed");
    });
  },
};
</script>
