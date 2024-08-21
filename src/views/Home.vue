<template>
  <div id="container">
    <v-container class="lighten-5">
      <v-row no-gutters id="card-header">
        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
          <v-img id="img" max-height="150" max-width="250" src="../assets/smartStoreLogo.webp"></v-img>
        </v-col>
        <v-col cols="12" sm="8" md="8" lg="8" xl="8">
          <v-text-field label="Search" placeholder="Search by service name..." outlined v-model="search"></v-text-field>
        </v-col>
      </v-row>
      <v-row> 
        <v-col v-for="item in filteredItems" :key="item.title" cols="12" sm="3" md="3" lg="3" xl="3">
          <router-link :to="item.url">
            <v-card class="card">
              <div class="items-headers" :style="{ backgroundColor: item.color }">
                <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px">
                  <path :d="item.icon.path" />
                </svg>
              </div>
              <v-card-title class="card-title">{{ item.title }}</v-card-title>
            </v-card>
          </router-link>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

 
<script>
export default {
  data: () => ({
    search: null,
    filteredItems: [],  // Nueva propiedad para almacenar los items filtrados
  }),
  computed: {
    items() {
      const items = [...this.$store.getters.getItems]; // Copia de los items para evitar modificar el original
      const { role } = this.$store.getters.getUser;
      if (role === "admin") {
        items.push({
          title: "Admin",
          url: "/home/admin",
          icon: {
            path: "M680-280q25 0 42.5-17.5T740-340q0-25-17.5-42.5T680-400q-25 0-42.5 17.5T620-340q0 25 17.5 42.5T680-280Zm0 120q31 0 57-14.5t42-38.5q-22-13-47-20t-52-7q-27 0-52 7t-47 20q16 24 42 38.5t57 14.5ZM480-874q8 0 14.5 1t13.5 4l240 90q23 9 37.5 29t14.5 45v125q0 17-11.5 28.5T760-540q-17 0-28.5-11.5T720-580v-124l-240-90-240 90v188q0 50 14.5 100t40 95q25.5 45 62 81t79.5 59q15 8 21.5 23t.5 30q-7 16-22.5 22t-30.5-2q-113-56-179-169t-66-239v-189q0-25 14.5-45t37.5-29l240-90q7-3 14-4t14-1ZM680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80ZM480-494Z",
          },
          color: "#70d7e0",
        });
      }
      return items;
    }
  },
  watch: {
    search(newVal) { 
      if (newVal) {
        this.filteredItems = this.items.filter((item) => {
          const title = item.title.toLowerCase();
          return title.includes(newVal.toLowerCase());
        });
      } else {
        this.filteredItems = this.items;  
      }
    },
  },
  mounted() {
    this.filteredItems = this.items;  
  },
};
</script>

<style lang="scss" scoped>
#container {
  height: fit-content;
  width: clamp(60%, 100%, 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0rem;

  .lighten-5 {
    background-color: #f4f3f1;
    border-radius: 5px;
    box-shadow: rgba(108, 106, 106, 0.25) 0px 2px 8px 0px;
    height: fit-content;

    #card-header {
      display: flex;
      gap: 2rem;
      padding: 20px 0px;
      height: fit-content;
      justify-content: center;

      #img {
        margin: auto;
      }
    }

    a {
      text-decoration: none;
    }

    .card {
      cursor: pointer;
      border-radius: 15px;

      .items-headers {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10%;

        svg {
          fill: white;
        }
      }

      .card-title {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
