<template>
  <div>
    <v-alert max-width="400" class="mx-auto" :type="alert.method === 'error' ? 'error' : 'warning'" :value="alert.value"
      :icon="alert.method === 'error' ? 'mdi-security' : 'mdi-information'" transition="scale-transition">
      {{ alert.text }}
    </v-alert>

    <v-card id="container" :loading="loading">
      <template slot="progress">
        <v-progress-linear height="5" indeterminate></v-progress-linear>
      </template>

      <div id="contenier-header-logo">
        <v-img id="img-logo" src="../assets/SmartStore 2016 Logo.png"></v-img>
      </div>

      <v-card-title class="pl-7">
        <h2>Log In</h2>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="email" :rules="emailRules" label="E-mail" required
                  filled></v-text-field><v-text-field filled v-model="password" :rules="passwordRules" label="Password"
                  required :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"></v-text-field>
              </v-col>
            </v-row>
            <a @click="$router.push('/auth/process')">Forgot your password?</a>
          </v-container>
        </v-form>
      </v-card-text>

      <v-container fluid class="pl-8 pr-8 pa-0">
        <v-row align="center">
          <v-col cols="12" sm="12">
            <div id="btns_actions">
              <v-btn block color="primary" large :disabled="!valid" @click="logInProcess(email, password)">
                Log in
              </v-btn>
              <!-- <v-btn
                block
                color="primary"
                large
                dark
                text
                @click="$router.push('/signup')"
              >
                Sign up
              </v-btn> -->
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { logIn, logOut } from "../helpers/Auth";
import { getUserByEmail } from "../helpers/UserQuery";
export default {
  data: () => ({
    show1: false,
    loading: false,
    selection: 1,
    valid: false,
    alert: {
      value: false,
      text: "",
      method: ""
    },
    password: "",
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) => v.length >= 8 || "Name must be less than 8 characters",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
  }),
  methods: {
    async logInProcess(email, password) {
      this.loading = true;
      const loginResponse = await logIn(email, password);

      if (loginResponse === "Firebase: Error (auth/invalid-credential).") {
        this.loading = false;
        this.alertProcess("Incorrect password or email, please try again.")
        return;
      }
      const user = await this.getUserInfo(loginResponse?.email);
      if (user) {
        this.loading = false;
        if (user.archived) {
          await logOut()
          this.alertProcess("Account Disabled, Please Contact Support", 'warning')
          return
        }

        this.$store.dispatch("fetchUser", {
          auth: {
            api_key: loginResponse.auth.config.apiKey,
            token: loginResponse.stsTokenManager.accessToken,
            refreshToken: loginResponse.stsTokenManager.refreshToken,
            account_verified: loginResponse.emailVerified,
            passwordDefaultChanged: await this.passwordVerify(loginResponse.reloadUserInfo)
          },
          ...user,
        });
        // console.log(loginResponse.stsTokenManager.accessToken);

        // console.table({
        //   auth: {
        //     api_key: loginResponse.auth.config.apiKey,
        //     token: loginResponse.stsTokenManager.accessToken,
        //     refreshToken: loginResponse.stsTokenManager.refreshToken,
        //     account_verified: loginResponse.emailVerified,
        //     passwordDefaultChanged: await this.passwordVerify(loginResponse.reloadUserInfo)
        //   },
        //   ...user,
        // })
        // this.$store.dispatch("updateItems", user.role);
        this.$router.push("/home");
        return
      }
    },

    async getUserInfo(email) {
      const userData = await getUserByEmail(email);
      if (userData.length === 0) {
        this.loading = false;
        this.alertProcess("User not found, please verify the information")
        return null;
      }
      return userData[0];
    },

    alertProcess(text, method = 'error') {
      this.alert = {
        value: true,
        text,
        method
      };

      setTimeout(() => {
        this.alert = {
          value: false,
          text: "",
        };
      }, 5000);
    },

    async passwordVerify(reloadUserInfo) {
      const { createdAt, passwordUpdatedAt } = reloadUserInfo;

      const createdAtMillis = parseInt(createdAt, 10);
      const passwordUpdatedAtMillis = parseInt(passwordUpdatedAt, 10);

      const createdAt_date = new Date(createdAtMillis);
      const passwordUpdatedAt_date = new Date(passwordUpdatedAtMillis);

      const areEqual = createdAt_date.getTime() !== passwordUpdatedAt_date.getTime();

      // console.log({ createdAt_date, passwordUpdatedAt_date, test: areEqual });
      return areEqual;
    }
  },

};
</script>

<style lang="scss" scoped>
#container {
  margin: 5rem auto;
  height: fit-content;
  max-width: 380px;
  width: 100%;

  h2 {
    color: black;
  }

  #contenier-header-logo {
    // background-image: url('../assets/background3.jpg');
    // background-size: cover;
    // background-position: center;
    // background-repeat: no-repeat; 
    padding: 20px;

    #img-logo {
      filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.7));
      width: 300px;
      margin: auto;
    }
  }
}

#btns_actions {
  display: flex;
  gap: 10px;
  flex-direction: column;
}

@media (max-width: 382px) {
  #container {
    margin: auto;
  }
}
</style>
