<template>
  <main>
    <div id="dialog" v-if="!dialogAttribute.hidde">
      <div class="dialog-content">
        <h2>
          {{ dialogAttribute.type === "delete" ? "Delete" : "Archive" }}
          Customer Confirmation
        </h2>
        <p>
          Are you sure you want to
          {{ dialogAttribute.type === "delete" ? "delete" : "archive" }} the
          customer?
        </p>
        <span>
          <button
            id="close-dialog"
            @click="dialogAttribute.hidde = !dialogAttribute.hidde"
          >
            Cancel
          </button>
          <button
            id="accept-dialog"
            :disabled="dialogAttribute.item ? false : true"
            @click="
              dialogAttribute.type === 'delete'
                ? deleteCustomer()
                : archiveCustomer()
            "
          >
            {{ deleteLoader ? "Loading..." : "Acept" }}
          </button>
        </span>
      </div>
    </div>

    <div v-if="alert.value">
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
        </v-row>
      </v-alert>
    </div>
    <div>
      <span id="title-view">
        <v-btn
          id="btn"
          color="warning"
          elevation="5"
          large
          :loading="loadingOdooCustomers"
          :disabled="adminOptionsEnabled"
          @click="$router.push('/home/create-user')"
          >New User
          <template v-slot:loader>
            <span>Loading...</span>
          </template>
        </v-btn>
        <section>
          <h1 class="ml-5">Customers</h1>
          <ArchivedCustomers
            v-if="customersArchived.length > 0"
            :customers="customersArchived"
            @unarchiveCustomer="unarchiveCustomer"
          />
        </section>
      </span>
      <v-data-table
        id="table"
        :headers="headers"
        :items="customers"
        item-key="customers.name"
        class="elevation-1"
        :search="search"
        :loading="customers.length == 0 && customerProcessSearch"
        loading-text="Loading... Please wait"
      >
        <template v-slot:item.firstname="{ item }">
          <router-link :to="`/home/user/${item.id}`">
            {{ item.firstname }}</router-link
          >
        </template>
        <template v-slot:item.accountID="{ item }">
          <p
            :style="
              item.accountID.length > 0 ? 'color: black;' : 'opacity: 0.5;'
            "
          >
            {{ item.accountID.length > 0 ? item.accountID.join(", ") : "null" }}
          </p>
        </template>
        <template v-slot:item.role="{ item }">
          <v-chip :color="item.role === 'admin' ? 'green' : 'orange'" dark>
            {{ item.role }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-tooltip top max-width="fit-content" color="orange">
            <template v-slot:activator="{ on, attrs }">
              <svg
                class="icons-actions"
                v-bind="attrs"
                v-on="on"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
                @click="
                  dialogAttribute = {
                    item: item.id,
                    hidde: false,
                    type: 'archive',
                  }
                "
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path
                  d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zm-8.89 11.92L6.5 12H10v-2h4v2h3.5l-5.15 5.15c-.19.19-.51.19-.7 0zM5.12 5l.81-1h12l.94 1H5.12z"
                />
              </svg>
            </template>
            <span>Archive</span>
          </v-tooltip>
          <v-tooltip
            top
            max-width="fit-content"
            color="amber"
            v-if="!adminOptionsEnabled"
          >
            <template v-slot:activator="{ on, attrs }">
              <router-link
                :to="{ name: 'update-user', params: { customerData: item } }"
              >
                <svg
                  class="icons-actions"
                  v-bind="attrs"
                  v-on="on"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path
                    d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                  />
                </svg>
              </router-link>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip top max-width="fit-content" color="red">
            <template v-slot:activator="{ on, attrs }">
              <svg
                class="icons-actions"
                v-bind="attrs"
                v-on="on"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
                @click="
                  dialogAttribute = {
                    item: item,
                    hidde: false,
                    type: 'delete',
                  }
                "
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path
                  d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z"
                />
              </svg>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </template>

        <template v-slot:top>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            solo
          ></v-text-field>
        </template>
      </v-data-table>
    </div>
  </main>
</template>

<script>
import { refreshToken } from "../../helpers/Auth";
import { getAllCustomers } from "../../helpers/UserQuery";
import { getAllCustomersOdoo } from "../../helpers/Odoo/Customers";
import { deleteUser } from "../../helpers/User";
import ArchivedCustomers from "../components/ArchivedCustomers.vue";
import { updateUser } from "../../helpers/User";
export default {
  components: {
    ArchivedCustomers,
  },
  data() {
    return {
      active: true,
      alert: {
        value: false,
        text: "",
        method: "",
      },
      dialogAttribute: {
        type: null,
        hidde: true,
        item: null,
      },
      deleteLoader: false,
      search: "",
      customers: [],
      customersArchived: [],
      customerProcessSearch: true,
      loadingOdooCustomers: false,
      adminOptionsEnabled: false,
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "First Name",
          align: "start",
          sortable: true,
          value: "firstname",
        },
        { text: "Last Name", value: "lastname", sortable: true },
        {
          text: "Account ID",
          value: "accountID",
          sortable: true,
        },
        { text: "Email", value: "email", sortable: true },
        { text: "Role", value: "role", sortable: true, align: "center" },
        { text: "Actions", value: "actions", sortable: false, align: "center" },
      ];
    },
  },
  mounted() {
    this.getCustomers();
    if (this.$store.getters.getCustomersOdoo.length === 0) {
      this.loadingOdooCustomers = true;
      this.adminOptionsEnabled = true;
      this.getCustomersOdoo();
    }
  },
  methods: {
    alertProcess(text, method) {
      this.dialogAttribute.hidde = true;
      this.alert = {
        value: true,
        text,
        method,
      };

      setTimeout(() => {
        this.alert.value = false;
      }, 4000);
    },
    async getCustomers() {
      console.log("obteniendo usuarios...");
      const customersResponse = await getAllCustomers();
      if (customersResponse) {
        this.customers = customersResponse.filter(
          (item) => item.archived === false
        );
        this.customersArchived = customersResponse.filter(
          (item) => item.archived === true
        );
      }
      console.log(customersResponse);
    },

    async deleteCustomer() {
      this.deleteLoader = true;
      const emailLoginUser = this.$store.getters.getUser.email;
      const { item } = this.dialogAttribute;
      item.email === emailLoginUser
        ? console.log(" no se puede eliminar ")
        : null;
      const imgDelete = typeof item.avatar === "string" ? item.avatar : false;
      const { auth } = this.$store.getters.getUser;
      const response = await deleteUser(item.id, imgDelete, auth.token);
      console.log("eliminar => ", response);

      if ("message" in response && response.message == 403) {
        this.refreshAndSaveToken(auth, "delete");
        return;
      }

      if (response.resp) {
       this.deleteLoader = false;
        this.dialogAttribute.hidde = true;
        this.getCustomers();
        return;
      }
      this.alertProcess(response, "error");
    },

    async archiveCustomer() {
      const { item } = this.dialogAttribute;
      const { email, firstname, lastname } = this.$store.getters.getUser;
      const archivedStatus = await updateUser(
        item,
        {
          archived: true,
          modifiedBy: { email, name: `${firstname} ${lastname}` },
        },
        false,
        "archive"
      );
      console.log(archivedStatus);
      if (archivedStatus.status === 200) {
        this.dialogAttribute.hidde = true;
        this.getCustomers();
        return;
      }

      this.alertProcess(archivedStatus.error, "error");
    },

    async unarchiveCustomer(id) {
      console.log("desarchivar", id);
      const archivedStatus = await updateUser(
        id,
        { archived: false },
        false,
        "archive"
      );
      console.log(archivedStatus);
      if (archivedStatus.status === 200) {
        this.dialogAttribute.hidde = true;
        this.getCustomers();
      }
    },

    async getCustomersOdoo() {
      console.log("obteniendo customers de odoo...");
      const { auth } = this.$store.getters.getUser;
      const data = await getAllCustomersOdoo(auth.token);
      console.log(data);
      if ("message" in data && data.message == 403) {
        this.refreshAndSaveToken(auth, "odoo");
        return;
      }
      if (data.length > 0) {
        this.$store.dispatch("fetchCustomersOdoo", data);
        this.adminOptionsEnabled = !this.adminOptionsEnabled;
        console.log(this.$store.getters.getCustomersOdoo);
      }
      this.loadingOdooCustomers = false;
    },

    async refreshAndSaveToken(auth, functionName) {
      const newTokens = await refreshToken(auth);
      if ("access_token" in newTokens) {
        this.$store.dispatch("fetchUserTokens", newTokens.access_token);
        setTimeout(() => {
          functionName === "delete"
            ? this.deleteCustomer()
            : this.getCustomersOdoo();
        }, 2000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  width: clamp(60%, 100%, 100%);
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 20px;
  #title-view {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    section {
      h1 {
        font-size: 2rem;
      }
    }
    #btn {
      width: fit-content;
      margin-left: auto;
    }
  }

  #table {
    width: 100%;
    height: 100%;
  }
}

#dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 10;

  .dialog-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    position: relative;
    width: fit-content;
    height: fit-content;

    span {
      display: flex;
      justify-content: space-around;
      button {
        padding: 10px 30px;
        border: none;
        border-radius: 5px;
        color: white;
        cursor: pointer;
        background-color: #0056b3;
        &:hover {
          opacity: 0.9;
        }
      }

      #close-dialog {
        background-color: #9d9d9d;
        &:hover {
          opacity: 0.9;
        }
      }
    }
  }
}

.icons-actions {
  cursor: pointer;
}
</style>
