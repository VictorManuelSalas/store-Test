<template>
  <Loader v-if="loader" />
  <main v-else>
    <HeaderSection />
    <section>
      <v-alert
        icon="mdi-account-alert"
        text
        color="deep-orange"
        v-model="verify"
      >
        <h3 class="text-h8">Account Alert</h3>
        <v-row align="center" no-gutters>
          <v-col class="grow">
            Your account remains unverified. We invite you to verify it by
            clicking the 'Verify Account' button, which will send you an email
            with instructions.
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="shrink">
            <v-btn
              :loading="loading"
              color="deep-orange"
              filed
              @click="verifyAccount"
            >
              Verify Account
            </v-btn>
          </v-col>
        </v-row>
      </v-alert>
      <router-view />
    </section>
  </main>
</template>

<script>
import Loader from "@/components/Loader.vue";
import MenuNavar from "@/components/MenuNavar";
import HeaderSection from "@/components/HeaderSection.vue";
import { verifyEmail } from "../helpers/Auth";
export default {
  components: {
    Loader,
    MenuNavar,
    HeaderSection,
  },
  data() {
    return {
      loader: true,
      loading: false,
      verify: true,
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
    this.verify = !this.user.auth.account_verified;
    console.log(this.user.auth);
  },
  methods: {
    async verifyAccount() {
      this.loading = true;
      console.log(this.user);
      const statusSendEmail = await verifyEmail(this.user);
      console.log(statusSendEmail);
      if (statusSendEmail.status === 200) {
        this.verify = false;
      }
    },
  },
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
