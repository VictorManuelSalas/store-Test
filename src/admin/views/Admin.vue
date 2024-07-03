<template>
  <div>
    <v-btn
      id="btn"
      color="warning"
      elevation="5"
      large
      @click="$router.push('/admin/home/create-user')"
      >New User</v-btn
    >
    <!-- <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
          New Item
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">xd</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Dessert name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Calories"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Fat (g)"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Carbs (g)"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Protein (g)"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text> Cancel </v-btn>
          <v-btn color="blue darken-1" text> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text>Cancel</v-btn>
          <v-btn color="blue darken-1" text>OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <v-data-table
      id="table"
      :headers="headers"
      :items="customers"
      item-key="name"
      class="elevation-1"
      :search="search"
      :custom-filter="filterOnlyCapsText"
      :loading="customers.length == 0"
      loading-text="Loading... Please wait"
    >
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
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path
                d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zm-8.89 11.92L6.5 12H10v-2h4v2h3.5l-5.15 5.15c-.19.19-.51.19-.7 0zM5.12 5l.81-1h12l.94 1H5.12z"
              />
            </svg>
          </template>
          <span>Archive</span>
        </v-tooltip>
        <v-tooltip top max-width="fit-content" color="amber">
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
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path
                d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              />
            </svg>
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
              @click="deleteCustomer(item.id)"
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

      <!-- <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Search (UPPER CASE ONLY)"
          class="mx-4"
        ></v-text-field>
      </template> -->
    </v-data-table>
  </div>
</template>

<script>
import { getAllCustomers } from "../../helpers/UserQuery";
import { deleteUser } from "../../helpers/User";
import { getUserAuthByEmail } from "../../helpers/Auth";
export default {
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      search: "",
      calories: "",
      customers: [],
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "First Name",
          align: "start",
          sortable: false,
          value: "firstname",
        },
        { text: "Last Name", value: "lastname", sortable: false },

        { text: "Account ID", value: "accoundID" },
        { text: "Email", value: "email", sortable: false },
        { text: "Role", value: "role", sortable: false, align: "center" },
        { text: "Actions", value: "actions", sortable: false, align: "center" },
        // {
        //   text: "calorias",
        //   value: "calories",
        //   filter: (value) => {
        //     if (!this.calories) return true;

        //     return value < parseInt(this.calories);
        //   },
        // },
      ];
    },
  },
  mounted() {
    this.getCustomers();
  },
  methods: {
    async getCustomers() {
      console.log("obteniendo usuarios...");
      this.customers = await getAllCustomers();
      console.log(this.customers);
    },

    filterOnlyCapsText(value, search, item) {
      console.log(value, search);
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },

    async deleteCustomer(id) {
    //   console.log("eliminando customer", id);

    //   const response = await deleteUser(id);
    //   console.log(response);
    console.log(this.$store.getters.getUser)
      await getUserAuthByEmail();
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
  #btn {
    width: fit-content;
    margin-left: auto;
  }
  #table {
    width: 100%;
    height: 100%;
  }
}

.icons-actions {
  cursor: pointer;
}
</style>
