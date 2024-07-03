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
      return import(
        /* webpackChunkName: "login" */ "../pages/ResetPassword.vue"
      );
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
    children: [
      {
        path: "/",
        component: function () {
          return import(/* webpackChunkName: "login" */ "../views/Home.vue");
        },
      },
      {
        path: "invoices",
        component: function () {
          return import(
            /* webpackChunkName: "login" */ "../views/Invoices.vue"
          );
        },
      },
      {
        path: "payments",
        component: function () {
          return import(
            /* webpackChunkName: "login" */ "../views/Payments.vue"
          );
        },
      },
      {
        path: "profile",
        component: function () {
          return import(/* webpackChunkName: "login" */ "../views/Profile.vue");
        },
      },
    ],
  },
  {
    path: "/admin/home",
    name: "admin-home",
    component: function () {
      return import(/* webpackChunkName: "login" */ "../admin/pages/Home.vue");
    },
    children: [
      {
        path: "/",
        component: function () {
          return import(
            /* webpackChunkName: "login" */ "../admin/views/Home.vue"
          );
        },
      },
      {
        path: "profile",
        component: function () {
          return import(
            /* webpackChunkName: "login" */ "../admin/views/Profile.vue"
          );
        },
      },
      {
        path: "invoices",
        component: function () {
          return import(
            /* webpackChunkName: "login" */ "../admin/views/Invoices.vue"
          );
        },
      },
      {
        path: "payments",
        component: function () {
          return import(
            /* webpackChunkName: "login" */ "../admin/views/Payments.vue"
          );
        },
      },
      {
        path: "admin",
        component: function () {
          return import(
            /* webpackChunkName: "login" */ "../admin/views/Admin.vue"
          );
        },
      },
      {
        path: "create-user",
        component: function () {
          return import(
            /* webpackChunkName: "login" */ "../admin/views/CreateUser.vue"
          );
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
