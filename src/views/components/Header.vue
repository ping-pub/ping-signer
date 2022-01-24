<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <header v-if="sessionkey" class="bg-white space-y-4 p-4">
    <div class="flex items-center justify-between">
      <h2 class="font-semibold text-slate-900">Accounts {{ sessionkey }}</h2>
      <a
        href="#/new"
        class="group flex items-center rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
      >
        <svg
          width="20"
          height="20"
          fill="currentColor"
          class="mr-2"
          aria-hidden="true"
        >
          <path
            d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z"
          />
        </svg>
        Setting
      </a>
    </div>
  </header>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      sessionkey: this.$store.state.sessionkey,
    };
  },
};
</script>
