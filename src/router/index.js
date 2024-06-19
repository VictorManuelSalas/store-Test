import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: function () {
      return import(/* webpackChunkName: "login" */ "../pages/LoginPage.vue");
    },
  },
  {
    path: "/auth/process",
    name: "auth",
    component: function () {
      return import(/* webpackChunkName: "login" */ "../pages/ResetPassword.vue");
    },
  },
  {
    path: "/signup",
    name: "signup",
    component: function () {
      return import(/* webpackChunkName: "login" */ "../pages/SignUp.vue");
    },
  },
  {
    path: "/home",
    name: "home",
    component: function () {
      return import(/* webpackChunkName: "login" */ "../pages/Home.vue");
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
