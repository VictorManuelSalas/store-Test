<template>
  <div>
    <strong>Perfil</strong>

    <button @click="refresh" style="background-color: red">
      Refresh Token
    </button>
  </div>
</template>

<script>
import { refreshToken } from "../helpers/Auth";
export default {
  methods: {
    async refresh() {
      const { auth } = this.$store.getters.getUser;
      const da = await refreshToken(auth);
      console.log(da);
    },
  },
};
</script>

<style></style>
