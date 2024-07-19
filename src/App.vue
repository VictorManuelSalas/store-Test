<template>
  <v-app> 
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { app } from "./firebase/firebase_credentials";
export default {
  name: "App",

  data: () => ({
    //
  }),
  mounted() {
  },
};
</script>

<style scoped>
</style>
