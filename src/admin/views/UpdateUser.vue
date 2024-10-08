<template>
  <div>

    <v-card id="card" :loading="loading" class="ma-6 pt-5">
      <template slot="progress">
        <v-progress-linear height="5" indeterminate></v-progress-linear>
      </template>

      <v-card-title class="pl-6">
        <v-btn color="info" fab dark text @click="$router.push('/home/admin')">
          <v-icon>mdi-keyboard-backspace</v-icon>
        </v-btn>
        <h2>Update user</h2>
      </v-card-title>
      <v-card-text class="pl-0 pr-0 pa-2">
        <v-form id="form" v-model="valid">
          <v-row class="pl-6">
            <v-col cols="12" md="12" ms="12">
              <div v-if="typeof customerData.avatar === 'string'" class="circular-image" :style="{
                backgroundImage: `url(${customerData.avatar})`,
              }"></div>
            </v-col>
            <v-col cols="12" md="6" ms="4">
              <v-file-input filled v-model="customerData.avatar" accept="image/png, image/jpeg"
                placeholder="Pick an avatar" prepend-icon="mdi-camera" :label="customerData.avatar !== null && customerData.avatar.length > 0
                  ? customerData.avatar
                  : 'Avatar'
                  "></v-file-input>
            </v-col>

            <v-col cols="12" md="6" ms="4">
              <v-text-field v-model="customerData.firstname" :rules="nameRules" label="First name" required
                filled></v-text-field>
            </v-col>

            <v-col cols="12" md="6" ms="4">
              <v-text-field v-model="customerData.lastname" :rules="nameRules" label="Last name" required
                filled></v-text-field>
            </v-col>

            <v-col cols="12" md="6" ms="4">
              <v-text-field v-model="customerData.email" :rules="emailRules" label="E-mail" required
                filled></v-text-field>
            </v-col>

            <v-col cols="12" md="6" ms="4">
              <v-text-field filled v-model="customerData.phoneNumber" :counter="10" :rules="phoneRule"
                label="Phone Number" required></v-text-field>
            </v-col>
            <v-col cols="12" md="6" ms="4">
              <v-select required filled :items="rolesValues" label="Role" v-model="role_selected"></v-select>
            </v-col>
            <v-col cols="12" md="6" ms="4">
              <v-autocomplete v-model="customerData.accountID" :rules="accountIDRule" :items="odooCustomers" filled
                chips color="blue-grey lighten-2" label="Account ID" item-text="name" item-value="id" multiple required
                :filter="customFilterCustomers">
                <template v-slot:selection="customerData">
                  <v-chip v-bind="customerData.attrs" :input-value="customerData.selected" close
                    @click="customerData.select" @click:close="removeAccountId(customerData.item)">
                    <v-avatar left>
                      <img :src="'data:image/png;base64,' +
                        customerData.item.avatar_128
                        " :alt="customerData.item.name" />
                    </v-avatar>
                    {{ customerData.item.name }}
                  </v-chip>
                </template>
                <template v-slot:item="customerData">
                  <template v-if="typeof customerData.item !== 'object'">
                    <v-list-item-content v-text="customerData.item"></v-list-item-content>
                  </template>
                  <template v-else>
                    <v-list-item-avatar>
                      <img :src="'data:image/png;base64,' +
                        customerData.item.avatar_128
                        " />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-html="customerData.item.name"></v-list-item-title>
                      <v-list-item-subtitle v-html="customerData.item.email || 'null'"></v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>



            </v-col>
            <v-col cols="12" md="6" ms="0">
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-container fluid class="pl-6">
        <v-row align="center">
          <v-col cols="12" sm="12">
            <div :class="alertStyle" id="alert" v-show="alert.value">
              <v-icon large v-show="alert.value">{{ alert.method === 'info'
                ? 'mdi-account-check'
                : alert.method === 'warning'
                  ? 'mdi-account-alert'
                  : 'mdi-account-remove'
                }}</v-icon>
              <strong>{{ alert.text }}</strong>
            </div>
          </v-col>
          <v-col cols="12" sm="12">
            <div id="btns_actions">
              <v-btn color="warning" large dark text @click="$router.push('/home/admin')">
                Cancel
              </v-btn>
              <v-btn color="primary" large :disabled="!valid" @click="saveChanges()">
                Save
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { updateUser } from "../../helpers/User";
import { getUserByEmail } from "../../helpers/UserQuery";

export default {
  props: {
    customerData: {
      type: Object,
      default: {},
    },
  },
  data: () => ({
    loading: false, search: null,
    alert: {
      value: false,
      text: "",
      method: "",
    },
    valid: false,
    rolesValues: ["Admin", "Client"],
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => v.length >= 3 || "Name must be more than 3 characters",
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
    emailCustomer: null,
    imgCustomer: null,
    role_selected: null,
  }),
  computed: {
    odooCustomers() {
      return this.$store.getters.getCustomersOdoo;
    },
    alertStyle() {
      return {
        correct: this.alert.method === 'info',
        warn: this.alert.method === 'warning',
        err: this.alert.method === 'error'
      };
    }
  },
  watch: {
    role_selected(newVal, oldVal) {
      this.customerData.role = newVal.toLowerCase()
    }
  },
  mounted() {
    this.emailCustomer = this.customerData.email;
    this.imgCustomer = this.customerData.avatar;
    this.role_selected = this.customerData.role
  },
  methods: {
    customFilterCustomers(item, queryText, itemText) {
      const name = item.name.toString().toLowerCase()
      const id = item.id.toString().toLowerCase()
      const searchText = queryText.toLowerCase()

      return name.indexOf(searchText) > -1 ||
        id.indexOf(searchText) > -1
    },
    removeAccountId(item) {
      const index = this.customerData.accountID.indexOf(item.id);
      if (index >= 0) this.customerData.accountID.splice(index, 1);
    },
    async saveChanges() {
      this.loading = true;
      const verifyEmailResp =
        this.customerData.email !== this.emailCustomer
          ? await this.verifyEmailCustomer()
          : false;

      if (verifyEmailResp) {
        return;
      }

      const imgChanged =
        this.customerData.avatar !== this.imgCustomer &&
          this.imgCustomer.length !== 0
          ? this.imgCustomer
          : false;

      const { email, firstname, lastname } = this.$store.getters.getUser;
      console.log("data antes de enviar ", this.customerData);
      const updateUserResponse = await updateUser(
        this.customerData.id,
        {
          ...this.customerData,
          modifiedBy: { email, name: `${firstname} ${lastname}` },
        },
        imgChanged,
        ""
      );
      console.log(updateUserResponse);

      this.loading = false;
      if (updateUserResponse.status !== 200) {
        this.alertProcess(updateUserResponse, "error");
        return;
      }
      const emailLogUser = this.$store.getters.getUser.email;
      this.emailCustomer === emailLogUser
        ? this.$store.dispatch("fetchUser", updateUserResponse.customer)
        : null;
      this.alertProcess("User updated", "info");
      return;
    },
    async verifyEmailCustomer() {
      const searchCustomer = await getUserByEmail(this.customerData.email);
      if (searchCustomer.length > 0) {
        this.loading = false;
        this.alertProcess(
          `There is already a customer with the email ${this.customerData.email}. Please try another email.`,
          "warning"
        );
        return true;
      }
      return false;
    },
    alertProcess(text, method) {
      this.alert = {
        value: true,
        text,
        method,
      };

      setTimeout(() => {
        this.alert = {
          value: false,
          text: '',
          method: '',
        };
      }, 3000)
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
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 5px 0px;
}

.correct {
  background-color: #BBDEFB;
  color: #2196F3;
}

.warn {
  background-color: #FFE0B2;
  color: #FFA726;
}

.err {
  background-color: #FFCCBC;
  color: #FF3D00;
}

.circular-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin-bottom: 10px;
}

@media (max-width: 650px) {
  div {
    display: flex;
    flex-direction: column;

    #card {
      width: 90%;
      height: fit-content;
    }
  }
}
</style>
