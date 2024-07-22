<template>
  <div>
    <v-alert
      max-width="400"
      class="mx-auto"
      type="error"
      :value="alert.value"
      icon="mdi-security"
      transition="scale-transition"
    >
      {{ alert.text }}
    </v-alert>

    <v-card id="container" :loading="loading">
      <template slot="progress">
        <v-progress-linear height="5" indeterminate></v-progress-linear>
      </template>

      <v-img height="150" src="../assets/background.jpg"></v-img>

      <v-card-title class="pl-7">
        <h2>Log In</h2>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                  filled
                ></v-text-field
                ><v-text-field
                  filled
                  v-model="password"
                  :rules="passwordRules"
                  label="Password"
                  required
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                ></v-text-field>
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
              <v-btn
                block
                color="primary"
                large
                :disabled="!valid"
                @click="logInProcess(email, password)"
              >
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
import { logIn } from "../helpers/Auth";
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
        this.alert = {
          value: true,
          text: "Incorrect password or email, please try again.",
        };

        setTimeout(() => {
          this.alert = {
            value: false,
            text: "",
          };
        }, 5000);
        return;
      }
      const user = await this.getUserInfo(loginResponse?.email);
      if (user) {
        this.$store.dispatch("fetchUser", {
          auth: {
            api_key: loginResponse.auth.config.apiKey,
            token:
              "eyJhbGciOiJSUzI1NiIsImtpZCI6ImMxNTQwYWM3MWJiOTJhYTA2OTNjODI3MTkwYWNhYmU1YjA1NWNiZWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc21hcnRzdG9yZS05MGMwNyIsImF1ZCI6InNtYXJ0c3RvcmUtOTBjMDciLCJhdXRoX3RpbWUiOjE3MjE0MjY3MTcsInVzZXJfaWQiOiI1eDN3eERjem83YU94a05sYkVqenI1YnFkd2cxIiwic3ViIjoiNXgzd3hEY3pvN2FPeGtObGJFanpyNWJxZHdnMSIsImlhdCI6MTcyMTQyNjcxNywiZXhwIjoxNzIxNDMwMzE3LCJlbWFpbCI6InZudW5lekBxdWlja2FwcHMubXgiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ2bnVuZXpAcXVpY2thcHBzLm14Il19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.KiImHzZm1CkQ1XkI4e4fGF4OrHr3c6itQPWSWG2jEyzC4tGjsW8zY4h8nLn0V_qsz69YLBPZkh9cTxJ1gauAbgaNF-kSik3jTMk-abzw_n9BDOqbjwpkPlm5g9cz4gyD3L0F5EW_s7LPco_VnsgBupC9Rbw_PeVYGyO-SeF2COCHeJjZR1vteeToVhquXkDecChPHPRM8wS4nDSgmDk6QBRrnwFcbdOXZUO9vwfuyok0uNPfHPf9UKT0w3WEL8aaBNtiGxB9U83dKs3XvmfR9NKVUoxhMJr7DbPgRUl-fWFjgY6NR_VsFcSYmorI1JJEmGHV5UeOqSCYJsfcK0XGpQ", //loginResponse.stsTokenManager.accessToken,
            refreshToken: loginResponse.stsTokenManager.refreshToken,
            account_verified: loginResponse.emailVerified,
          },
          ...user,
        });
        this.$store.dispatch("updateItems", user.role);
        this.loading = false;
        this.$router.push("/home");
      }
    },
    async getUserInfo(email) {
      const userData = await getUserByEmail(email);
      if (userData.length === 0) {
        this.loading = false;
        this.alert = {
          value: true,
          text: "User not found, please verify the information",
        };
        return null;
      }
      return userData[0];
    },
  },
};
</script>

<style lang="scss" scoped>
#container {
  margin: 5rem auto;
  height: fit-content;
  max-width: 380px;
  width: 100%;
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
