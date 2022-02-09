<template>
  <div class="p-2">
    <div class="text-lg font-medium">Sign Transaction</div>
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
        class="text-sm font-medium text-gray-700 flex flex-row place-content-between"
      >
        <span>Transaction</span>
      </label>
      <div class="mt-1">
        <textarea
          v-model="signDoc"
          id="signdoc"
          name="signdoc"
          rows="4"
          class="focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
        />
      </div>
    </div>
    <div class="flex justify-center m-2">
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
import { internRequest, readSignInput } from "../libs/utils";

export default {
  methods: {
    sign() {
      internRequest("approve", { signature: "xxx" }).then(() => {
        window.close();
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
      address: "",
      signDoc: "",
      input: null,
    };
  },
  created() {
    readSignInput().then((input) => {
      this.input = input;
      this.address = input.address;
      this.signDoc = JSON.stringify(input.signDoc);
    });
    window.beforeunload = (e) => {
      console.log("before unload:", e);
      internRequest("reject", { error: "Rejected" }).then(() => {
        console.log("closed");
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
