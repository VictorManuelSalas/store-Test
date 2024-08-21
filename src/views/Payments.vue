<template>
  <main>
    <div id="loader" class="text-center" v-if="paymentAlert">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <strong>Loading...</strong>
    </div>

    <div id="alert" v-if="alert.value">
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
            ? 'mdi-file-lock'
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

    <div id="dialog-calendar" v-if="modalDatePicker">
      <div class="dialog-content">
        <v-date-picker class="pa-1" v-model="rangeDates" range></v-date-picker>
        <span>
          <button
            id="close-dialog"
            @click="(modalDatePicker = !modalDatePicker) + (rangeDates = [])"
          >
            Cancel
          </button>
          <button
            id="accept-dialog"
            :disabled="rangeDates.length < 2"
            @click="filterDateRange"
          >
            Filter
          </button>
        </span>
      </div>
    </div>
    <div>
      <span id="title-view">
        <v-btn
          id="btn"
          color="warning"
          elevation="5"
          large
          @click="
            rangeDates.length == 2
              ? cleanFilterRangeDate()
              : (modalDatePicker = true)
          "
          >{{
            rangeDates.length == 2 ? "Clean Range Filter" : "Date Range"
          }}</v-btn
        >
        <section>
          <h1 class="ml-5">Payments</h1>
        </section>
      </span>

      <v-data-table
        id="table"
        :headers="headers"
        :items="payments"
        item-key="payments.id"
        class="elevation-1"
        :search="search"
        :loading="payments.length == 0 && paymentProccessSearch"
        loading-text="Loading... Please wait"
      >
        <!-- <template v-slot:item.name="{ item }">
          <router-link :to="`/${item.id}`"> {{ item.name }}</router-link>
        </template> -->
        <template v-slot:item.ref="{ item }">
          <p :style="item.ref ? 'color: black;' : 'opacity: 0.5;'">
            {{ item.ref ? item.ref : "null" }}
          </p>
        </template>
        <template v-slot:item.date="{ item }">
          {{ item.date ? item.date : null }}
        </template>
        <template v-slot:item.amount_total="{ item }">
          $ {{ item.amount_total }}
        </template>
        <template v-slot:item.payment_state="{ item }">
          <v-chip
            :color="
              item.payment_state === 'paid'
                ? 'green darken-3'
                : item.payment_state === 'in_payment'
                ? 'blue lighten-1'
                : item.payment_state === 'not_paid'
                ? 'red accent-4'
                : 'blue-grey lighten-3'
            "
            dark
          >
            {{
              item.payment_state === "in_payment"
                ? "In Payment"
                : item.payment_state === "not_paid"
                ? "Not Paid"
                : item.payment_state === "paid"
                ? "Paid"
                : item.payment_state
            }}
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
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
                @click="downInvoice(item)"
              >
                <path
                  d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"
                />
              </svg>
            </template>
            <span>Download PDF</span>
          </v-tooltip>
          <v-tooltip top max-width="fit-content" color="blue">
            <template v-slot:activator="{ on, attrs }">
              <svg
                class="icons-actions"
                v-bind="attrs"
                v-on="on"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 -960 960 960"
                fill="#000000"
                @click="openInvoice(item)"
              >
                <path
                  d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240q17 0 28.5 11.5T480-800q0 17-11.5 28.5T440-760H200v560h560v-240q0-17 11.5-28.5T800-480q17 0 28.5 11.5T840-440v240q0 33-23.5 56.5T760-120H200Zm560-584L416-360q-11 11-28 11t-28-11q-11-11-11-28t11-28l344-344H600q-17 0-28.5-11.5T560-800q0-17 11.5-28.5T600-840h200q17 0 28.5 11.5T840-800v200q0 17-11.5 28.5T800-560q-17 0-28.5-11.5T760-600v-104Z"
                />
              </svg>
            </template>
            <span>Open</span>
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
import { refreshToken } from "../helpers/Auth";
import { getPaymentsUser } from "../helpers/Odoo/Payments";
export default {
  data() {
    return {
      paymentAlert: false,
      payments: [],
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
      search: "",
      rangeDates: [],
      modalDatePicker: false,
      paymentProccessSearch: true,
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "Payment",
          align: "start",
          sortable: true,
          value: "name",
        },
        { text: "Reference", value: "ref", sortable: true },
        {
          text: "Date",
          value: "date",
          sortable: true,
          align: "center",
        },
        { text: "Total", value: "amount_total", sortable: true },
        {
          text: "Status",
          value: "payment_state",
          sortable: true,
          align: "center",
        },
        { text: "Actions", value: "actions", sortable: false, align: "center" },
      ];
    },
  },
  mounted() {
    this.getPayments();
  },
  methods: {
    async downInvoice(invoice) {
      if (invoice.access_token === false) {
        this.alertProcess(
          "Cannot download this invoice due to service blocking.",
          "warning",
          3000
        );
        return;
      }
      this.paymentAlert = true;
      const { auth } = this.$store.getters.getUser;
      const invoiceResponse = await downloadInvoice(invoice, auth.token);
      if (invoiceResponse) {
        this.paymentAlert = false;
      }
    },
    openInvoice(invoice) {
      if (invoice.access_token === false) {
        this.alertProcess(
          "Cannot open this invoice due to service blocking.",
          "warning",
          3000
        );
        return;
      }
      this.paymentAlert = true;
      const { access_token, access_url } = invoice;
      window.open(
        `${process.env.VUE_APP_webOdoo_URL}${access_url}?access_token=${access_token}`
      );
      this.paymentAlert = false;
    },
    async getPayments() {
      const { accountID, auth } = this.$store.getters.getUser;
      const payments = await getPaymentsUser(accountID, auth.token);
      if ("message" in payments && payments.message == 403) {
        this.refreshAndSaveToken(auth);
        return;
      }
      if (payments.length > 0) {
        this.payments = payments;
        this.$store.dispatch("fetchPayments", payments);
        this.paymentProccessSearch = false;
        return;
      } else if (payments.length === 0) {
        this.paymentProccessSearch = false;
      } else {
        this.alertProcess(`${payments.message}`, "error", 5000);
        this.paymentProccessSearch = false;
      }
    },
    async refreshAndSaveToken(auth) {
      const newTokens = await refreshToken(auth);
      if ("access_token" in newTokens) {
        this.$store.dispatch("fetchUserTokens", newTokens.access_token);
        setTimeout(() => {
          this.getPayments();
        }, 2000);
      }
    },
    filterDateRange() {
      this.payments = [];
      this.paymentProccessSearch = true;
      const paymentsFromStore = this.$store.getters.getPayments;
      const startDate = new Date(
        `${this.rangeDates[0]}T00:00:00Z`
      ).toISOString();
      const endDate = new Date(`${this.rangeDates[1]}T00:00:00Z`).toISOString();
      const filteredpayments = paymentsFromStore.filter((payment) => {
        if (payment.date) {
          const paymentDate = new Date(payment.date).toISOString();
          return paymentDate >= startDate && paymentDate <= endDate;
        }
      });
      this.paymentProccessSearch = false;
      this.payments = filteredpayments;
      this.modalDatePicker = false;
    },

    cleanFilterRangeDate() {
      this.rangeDates = []; 
      const paymentsFromStore = this.$store.getters.getPayments;
      this.payments = Array.isArray(paymentsFromStore) ? paymentsFromStore : [];
    },

    alertProcess(text, method, duration) {
      this.alert = {
        value: true,
        text,
        method,
      };

      setTimeout(() => {
        this.alert.value = false;
      }, duration);
    },
  },
  beforeDestroy() {
    this.refreshAndSaveToken();
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

#dialog-calendar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: #0504043f;
  .dialog-content {
    padding: 0px 0px 15px 0px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    position: relative;
    width: fit-content;
    height: fit-content;
    margin: 0px auto;
    background-color: #ffffff;
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

#alert {
  width: 95vw;
  position: fixed;
  z-index: 1;
}
#loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.635);
  justify-content: center;
  align-items: center;
  z-index: 10;

  strong {
    color: white;
  }
}
</style>
