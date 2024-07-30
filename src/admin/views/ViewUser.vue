<template>
  <div>
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
          <v-btn text @click="$router.go(-1)">
            <v-icon left>mdi-keyboard-backspace </v-icon>
            Return
          </v-btn>
        </div>
        <div>
          <v-avatar size="80">
            <img
              v-if="customerInfo?.avatar.length > 0"
              :src="customerInfo?.avatar"
            />
            <span id="initials" v-else>{{ initialsName.substring(0, 2) }}</span>
          </v-avatar>
          <v-card-title class="text-h4"
            >{{ customerInfo?.firstname || "user name" }}
            {{ customerInfo?.lastname || "user lastname" }}</v-card-title
          >
        </div>
      </section>

      <v-card-title class="mx-4">Customer Information</v-card-title>
      <v-divider class="mx-4"></v-divider>
      <v-card-text class="mx-4 pt-8">
        <v-row
          ><v-col cols="12" sm="4" xl="6"
            >Account ID (Odoo):
            {{ customerInfo?.accountID.join(", ") || "-" }}</v-col
          >
          <v-col cols="12" sm="4" xl="6"
            >Email: {{ customerInfo?.email || "-" }}</v-col
          ><v-col cols="12" sm="4" xl="6"
            >Phone: {{ customerInfo?.phoneNumber || "-" }}</v-col
          ><v-col cols="12" sm="4" xl="6"
            >Role: {{ customerInfo?.role || "-" }}</v-col
          >
          <v-col cols="12" sm="4" xl="6"
            >Modified Date:
            {{ convertTimestampToDate(customerInfo?.modifiedAt || "-") }}</v-col
          >

          <v-col cols="12" sm="4" xl="6"
            >Created Date:
            {{ convertTimestampToDate(customerInfo?.createAt || "-") }}</v-col
          >
          <v-col cols="12" sm="4" xl="6"
            ><span style="display: flex"
              >Modified By:
              <div style="width: 70%">
                {{ customerInfo?.modifiedBy?.name || "-" }} <br />
                {{ customerInfo?.modifiedBy?.email || "-" }}
              </div></span
            >
          </v-col>

          <v-col cols="12" sm="4" xl="6">
            <span style="display: flex"
              >Created By:
              <div style="width: 70%">
                {{ customerInfo.createdBy?.name || "-" }} <br />
                {{ customerInfo.createdBy?.email || "-" }}
              </div></span
            >
          </v-col>
          <v-col cols="12" sm="4" xl="6"></v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { getUserByID } from "../../helpers/UserQuery.js";
export default {
  data() {
    return {
      customerInfo: {
        firstname: "",
        avatar: [],
        accountID: [],
      },
      loading: true,
    };
  },
  computed: {
    customerId() {
      return this.$route.params.id;
    },
    initialsName() {
      const fullName = `${this.customerInfo.firstname} ${this.customerInfo.lastname}`;
      const words = fullName.split(" ");
      const initials = words.map((word) => word.charAt(0));
      const initialsString = initials.join("");
      return initialsString;
    },
  },
  async beforeMount() {
    this.customerInfo = await getUserByID(this.customerId);
  },
  async mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1500);
  },
  methods: {
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
    background-image: url("../../assets/background.jpg");
    background-repeat: none;
    background-size: cover;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-direction: column;
    padding: 20px 30px;
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
