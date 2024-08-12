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
        <v-col v-for="item in items" :key="item.title" cols="12" sm="3" md="3" lg="3" xl="3">
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
    items: [],
  }),
  computed: {
  },
  watch: {
    search(newVal) {
      const data = this.items.filter((item) => {
        const title = item.title.toLowerCase();
        return title.includes(newVal.toLowerCase());
      });
      this.items = data;
      if (newVal === "") {
        this.items = this.$store.getters.getItems;
      }
    },
  },
  mounted() {
    this.items = this.$store.getters.getItems;
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
