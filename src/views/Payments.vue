<template>
  <div>
    This is payments

    <ul>
      <li v-for="customer in customers" :key="customer.id">
        <img
          :src="'data:image/png;base64,' + customer.avatar_128"
          :alt="customer.name"
        />

        {{ customer.name }} - {{ customer.email }}
      </li>
    </ul>
  </div>
</template>

<script>
import { getAllCustomersOdoo } from "../helpers/Odoo/Customers";
export default {
  data() {
    return { customers: [] };
  },
  mounted() {
    this.tets();
  },
  methods: {
    async tets() {
      const { auth } = this.$store.getters.getUser;
      this.customers = await getAllCustomersOdoo(auth.token);
    },
  },
};
</script>

<style></style>
