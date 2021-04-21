<template>
  <v-app>
    <v-app-bar
      app
      color="info"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Speckle Logo"
          class="shrink mr-2"
          contain
          :src="require(`@/assets/img.png`)"
          transition="scale-transition"
          width="40"
        />

        <h3>
          SPECKLE DEMO APP
        </h3>
      </div>

      <v-spacer></v-spacer>

      <div v-if="isAuthenticated">
        Welcome {{this.$store.state.user.name}}! You are connected to {{this.$store.state.serverInfo.company}}'s {{this.$store.state.serverInfo.name}}
      </div>

      <v-spacer></v-spacer>


      <v-btn
        v-if="!isAuthenticated"
        @click="$store.dispatch('redirectToAuth')"
      >
        <span class="mr-2">Login with Speckle</span>
      </v-btn>
      <v-btn v-else @click="$store.dispatch('logout')">Log out</v-btn>
    </v-app-bar>

    <v-main>
      <Home/>
    </v-main>
  </v-app>
</template>

<script>
import Home from "@/views/Home";

export default {
  name: 'App',

  components: {
    Home,
  },

  data: () => ({
    //
  }),
  computed: {
    isAuthenticated() { return this.$store.state.user != null}
  }
};
</script>
