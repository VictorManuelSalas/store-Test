<template>
  <Loader v-if="loader" />
  <main v-else>

    <HeaderSection />
    <section>
      <v-alert icon="mdi-account-alert" text color="deep-orange" v-model="alertShow">
        <h3 class="text-h8">Account Alert</h3>
        <v-row align="center" no-gutters>
          <v-col class="grow">
            {{ verifyAccountOptions[0].text }}
          </v-col>
          <v-col cols="12" sm="1" md="1">
          </v-col>
          <v-col class="shrink">
            <v-btn dark :loading="loading" color="deep-orange" filed
              @click="functionsRouteAlert(verifyAccountOptions[0].functionName)">
              {{ verifyAccountOptions[0].btn }}
            </v-btn>
          </v-col>
        </v-row>
      </v-alert>

      <v-alert prominent :type="alert.method === 'info'
        ? 'info'
        : alert.method === 'warning'
          ? 'warning'
          : 'error'
        " :value="alert.value" transition="scale-transition" :icon="alert.method === 'info'
          ? 'mdi-check'
          : alert.method === 'warning'
            ? 'mdi-alert'
            : 'mdi-alert-circle'
          " id="alert">
        <v-row align="center">
          <v-col class="grow">
            {{ alert.text }}
          </v-col>
        </v-row>
      </v-alert>


      <ChangePassword ref="changePassword" @password-event="alertProcess" />

      <div v-if="!disableFuncions">
        <router-view />
      </div>
      <div v-else>
        <div id="container">
          <v-container class="lighten-5">
            <v-row no-gutters id="card-header">
              <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                <v-img id="img" max-height="150" max-width="250" src="../assets/smartStoreLogo.webp"></v-img>
              </v-col>
              <v-col cols="12" sm="8" md="8" lg="8" xl="8">
                <v-text-field label="Search" placeholder="Search by service name..." outlined v-model="search"
                  disabled></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-for="item in items" :key="item.title" cols="12" sm="3" md="3" lg="3" xl="3">
                <v-card class="card" style="opacity: 0.5;">
                  <div class="items-headers" :style="{ backgroundColor: item.color }">
                    <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px">
                      <path :d="item.icon.path" />
                    </svg>
                  </div>
                  <v-card-title class="card-title">{{ item.title }}</v-card-title>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Loader from "@/components/Loader.vue";
import HeaderSection from "@/components/HeaderSection.vue";
import { verifyEmail } from "../helpers/Auth";
import ChangePassword from "@/components/ChangePassword.vue";

export default {
  components: {
    Loader,
    HeaderSection,
    ChangePassword
  },
  data() {
    return {
      alert: {
        value: false,
        text: "",
        method: "",
      },
      loader: true,
      loading: false,
      verifyAccountOptions: [{
        name: '',
        functionName: '',
        text: '',
        btn: ''
      }],
      disableFuncions: false
    };
  },
  computed: {
    items() { return this.$store.getters.getItems },
    user() {
      return this.$store.getters.getUser;
    },
    alertShow() {
      return this.verifyAccountOptions[0].name !== ''
    }

  },
  mounted() {

    setTimeout(() => {
      if (!this.user) {
        this.$router.push("/");
      }

      this.loader = false;
    }, 2000);
    this.alertStructureBuild()
  },
  methods: {
    alertProcess(message) {
      console.log(message)
      this.$refs.changePassword.dialog = false;
      this.alert = {
        value: true,
        text: message.text,
        method: message.method,
      };

      console.log('tets', this.verifyAccountOptions, message.text === 'info')
      if (message.method === 'info') {
        this.disableFuncions = false
        this.verifyAccountOptions.shift()
        if (!this.verifyAccountOptions.length) {
          this.verifyAccountOptions.unshift({
            name: '',
            functionName: '',
            text: '',
            btn: ''
          })
        }

      }
      setTimeout(() => {
        this.alert.value = false;
      }, 4000);
    },

    functionsRouteAlert(name_function) {
      switch (name_function) {
        case 'changePassword':
          this.changePassword()
          break;
        case 'verifyAccount':
          this.verifyAccount()
          break;
        default:
          break;
      }

    },
    async verifyAccount() {
      this.loading = true;
      console.log(this.user);
      const statusSendEmail = await verifyEmail(this.user);
      console.log(statusSendEmail);
      if (statusSendEmail.status === 200) {
        this.verifyAccountOptions.shift()
        this.verifyAccountOptions.unshift({
          name: '',
          functionName: '',
          text: '',
          btn: ''
        })
        return
      }
    },

    async changePassword() {
      this.$refs.changePassword.dialog = true;
    },


    alertStructureBuild() {
      console.log(this.user.auth.account_verified)
      console.log(this.user.auth.passwordDefaultChanged);

      !this.user.auth.passwordDefaultChanged ? (this.verifyAccountOptions.push({
        name: 'passwordNotChanged',
        functionName: 'changePassword',
        text: 'To secure your account and ensure maximum security, you need to change the default password that was assigned to you. This is an important step to protect your information and allow you to enjoy all the features of our platform safely.',
        btn: 'Change Password'
      }) + (this.disableFuncions = true)) : null


      !this.user.auth.account_verified ? this.verifyAccountOptions.push({
        name: 'emailNotUnverified',
        functionName: 'verifyAccount',
        text: "Your account remains unverified. We invite you to verify it by clicking the 'Verify Account' button, which will send you an email with instructions.",
        btn: 'Verify Account'
      }) : null

      this.verifyAccountOptions.length > 1 ? this.verifyAccountOptions.shift() : null


    }
  },
};
</script>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: rgba(237, 245, 244, 255);

  section {
    width: clamp(60%, 100%, 100%);
    height: 100vh;
    overflow: auto;
  }
}

#container {
  height: fit-content;
  width: clamp(60%, 100%, 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0rem;

  .lighten-5 {
    background-color: #f4f3f1;
    border-radius: 5px;
    box-shadow: rgba(108, 106, 106, 0.25) 0px 2px 8px 0px;
    height: fit-content;

    #card-header {
      display: flex;
      gap: 2rem;
      padding: 20px 0px;
      height: fit-content;
      justify-content: center;

      #img {
        margin: auto;
      }
    }

    a {
      text-decoration: none;
    }

    .card {
      cursor: pointer;
      border-radius: 15px;

      .items-headers {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10%;

        svg {
          fill: white;
        }
      }

      .card-title {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
