<template>
  <main class="text-center">
    <v-bottom-sheet id="btn-archived" v-model="sheet" scrollable>
      <template v-slot:activator="{ on, attrs }">
        <v-btn  text v-bind="attrs" large v-on="on" min-width="100%">
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
          Archived
        </v-btn>
      </template>
      <v-card>
        <v-card-title>Customers Archived</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px">
          <v-list>
            <v-list-item
              v-for="customer in customers"
              :key="customer.id"
              @click="sheet = false"
            >
              <v-list-item-avatar>
                <v-avatar size="50px" tile v-if="customer.avatar.length > 0">
                  <img
                    :src="customer.avatar"
                    :alt="customer.firstname"
                    style="border-radius: 100%"
                  />
                </v-avatar>
                <span
                  v-else
                  style="
                    background-color: rgb(255, 185, 55);
                    padding: 10px;
                    border-radius: 100%;
                    color: white;
                    width: 50px;
                    height: auto;
                  "
                  >{{
                    initialsName(customer.firstname, customer.lastname)
                  }}</span
                >
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  >{{ customer.firstname }}
                  {{ customer.lastname }}</v-list-item-title
                >

                <v-list-item-subtitle>{{
                  customer.email
                }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action style="display: flex">
                <v-btn text @click="unarchiveCustomerEvent(customer.id)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    fill="#5f6368"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path
                      d="M20.55 5.22l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.15.55L3.46 5.22C3.17 5.57 3 6.01 3 6.5V19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.49-.17-.93-.45-1.28zm-8.2 4.63L17.5 15H14v2h-4v-2H6.5l5.15-5.15c.19-.19.51-.19.7 0zM5.12 5l.82-1h12l.93 1H5.12z"
                    />
                  </svg>
                  unarchive
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </main>
</template>

<script>
export default {
  props: {
    customers: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    sheet: false,
  }),
  methods: {
    initialsName(firstname, lastname) {
      const fullName = `${firstname} ${lastname}`;
      const words = fullName.split(" ");
      const initials = words.map((word) => word.charAt(0));
      const initialsString = initials.join("");
      return initialsString.substring(0, 2);
    },

    async unarchiveCustomerEvent(id) {
      this.$emit("unarchiveCustomer", id);
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  #btn-archived {
    .initials {
      background-color: rgb(255, 185, 55);
      width: fit-content;
      height: fit-content;
      padding: 5px 10px;
      border-radius: 6px;
      color: white;
      box-shadow: rgba(108, 106, 106, 0.71) 0px 2px 8px 0px;
    }
 
  }
}
</style>
