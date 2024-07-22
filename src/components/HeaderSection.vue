<template>
  <div>
    <header>
      <nav v-if="isLaptopOrPc">
        <span>
          <v-btn
            text
            x-large
            @click="$router.push('/home')"
            v-if="$route.path !== '/home'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path
                d="M240-200h120v-200q0-17 11.5-28.5T400-440h160q17 0 28.5 11.5T600-400v200h120v-360L480-740 240-560v360Zm-80 0v-360q0-19 8.5-36t23.5-28l240-180q21-16 48-16t48 16l240 180q15 11 23.5 28t8.5 36v360q0 33-23.5 56.5T720-120H560q-17 0-28.5-11.5T520-160v-200h-80v200q0 17-11.5 28.5T400-120H240q-33 0-56.5-23.5T160-200Zm320-270Z"
              />
            </svg>
            Home
          </v-btn>
        </span>
        <span>
          <v-menu transition="slide-y-transition" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <div id="avatar-menu" v-bind="attrs" v-on="on">
                <img v-if="user.avatar.length > 0" :src="user.avatar" />
                <span v-else>{{ initialsName.substring(0, 2) }}</span>
                <b>{{ user.firstname }} {{ user.lastname || "" }}</b>
              </div>
            </template>
            <v-list rounded>
              <v-list-item-group v-model="selectedOption" color="primary">
                <v-list-item v-for="(item, i) in items" :key="i">
                  <v-list-item-icon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#000000"
                    >
                      <path :d="item.icon.path" />
                    </svg>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </span>
      </nav>
      <nav v-if="isTabletOrMobile">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </nav>
    </header>
    <v-navigation-drawer
      id="nav-mobile"
      v-model="drawer"
      absolute
      top
      temporary
    >
      <div id="avatar-menu">
        <img v-if="user.avatar.length > 0" :src="user.avatar" />
        <span v-else>{{ initialsName.substring(0, 2) }}</span>
        <b>{{ user.firstname }} {{ user.lastname || "" }}</b>
        <p>{{ user.email || "" }}</p>
      </div>
      <v-list nav dense>
        <v-list-item-group v-model="selectedOption">
          <v-list-item v-if="$route.path !== '/home'">
            <v-list-item-title
              @click="$router.push('/home')"
              id="home_opction_nav"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path
                  d="M240-200h120v-200q0-17 11.5-28.5T400-440h160q17 0 28.5 11.5T600-400v200h120v-360L480-740 240-560v360Zm-80 0v-360q0-19 8.5-36t23.5-28l240-180q21-16 48-16t48 16l240 180q15 11 23.5 28t8.5 36v360q0 33-23.5 56.5T720-120H560q-17 0-28.5-11.5T520-160v-200h-80v200q0 17-11.5 28.5T400-120H240q-33 0-56.5-23.5T160-200Zm320-270Z"
                />
              </svg>
              Home
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn text @click="dialog = true">
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
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Attention </v-card-title>
        <v-card-text>Are you sure you want to log out?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="gray darken-1"
            text
            @click="(dialog = false) + (selectedOption = null)"
          >
            Disagree
          </v-btn>
          <v-btn color="orange darken-1" text @click="loginOut()">
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { logOut } from "../helpers/Auth";
export default {
  data() {
    return {
      isLaptopOrPc: false,
      isTabletOrMobile: false,
      dialog: false,
      drawer: false,
      selectedOption: null,
      items: [
        {
          name: "Logout",
          icon: {
            path: "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240q17 0 28.5 11.5T480-800q0 17-11.5 28.5T440-760H200v560h240q17 0 28.5 11.5T480-160q0 17-11.5 28.5T440-120H200Zm487-320H400q-17 0-28.5-11.5T360-480q0-17 11.5-28.5T400-520h287l-75-75q-11-11-11-27t11-28q11-12 28-12.5t29 11.5l143 143q12 12 12 28t-12 28L669-309q-12 12-28.5 11.5T612-310q-11-12-10.5-28.5T613-366l74-74Z",
          },
        },
      ],
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    initialsName() {
      const fullName = `${this.user.firstname} ${this.user.lastname}`;
      const words = fullName.split(" ");
      const initials = words.map((word) => word.charAt(0));
      const initialsString = initials.join("");
      return initialsString;
    },
  },
  watch: {
    selectedOption(item) {
      console.log("test", item);
      if (item !== null) {
        console.log("calculando");
        this.items[item].name === "Logout" ? (this.dialog = true) : null;
      }
    },
  },
  mounted() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  },
  methods: {
    ...mapActions(["resetStore"]),

    async loginOut() {
      const logOutResp = await logOut();
      logOutResp === 200 ? this.resetStore() + this.$router.push("/") : null;
    },

    handleResize() {
      const width = window.innerWidth;
      // Ajusta estos valores según tus necesidades
      this.isLaptopOrPc = width >= 1024;
      this.isTabletOrMobile = width < 1024;
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  padding: 10px 20px;
  box-shadow: rgba(108, 106, 106, 0.25) 0px 2px 8px 0px;
  nav {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 0px 0px 20px;
    span {
      #avatar-menu {
        display: flex;
        align-items: center;
        gap: 10px;
        background-color: rgba(223, 222, 222, 0.621);
        border-radius: 10px;
        padding: 10px;
        width: fit-content;
        margin: auto;

        img {
          border-radius: 6px;
          width: 50px;
        }
        span {
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
  }
}

#nav-mobile {
  #avatar-menu {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: rgba(223, 222, 222, 0.621);
    padding: 15% 0px 10px 20px;
    p {
      font-size: 0.9rem;
    }
    img {
      width: 50px;
      border-radius: 50%;
      object-fit: cover;
    }
    span {
      background-color: rgb(255, 185, 55);
      width: fit-content;
      height: fit-content;
      padding: 5px 10px;
      border-radius: 6px;
      color: white;
      box-shadow: rgba(108, 106, 106, 0.71) 0px 2px 8px 0px;
    }
  }

  #home_opction_nav {
    display: flex;
    align-items: center;
  }
}
@media (max-width: 650px) {
  header {
    padding: 10px 5px;
    width: 100%;
    nav {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>
