import { createWebHashHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import New from "@/views/New.vue";
import Login from "@/views/Login.vue";
import Address from "@/views/Address.vue";
import Sign from "@/views/Sign.vue";

const routes = [
  {
    path: "/",
    alias: "/home",
    name: "home",
    component: Home,
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
  {
    path: "/new",
    name: "new",
    component: New,
  },
  {
    path: "/login",
    alias: "/popup",
    name: "login",
    component: Login,
  },
  {
    path: "/address",
    name: "address",
    component: Address,
  },
  {
    path: "/sign",
    name: "sign",
    component: Sign,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
