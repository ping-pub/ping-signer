<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <header v-if="sessionkey" class="bg-white space-y-4 p-4">
    <div class="flex items-center justify-between">
      <h2 class="font-semibold text-slate-900">Accounts</h2>
      <a
        href="#/new"
        class="group flex items-center rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm font-medium pl-3 pr-3 py-2 shadow-sm"
      >
        Setting
      </a>
    </div>
  </header>
</template>

<script>
export default {
  components: {},
  computed: {
    sessionkey() {
      return this.$store.state.sessionkey;
    },
  },
};
</script>
