<template>
  <div v-if="!firebaseVerificationData">
    <v-alert prominent :type="alert.method === 'info' ? 'info' : 'error'" :value="alert.value"
      transition="scale-transition" icon="mdi-email">
      <v-row align="center">
        <v-col class="grow">
          {{ alert.text }}
        </v-col>
        <v-col class="shrink">
          <v-btn @click="
            (alert.method === 'info' ? $router.push('/') : null) +
            (alert = {
              value: false,
              text: '',
              method: '',
            })
            ">Understand</v-btn>
        </v-col>
      </v-row>
    </v-alert>
    <v-card :loading="loading" class="mx-auto my-12">
      <template slot="progress">
        <v-progress-linear height="5" indeterminate></v-progress-linear>
      </template>

      <v-img height="150" src="../assets/background3.jpg"></v-img>

      <v-card-title class="pl-6">
        <h2>Search</h2>
      </v-card-title>
      <v-card-text class="pl-0 pr-0">
        <p class="pl-6 mb-0">
          Find your account with the email address you used to create it.
        </p>
        <v-form class="mb-0">
          <v-container>
            <v-row>
              <v-col cols="12" md="12" ms="4">
                <v-text-field v-model="email" :rules="emailRules" label="E-mail" required filled
                  append-icon="mdi-account-search" @click:append="getUserAccount()"></v-text-field>
              </v-col>
              <v-col cols="12" md="12" ms="4" v-if="users.length > 0 && users[0] !== false">
                <b class="mx-auto">Select an user</b>
                <v-radio-group v-model="userAccount">
                  <v-radio v-for="user in users" :key="user.email" :label="`${user.firstname} ${user.lastname}`"
                    :value="user">
                  </v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" md="12" ms="4" v-else-if="users[0] === false">
                <b class="mx-auto my-12 alert-notfound">No account was found with that email address.</b>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-container fluid class="pa-0">
        <v-row align="center">
          <v-col cols="12" sm="12">
            <div id="btns_actions">
              <v-btn color="warning" large dark text @click="$router.push('/')">
                Cancel
              </v-btn>
              <v-btn color="primary" large :disabled="!userAccount" @click="sendEmail()">
                Send Email
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>

  <div v-else-if="mode === 'resetPassword'">
    <v-alert prominent :type="alert.method === 'info' ? 'info' : 'error'" :value="alert.value"
      transition="scale-transition" icon="mdi-email">
      <v-row align="center">
        <v-col class="grow">
          {{ alert.text }}
        </v-col>
        <v-col class="shrink">
          <v-btn @click="
            alert.method === 'info'
              ? $router.push('/')
              : $router.push('/auth/process') + (alert.value = false)
            ">Understand</v-btn>
        </v-col>
      </v-row>
    </v-alert>
    <v-card :loading="loading" class="mx-auto my-12">
      <template slot="progress">
        <v-progress-linear height="5" indeterminate></v-progress-linear>
      </template>
      <v-img height="150" src="../assets/background3.jpg"></v-img>

      <v-card-title class="pl-6">
        <h2>Change Password</h2>
      </v-card-title>
      <v-card-text class="pl-0 pr-0">
        <p class="pl-6 mb-0">
          Enter the new credentials for your account, verify that your new
          password matches the verification.
        </p>
        <v-form class="mb-0" v-model="valid">
          <v-container>
            <v-row>
              <v-col cols="12" md="12" ms="4">
                <v-text-field v-model="passwordData.newPassword" :rules="passwordRule"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'"
                  name="New Password" label="New Password" hint="At least 8 characters" counter filled
                  @click:append="show1 = !show1"></v-text-field>
              </v-col>
              <v-col cols="12" md="12" ms="4">
                <v-text-field v-model="passwordData.verificationPassword" :rules="passwordRule"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" :type="show2 ? 'text' : 'password'"
                  name="Verification Password" label="Verification Password" hint="At least 8 characters" counter filled
                  @click:append="show2 = !show2"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-container fluid class="pa-0">
        <v-row align="center">
          <v-col cols="12" sm="12">
            <div id="btns_actions">
              <v-btn color="warning" large dark text @click="$router.push('/')">
                Cancel
              </v-btn>
              <v-btn color="primary" large :disabled="!verificationPasswordRule || !valid" @click="chagePassword()">
                Save
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>

  <div v-else>
    <v-alert prominent :type="alert.method === 'info' ? 'info' : 'error'" :value="alert.value"
      transition="scale-transition" icon="mdi-email">
      <v-row align="center">
        <v-col class="grow">
          {{ alert.text }}
        </v-col>
        <v-col class="shrink">
          <v-btn @click="
            alert.method === 'info'
              ? closeWindow()
              : $router.push('/auth/process') + (alert.value = false)
            ">Understand</v-btn>
        </v-col>
      </v-row>
    </v-alert>
    <v-card :loading="loading" class="mx-auto my-12">
      <template slot="progress">
        <v-progress-linear height="5" indeterminate></v-progress-linear>
      </template>
      <v-img height="150" src="../assets/background3.jpg"></v-img>

      <v-card-title class="pl-6">
        <h2>Email Verification</h2>
      </v-card-title>
      <v-card-text class="pl-0 pr-0">
        <p class="pl-6 mb-0">
          Thank you for registering with us! To complete your registration,
          please verify your email address.
        </p>
      </v-card-text>
      <v-container fluid class="pa-0">
        <v-row align="center">
          <v-col cols="12" sm="12">
            <div id="btns_actions">
              <v-btn color="warning" large dark text @click="$router.push('/')">
                Cancel
              </v-btn>
              <v-btn color="primary" large @click="verifyEmail()">
                Verify
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import sendTemplatePasswordResetEmail from "../helpers/SendTemplatesAuth";
import { getUserByEmail } from "../helpers/UserQuery";
import { handleResetPassword } from "../helpers/Auth";
import { handleVerifyEmail } from "../helpers/Auth";

export default {
  data: () => ({
    show1: false,
    show2: false,
    loading: false,
    selection: 1,
    alert: {
      value: false,
      text: "",
      method: "",
    },
    valid: false,
    userAccount: "",
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
    users: [],
    passwordData: { newPassword: null, verificationPassword: null },
    passwordRule: [
      (v) =>
        (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+/.test(
          v
        ) &&
          v.length >= 8) ||
        "Password must contain lowercase, uppercase, and special characters",
    ],
  }),
  computed: {
    mode() {
      return this.$route.query.mode;
    },
    oobCode() {
      return this.$route.query.oobCode;
    },
    apiKey() {
      return this.$route.query.apiKey;
    },
    lang() {
      return this.$route.query.lang;
    },
    verificationPasswordRule() {
      if (
        this.passwordData.newPassword === this.passwordData.verificationPassword
      ) {
        return true;
      }
      return false;
    },
    firebaseVerificationData() {
      if (this.mode && this.oobCode && this.apiKey && this.lang) {
        return true;
      }
      return false;
    },
  },
  mounted() { },
  methods: {
    closeWindow() {
      window.close()
    },

    async sendEmail() {
      this.loading = true;

      const sendEmailTempResponse = await sendTemplatePasswordResetEmail(
        this.userAccount.email
      );

      if (sendEmailTempResponse !== "Email was send it") {
        this.alert = {
          value: true,
          text: "There was a problem sending the email, please try again.",
          method: "error",
        };
        this.loading = false;
        return;
      }
      this.alert = {
        value: true,
        method: "info",
        text: "Instructions to change your account password have been sent to your email.",
      };

      this.loading = false;
    },

    async getUserAccount() {
      this.loading = true;
      const clientData = await getUserByEmail(this.email);

      if (clientData) {
        this.loading = false;
        this.users = clientData.length > 0 ? clientData : [false];
      }
    },

    async chagePassword() {
      this.loading = true;
      const response = await handleResetPassword(
        this.oobCode,
        this.passwordData.newPassword
      );
      this.loading = false;
      if (response === undefined) {
        this.alert = {
          value: true,
          method: "info",
          text: "Password changed successfully.",
        };
        return;
      }

      this.alert = {
        value: true,
        method: "error",
        text: "Invalid or expired action code, please try generating the process again.",
      };
    },

    async verifyEmail() {
      this.loading = true;
      const response = await handleVerifyEmail(this.oobCode);
      this.loading = false;
      if (response === undefined) {
        // await updateUser({ userVerify: true });
        this.alert = {
          value: true,
          method: "info",
          text: "Thank you for verifying your email. We're excited to have you on board!",
        };
        return;
      }

      this.alert = {
        value: true,
        method: "error",
        text: "Invalid or expired action code, please try generating the process again.",
      };
    },
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

.alert-notfound {
  color: red;
}
</style>
