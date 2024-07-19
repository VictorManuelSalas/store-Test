import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    user: null,
    items: [
      {
        title: "Invoices",
        url: "/home/invoices",
        icon: {
          path: "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h407q16 0 30.5 6t25.5 17l154 154q11 11 17 25.5t6 30.5v407q0 33-23.5 56.5T760-120H200Zm0-80h560v-400H640q-17 0-28.5-11.5T600-640v-120H200v560Zm440-80q17 0 28.5-11.5T680-320q0-17-11.5-28.5T640-360H320q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280h320ZM440-600q17 0 28.5-11.5T480-640q0-17-11.5-28.5T440-680H320q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600h120Zm200 160q17 0 28.5-11.5T680-480q0-17-11.5-28.5T640-520H320q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440h320ZM200-760v160-160 560-560Z",
        },
        color: "#72b7e7",
      },
      {
        title: "Payments",
        url: "/home/payments",
        icon: {
          path: "M80-480q0 68 34 124.5t91 86.5q14 8 20.5 23t.5 30q-6 16-21 23t-29-1Q98-234 49-309.5T0-480q0-94 47.5-169T172-764q14-8 29.5-1.5T224-743q7 14 1 29t-20 23q-57 30-91 86.5T80-480Zm480 320q-133 0-226.5-93.5T240-480q0-133 93.5-226.5T560-800q56 0 106 18t91 50q13 10 13 26t-12 28q-11 11-27.5 12t-30.5-9q-30-22-65.5-33.5T560-720q-100 0-170 70t-70 170q0 100 70 170t170 70q39 0 74.5-11.5T700-285q14-10 30.5-9t27.5 12q12 12 12 28t-13 26q-41 32-91 50t-106 18Zm248-280H560q-17 0-28.5-11.5T520-480q0-17 11.5-28.5T560-520h248l-36-36q-11-11-11-28t11-28q11-11 28-11t28 11l104 104q12 12 12 28t-12 28L828-348q-11 11-28 11t-28-11q-11-11-11-28t11-28l36-36Z",
        },
        color: "#d6bc7f",
      },
      {
        title: "Profile",
        url: "/home/profile",
        icon: {
          path: "M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z",
        },
        color: "#b85aca",
      },
    ],
    invoices: [],
    customersOdoo: [],
  };
};

export default new Vuex.Store({
  state: getDefaultState(),
  mutations: {
    setUser(state, user) {
      if (state.user !== null) {
        Object.keys(user).forEach((key) => { 
          if (state.user.hasOwnProperty(key)) {
            state.user[key] = user[key];
          }
        });
        return;
      }
      state.user = user;
    },
    setItems(state, items) {
      state.items = items;
    },
    RESET_STATE(state) {
      Object.assign(state, getDefaultState());
    },
    setInvoices(state, invoices) {
      state.invoices = invoices;
    },
    setCustomersOdoo(state, customers) {
      state.customersOdoo = customers;
    },
  },
  actions: {
    fetchUser({ commit }, userData) {
      commit("setUser", userData);
    },
    fetchCustomersOdoo({ commit }, odooCustomers) {
      commit("setCustomersOdoo", odooCustomers);
    },
    fetchInvoices({ commit }, userInvoices) {
      commit("setInvoices", userInvoices);
    },
    updateItems({ commit, state }, userRole) {
      let itemUpdate = state.items;

      if (userRole === "admin") {
        state.items.push({
          title: "Admin",
          url: "/home/admin",
          icon: {
            path: "M680-280q25 0 42.5-17.5T740-340q0-25-17.5-42.5T680-400q-25 0-42.5 17.5T620-340q0 25 17.5 42.5T680-280Zm0 120q31 0 57-14.5t42-38.5q-22-13-47-20t-52-7q-27 0-52 7t-47 20q16 24 42 38.5t57 14.5ZM480-874q8 0 14.5 1t13.5 4l240 90q23 9 37.5 29t14.5 45v125q0 17-11.5 28.5T760-540q-17 0-28.5-11.5T720-580v-124l-240-90-240 90v188q0 50 14.5 100t40 95q25.5 45 62 81t79.5 59q15 8 21.5 23t.5 30q-7 16-22.5 22t-30.5-2q-113-56-179-169t-66-239v-189q0-25 14.5-45t37.5-29l240-90q7-3 14-4t14-1ZM680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80ZM480-494Z",
          },
          color: "#70d7e0",
        });
      }
      commit("setItems", itemUpdate);
    },
    resetStore({ commit }) {
      commit("RESET_STATE");
    },
  },
  getters: {
    getUser: (state) => state.user,
    getItems: (state) => state.items,
    getInvoices: (state) => state.invoices,
    getCustomersOdoo: (state) => state.customersOdoo,
  },
  modules: {},
});
