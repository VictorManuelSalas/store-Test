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
          ? 'mdi-account-check'
          : alert.method === 'warning'
          ? 'mdi-account-alert'
          : 'mdi-account-remove'
      "
      id="alert"
    >
      <v-row align="center">
        <v-col class="grow">
          {{ alert.text }}
        </v-col>
        <v-col class="shrink">
          <v-btn
            @click="
              alert.method == 'info'
                ? $router.push('/home/admin')
                : (alert.value = false)
            "
          >
            Understand
          </v-btn>
        </v-col>
      </v-row>
    </v-alert>
    <v-card id="card" :loading="loading" class="ma-6">
      <template slot="progress">
        <v-progress-linear height="5" indeterminate></v-progress-linear>
      </template>

      <v-card-title class="pl-6">
        <h2>Create new user</h2>
      </v-card-title>
      <v-card-text class="pl-0 pr-0">
        <v-form id="form" v-model="valid">
          <v-row class="pl-6">
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
              <v-text-field
                filled
                v-model="data.phoneNumber"
                :counter="10"
                :rules="phoneRule"
                label="Phone Number"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" ms="4">
              <v-select
                required
                filled
                :items="rolesValues"
                label="Role"
                v-model="data.role"
              ></v-select>
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
              <v-autocomplete
                v-model="data.accountID"
                :rules="accountIDRule"
                :items="odooCustomers"
                filled
                chips
                color="blue-grey lighten-2"
                label="Account ID"
                item-text="id"
                item-value="id"
                multiple
                required
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    close
                    @click="data.select"
                    @click:close="removeAccountId(data.item)"
                  >
                    <v-avatar left>
                      <img
                        :src="'data:image/png;base64,' + data.item.avatar_128"
                        :alt="data.item.name"
                      />
                    </v-avatar>
                    {{ data.item.name }}
                  </v-chip>
                </template>
                <template v-slot:item="data">
                  <template v-if="typeof data.item !== 'object'">
                    <v-list-item-content
                      v-text="data.item"
                    ></v-list-item-content>
                  </template>
                  <template v-else>
                    <v-list-item-avatar>
                      <img
                        :src="'data:image/png;base64,' + data.item.avatar_128"
                      />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title
                        v-html="data.item.name"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        v-html="data.item.email || 'null'"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="6" ms="0"></v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-container fluid class="pl-6">
        <v-row align="center">
          <v-col cols="12" sm="12">
            <div id="btns_actions">
              <v-btn
                color="warning"
                large
                dark
                text
                @click="$router.push('/home/admin')"
              >
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
import { uploadImage } from "../../helpers/User";
import { registerUserAndSendCredentials } from "../../helpers/Auth";
import { getUserByEmail } from "../../helpers/UserQuery";

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
    rolesValues: ["admin", "client"],
    data: {
      accountID: null,
      firstname: "",
      lastname: "",
      email: "",
      phoneNumber: "",
      avatar: [],
      role: "",
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
    accountIDRule: [(v) => !!v || "Account ID is required"],
  }),
  computed: {
    odooCustomers() {
      return this.$store.getters.getCustomersOdoo;
    },
  },
  mounted() {},
  methods: {
    removeAccountId(item) {
      const index = this.data.accountID.indexOf(item.id);
      if (index >= 0) this.data.accountID.splice(index, 1);
    },
    alertProcess(text, method) {
      this.alert = {
        value: true,
        text,
        method,
      };
    },
    async signUp() {
      this.loading = true;
      const searchCustomer = await getUserByEmail(this.data.email);
      if (searchCustomer.length > 0) {
        this.loading = false;
        this.alertProcess(
          `There is already a customer with the email ${this.data.email}. Please try another email.`,
          "warning"
        );
        return;
      }

      //img verify and upload
      if ("name" in this.data.avatar) {
        this.data.avatar = await uploadImage(this.data.avatar)
          .then((downloadURL) => {
            return downloadURL;
          })
          .catch((error) => {
            console.error("Upload failed:", error);
          });
      }

      console.log("nuevo", this.data);

      const responseCredentialsAuthCreated = await this.createUserAuth(
        this.data
      );
      console.log(
        "responseCredentialsAuthCreated=> ,",
        responseCredentialsAuthCreated
      );
      if (responseCredentialsAuthCreated) {
        this.data = {
          accountID: null,
          firstname: "",
          lastname: "",
          role: "",
          email: "",
          phoneNumber: "",
          avatar: [],
        };
      }
      this.loading = false;
    },

    async createUserAuth(data) {
      const { auth, email, firstname, lastname } = this.$store.getters.getUser;
      const createUserAuthsAndPerfile = await registerUserAndSendCredentials(
        {
          ...data,
          createdBy: { email, name: `${firstname} ${lastname}` },
        },
        auth.token
      );
      console.log(createUserAuthsAndPerfile);
      if (createUserAuthsAndPerfile === "Customer created") {
        this.alertProcess(
          "User created successfully, login password will be sent by email.",
          "info"
        );
        return true;
      }

      this.alertProcess(
        createUserAuthsAndPerfile.includes("invalid-email")
          ? "The email entered is not valid for creating a new user, please try another one."
          : createUserAuthsAndPerfile.includes("email-already-in-use")
          ? "The email entered for creating credentials is already in use by another user. Please verify your email and try again."
          : createUserAuthsAndPerfile,
        "error"
      );

      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  margin: auto;
  width: clamp(60%, 100%, 100%);
  #card {
    width: 95%;
  }
}
#btns_actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 0px 1rem;
}

#alert {
  position: sticky;
  top: 0px;
  z-index: 200;
}
</style>
