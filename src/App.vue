<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div class="w-96 items-center">
    <header-vue></header-vue>
    <router-view />
  </div>
</template>

<script>
import HeaderVue from "./views/components/Header.vue";

export default {
  components: {
    HeaderVue,
  },
};
</script>

<style scoped>
.to-purple-600 {
  --tw-gradient-to: #9333ea;
}
.from-fuchsia-500 {
  --tw-gradient-from: #d946ef;
  --tw-gradient-stops: var(--tw-gradient-from),
    var(--tw-gradient-to, rgba(217, 70, 239, 0));
}
.to-indigo-500 {
  --tw-gradient-to: #6366f1;
}
.from-purple-500 {
  --tw-gradient-from: #a855f7;
  --tw-gradient-stops: var(--tw-gradient-from),
    var(--tw-gradient-to, rgba(168, 85, 247, 0));
}
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}
</style>
