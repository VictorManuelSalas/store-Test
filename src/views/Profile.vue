<template>
  <div>
    <v-alert
      prominent
      :type="
        alert.method === 'info'
          ? 'info'
          : alert.method === 'warning'
          ? 'warning'
          : 'error'
      "
      :value="alert.value"
      transition="scale-transition"
      :icon="
        alert.method === 'info'
          ? 'mdi-check'
          : alert.method === 'warning'
          ? 'mdi-alert'
          : 'mdi-alert-circle'
      "
      id="alert"
    >
      <v-row align="center">
        <v-col class="grow">
          {{ alert.text }}
        </v-col>
      </v-row>
    </v-alert>

    <v-card :loading="loading" class="ma-1 pb-10" max-width="100%">
      <template slot="progress">
        <v-progress-linear
          color="yellow darken-2"
          height="8"
          indeterminate
        ></v-progress-linear>
      </template>

      <section id="avatar-section">
        <div>
          <v-btn id="btn-pass" outlined @click="dialog = true">
            <v-icon left>mdi-security</v-icon>
            Change Password
          </v-btn>
        </div>
        <div>
          <v-avatar size="80">
            <img v-if="userInfo?.avatar.length > 0" :src="userInfo?.avatar" />
            <span id="initials" v-else>{{ initialsName.substring(0, 2) }}</span>
          </v-avatar>
          <v-card-title class="text-h4"
            >{{ userInfo?.firstname || "user name" }}
            {{ userInfo?.lastname || "user lastname" }}</v-card-title
          >
        </div>
      </section>

      <v-card-title class="mx-4">Profile Information</v-card-title>
      <v-divider class="mx-4"></v-divider>
      <v-card-text class="mx-4 pt-8">
        <v-row
          ><v-col cols="12" sm="4" xl="6"
            >Account ID (Odoo):
            {{ userInfo?.accountID.join(", ") || "-" }}</v-col
          >
          <v-col cols="12" sm="4" xl="6"
            >Email: {{ userInfo?.email || "-" }}</v-col
          ><v-col cols="12" sm="4" xl="6"
            >Phone: {{ userInfo?.phoneNumber || "-" }}</v-col
          ><v-col cols="12" sm="4" xl="6"
            >Role: {{ userInfo?.role || "-" }}</v-col
          >
          <v-col cols="12" sm="4" xl="6"
            >Modified Date:
            {{ convertTimestampToDate(userInfo?.modifiedAt || "-") }}</v-col
          >

          <v-col cols="12" sm="4" xl="6"
            >Created Date:
            {{ convertTimestampToDate(userInfo?.createAt || "-") }}</v-col
          >
          <v-col cols="12" sm="4" xl="6"
            ><span style="display: flex"
              >Modified By:
              <div style="width: 70%">
                {{ userInfo?.modifiedBy?.name || "-" }} <br />
                {{ userInfo?.modifiedBy?.email || "-" }}
              </div></span
            >
          </v-col>
          <v-col cols="12" sm="4" xl="6">
            <span style="display: flex"
              >Created By:
              <div style="width: 70%">
                {{ userInfo.createdBy?.name || "-" }} <br />
                {{ userInfo.createdBy?.email || "-" }}
              </div></span
            >
          </v-col>
          <v-col cols="12" sm="4" xl="6"></v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card :loading="loadingModal">
        <template slot="progress">
          <v-progress-linear
            color="yellow darken-2"
            height="8"
            indeterminate
          ></v-progress-linear>
        </template>
        <v-card-title
          ><v-icon left>mdi-security</v-icon>
          <span class="text-h5">Change Password</span>
        </v-card-title>
        <v-card-text>
          <p>
            Enter the new credentials for your account, verify that your new
            password matches the verification.
          </p>

          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-row>
                <v-col cols="12" md="12" ms="4">
                  <v-text-field
                    v-model="passwordData.newPassword"
                    :rules="passwordRule"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    name="New Password"
                    label="New Password"
                    hint="At least 8 characters"
                    counter
                    filled
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12" ms="4">
                  <v-text-field
                    v-model="passwordData.verificationPassword"
                    type="text"
                    name="Verification Password"
                    label="Verification Password"
                    hint="At least 8 characters"
                    counter
                    filled
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="
              (dialog = false) +
                (passwordData.newPassword = null) +
                (passwordData.verificationPassword = null)
            "
          >
            Cancel
          </v-btn>
          <v-btn
            :disabled="!verificationPasswordRule"
            @click="changePassword"
            color="primary"
          >
            Change
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { changePasswordUser, refreshToken } from "../helpers/Auth";
export default {
  data() {
    return {
      alert: {
        value: false,
        text: "",
        method: "",
      },
      valid: false,
      loading: true,
      loadingModal: false,
      dialog: false,
      showPassword: false,
      passwordData: { newPassword: null, verificationPassword: null },
      passwordRule: [
        (v) =>
          (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+/.test(
            v
          ) &&
            v.length >= 8) ||
          "Password must contain lowercase, uppercase, and special characters",
      ],
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters.getUser;
    },
    initialsName() {
      const fullName = `${this.userInfo.firstname} ${this.userInfo.lastname}`;
      const words = fullName.split(" ");
      const initials = words.map((word) => word.charAt(0));
      const initialsString = initials.join("");
      return initialsString;
    },
    verificationPasswordRule() {
      if (
        this.passwordData.newPassword &&
        this.passwordData.newPassword === this.passwordData.verificationPassword
      ) {
        return true;
      }
      return false;
    },
  },

  async mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1500);
  },
  methods: {
    alertProcess(text, method) {
      this.dialog = false;
      this.alert = {
        value: true,
        text,
        method,
      };

      setTimeout(() => {
        this.alert.value = false;
      }, 4000);
    },

    convertTimestampToDate(timestamp) {
      if (typeof timestamp === "string") {
        return "-";
      }
      const { seconds, nanoseconds } = timestamp;
      const milliseconds = seconds * 1000;
      const additionalMilliseconds = nanoseconds / 1000000;
      const date = new Date(milliseconds + additionalMilliseconds);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const second = String(date.getSeconds()).padStart(2, "0");
      const ampm = hours >= 12 ? "pm" : "am";

      hours = hours % 12;
      hours = hours ? hours : 12;
      hours = String(hours).padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}:${second} ${ampm}`;
    },

    async changePassword() {
      this.loadingModal = true;
      const { authID, auth } = this.userInfo;
      const { newPassword } = this.passwordData;

      const changeResponse = await changePasswordUser(
        {
          uid: authID,
          password: newPassword,
        },
        auth
      );

      if ("message" in changeResponse && changeResponse.message === "403") {
        this.refreshAndSaveToken(auth);
        return;
      }

      if (changeResponse.status !== 200) {
        this.loadingModal = false;
        this.alertProcess(changeResponse, "error");
        return;
      }
      this.loadingModal = false;
      this.alertProcess(changeResponse.body.info, "info");
      return;
    },

    async refreshAndSaveToken(auth) {
      const newTokens = await refreshToken(auth);
      if ("access_token" in newTokens) {
        this.$store.dispatch("fetchUserTokens", newTokens.access_token);
        setTimeout(() => {
          this.changePassword();
        }, 2000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  width: 100%;
  margin: auto;
  overflow-x: hidden;
  #avatar-section {
    height: 30vh;
    background-image: url("../assets/backgroun2.jpg");
    background-repeat: none;
    background-size: cover;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-direction: column;
    padding: 20px 30px;
    div:nth-of-type(1) {
      justify-content: right;
    }
    div {
      width: 100%;
      display: flex;
      align-items: center;
      #initials {
        background-color: rgb(0, 0, 0);
        width: 100%;
        height: 100%;
        border-radius: 100%;
        font-size: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }
    }
  }
}
</style>
