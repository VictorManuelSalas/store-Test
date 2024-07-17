<template>
  <Loader v-if="loader" />
  <main v-else> 
    <HeaderSection />
    <section>
      <router-view />
    </section>
  </main>
</template>

<script>
import Loader from "@/components/Loader.vue";
import MenuNavar from "@/components/MenuNavar";
import HeaderSection from "@/components/HeaderSection.vue";
export default {
  components: {
    Loader,
    MenuNavar,
    HeaderSection,
  },
  data() {
    return {
      loader: true,
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  mounted() {
    setTimeout(() => {
      if (!this.user) {
        this.$router.push("/");
      }
      this.loader = false;
    }, 2000);
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  height: 100vh;

  section {
    width: clamp(60%, 100%, 100%);
    height: 100vh; 
    overflow: auto;
  }
}
</style>
