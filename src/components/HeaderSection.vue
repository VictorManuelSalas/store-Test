<template>
  <header>
    <nav>
      <span>
        <h3>Hello {{ user }}!</h3></span
      ><span
        ><v-select
          id="select"
          :items="items"
          label="Select Account"
          v-model="accountSelected"
        ></v-select
      ></span>
    </nav>
  </header>
</template>

<script>
export default {
  data() {
    return {
      accountSelected: null,
      items: ["Odoo"],
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser
        ? `${this.$store.getters.getUser.firstname} ${this.$store.getters.getUser.lastname}`
        : "User";
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
header {
  position: sticky;
  top: 0px;
  background-color: white;
  z-index: 10;
  width: 100%;
  padding: 10px 20px;
  nav {
    width: clamp(60%, 90%, 100%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 0px 0px 20px;
  }
}

@media (max-width: 650px) {
  header {
    width: 80vw;
    nav {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>
