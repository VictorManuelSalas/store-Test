<template>
  <div>
    <v-alert
      prominent
      :type="alert.method == 'info' ? 'info' : 'error'"
      :value="alert.value"
      transition="scale-transition"
      icon="mdi-account-check"
    >
      <v-row align="center">
        <v-col class="grow">
          {{ alert.text }}
        </v-col>
        <v-col class="shrink">
          <v-btn
            @click="
              alert.method == 'info' ? $router.push('/') : (alert.value = false)
            "
          >
            Understand
          </v-btn>
        </v-col>
      </v-row>
    </v-alert>
    <v-card :loading="loading" class="mx-auto my-12">
      <template slot="progress">
        <v-progress-linear height="5" indeterminate></v-progress-linear>
      </template>

      <v-img height="150" src="../assets/backgroun2.jpg"></v-img>

      <v-card-title class="pl-6">
        <h2>Sign Up</h2>
      </v-card-title>
      <v-card-text class="pl-0 pr-0">
        <v-form v-model="valid">
          <v-container>
            <v-row>
              <v-col cols="12" md="6" ms="4">
                <v-text-field
                  v-model="data.accoundID"
                  :rules="accountIDRule"
                  label="Account ID"
                  required
                  filled
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" ms="4">
                <v-text-field
                  v-model="data.firstname"
                  :rules="nameRules"
                  label="First name"
                  required
                  filled
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" ms="4">
                <v-text-field
                  v-model="data.lastname"
                  :rules="nameRules"
                  label="Last name"
                  required
                  filled
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" ms="4">
                <v-text-field
                  v-model="data.email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                  filled
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" ms="4">
                <v-file-input
                  filled
                  v-model="data.avatar"
                  accept="image/png, image/jpeg"
                  placeholder="Pick an avatar"
                  prepend-icon="mdi-camera"
                  label="Avatar"
                ></v-file-input>
              </v-col>
              <v-col cols="12" md="6" ms="4">
                <v-text-field
                  filled
                  v-model="data.phoneNumber"
                  :counter="10"
                  :rules="phoneRule"
                  label="Phone Number"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-container fluid class="pa-0">
        <v-row align="center">
          <v-col cols="12" sm="12">
            <div id="btns_actions">
              <v-btn color="warning" large dark text @click="$router.push('/admin/home/admin')">
                Cancel
              </v-btn>
              <v-btn color="primary" large :disabled="!valid" @click="signUp()">
                Sign Up
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { createUser } from "../helpers/User";
import { registerUserAndSendVerificationEmail } from "../helpers/Auth";
// import getAdmins from "../helpers/GetAdmins";
export default {
  data: () => ({
    loading: false,
    selection: 1,
    alert: {
      value: false,
      text: "",
      method: "",
    },
    valid: false,
    data: {
      accoundID: null,
      firstname: "",
      lastname: "",
      role: "client",
      email: "",
      phoneNumber: "",
      avatar: [],
    },
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => v.length >= 5 || "Name must be more than 5 characters",
    ],

    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],

    phoneRule: [
      (v) => !!v || "Phone number is required",
      (v) => /^\d{10}$/.test(v) || "Phone must be valid",
    ],
    accountIDRule: [
      (v) => !!v || "Account ID is required",
      (v) => /^\d+$/.test(v) || "Account ID must contain only numbers",
    ],
  }),

  mounted() {},
  methods: {
    async signUp() {
      this.loading = true;
      const createUserResponse = await createUser(this.data);

      if (createUserResponse.hasOwnProperty("id")) {
        const responseCredentialsAuthCreated = await this.createUserAuth(
          this.data.email
        );
        responseCredentialsAuthCreated
          ? (this.alert.value = true)
          : (this.alert = {
              value: true,
              text: createUserResponse,
              method: "error",
            });

        this.data = {
          accoundID: null,
          firstname: "",
          lastname: "",
          role: "client",
          email: "",
          phoneNumber: "",
          avatar: [],
        };
      }
      this.loading = false;
    },

    async createUserAuth(email) {
      const newPassword = await this.generateRandomPassword(12);
      const createUserAuths = await registerUserAndSendVerificationEmail(
        email,
        newPassword
      );
      if (createUserAuths.hasOwnProperty("email")) {
        this.alert = {
          value: false,
          text: "User created successfully, login password will be sent to email.",
          method: "info",
        };
        return true;
      }
      this.alert = {
        value: true,
        text: createUserAuths.includes("invalid-email")
          ? "The email entered is not valid for creating a new user, please try another one."
          : createUserAuths.includes("email-already-in-use")
          ? "The email entered for creating credentials is already in use by another user. Please verify your email and try again."
          : createUserAuths,
        method: "error",
      };
      return false;
    },
    generateRandomPassword(length) {
      const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+<>?";
      let password = "";

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }

      return password;
    },
    // async notifyAdmins() {
    //   console.log(await getAdmins());

    //   this.alert = {
    //     value: true,
    //     text: "User created successfully, login password will be sent to email.",
    //   };
    // },
  },
};
</script>

<style lang="scss" scoped>
div {
  margin: auto;
  width: clamp(300px, 100%, 800px);
}
#btns_actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
