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
        Welcome <b>{{this.$store.state.user.name}}</b>! You are connected to <b>{{this.$store.state.serverInfo.company}}'s <em>{{this.$store.state.serverInfo.name}}</em></b>
      </div>

      <v-spacer></v-spacer>


      <v-btn
        v-if="!isAuthenticated"
        @click="$store.dispatch('redirectToAuth')"
      >
        <span class="mr-2">Login with Speckle</span>
      </v-btn>
      <v-btn v-else @click="$store.dispatch('logout')">
       Log out</v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    //
  }),
  computed: {
    isAuthenticated() { return this.$store.state.user != null}
  }
};
</script>
