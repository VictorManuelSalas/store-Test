<template>
  <Loader v-if="loader" />
  <main v-else>
    <MenuNavar
      :user="{
        name: `${user.firstname} ${user.lastname}`,
        avatar: user.avatar,
      }"
    />
    <section>
      <HeaderSection />
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
    console.log("userValue", this.user);
    if (!this.user) {
      this.$router.push("/");
    }
    setTimeout(() => {
      this.loader = false;
    }, 2000);
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
main {
  display: flex;
  height: 100vh;

  section { 
    width: clamp(60%, 100%, 100%); 
    height: 100vh;
    padding-bottom: 1rem;
    overflow: auto;
  }
}
</style>
