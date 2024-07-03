<template>
  <v-card id="menu">
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" permanent>
      <v-list-item id="menu-header" v-if="!mini">
        <v-icon id="btn" icon @click.stop="mini = !mini"
          >mdi-chevron-left
        </v-icon>
        <img src="../assets/smartStoreLogo.png" alt="Logo" />
      </v-list-item>
      <div id="avatar-menu">
        <img
          v-if="user.avatar.length > 0"
          :src="user.avatar"
          :style="mini ? { width: '50px' } : { width: '100px' }"
        />

        <span v-else>{{ initialsName.substring(0, 2) }}</span>
        <b>{{ !mini ? user.name : initialsName }}</b>
      </div>
      <v-list dense id="list-menu">
        <div>
          <span v-for="item in items" :key="item.title">
            <router-link :to="item.url">
              <v-list-item
                class="list-menu-items"
                link
                :style="!mini ? { gap: '10px' } : ''"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                >
                  <path :d="item.icon.path" />
                </svg>

                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </router-link>
          </span>
        </div>
        <div>
          <v-dialog v-model="dialog" persistent max-width="290">
            <template v-slot:activator="{ on, attrs }">
              <v-list-item
                v-bind="attrs"
                v-on="on"
                id="logout"
                link
                :style="!mini ? { gap: '10px' } : ''"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#000000"
                >
                  <path
                    d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240q17 0 28.5 11.5T480-800q0 17-11.5 28.5T440-760H200v560h240q17 0 28.5 11.5T480-160q0 17-11.5 28.5T440-120H200Zm487-320H400q-17 0-28.5-11.5T360-480q0-17 11.5-28.5T400-520h287l-75-75q-11-11-11-27t11-28q11-12 28-12.5t29 11.5l143 143q12 12 12 28t-12 28L669-309q-12 12-28.5 11.5T612-310q-11-12-10.5-28.5T613-366l74-74Z"
                  />
                </svg>

                <v-list-item-content>
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-card>
              <v-card-title class="text-h5"> Attention </v-card-title>
              <v-card-text>Are you sure you want to log out?</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="gray darken-1" text @click="dialog = false">
                  Disagree
                </v-btn>
                <v-btn color="orange darken-1" text @click="loginOut()">
                  Agree
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import { logOut } from "../helpers/Auth";
export default {
  props: {
    user: Object,
  },
  data() {
    return { dialog: false, loader: true, drawer: true, mini: true };
  },
  computed: {
    items() {
      return this.$store.getters.getItems;
    },
    initialsName() {
      const words = this.user.name.split(" ");
      const initials = words.map((word) => word.charAt(0));
      const initialsString = initials.join("");
      return initialsString;
    },
  },
  mounted() {
    console.log("items", this.user);
  },
  methods: {
    ...mapActions(["resetStore"]),

    async loginOut() {
      const logOutResp = await logOut();
      logOutResp === 200 ? this.resetStore() + this.$router.push("/") : null;
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  #menu {
    #menu-header {
      margin: 0px 0px 10px 0px;
      background-color: rgb(235, 235, 235);
      display: flex;
      padding: 5px 0%;
      justify-content: space-around;
      align-items: center;
      img {
        width: 150px;
      }
    }
    #avatar-menu {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      background-color: rgba(223, 222, 222, 0.621);
      border-radius: 10px;
      padding: 10px;
      width: 90%;
      margin: auto;
      text-align: center;
      box-shadow: rgba(108, 106, 106, 0.25) 0px 2px 8px 0px;
      img {
        border-radius: 100%;
      }
      span {
        background-color: rgb(255, 185, 55);
        width: fit-content;
        height: fit-content;
        padding: 5px 10px;
        border-radius: 5px;
        color: white;
        box-shadow: rgba(108, 106, 106, 0.71) 0px 2px 8px 0px;
      }
    }
    #list-menu {
      display: flex;
      height: 80%;
      flex-direction: column;
      justify-content: space-between;
      gap: 10px;
      a {
        text-decoration: none;
        .list-menu-items {
          margin: auto;
          padding: 0px 10px;
          width: 90%;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        &.router-link-exact-active {
          .list-menu-items {
            background-color: rgb(255, 185, 55);
            color: white;
            svg {
              fill: white;
            }
          }
        }
      }
    }
  }
}
</style>
