<template>
  <v-app>
    <v-app-bar
        app
        color="primary"
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
            height="24"
        />
        <h3>Speckle Demo App</h3>
      </div>

      <v-spacer></v-spacer>

      <div v-if="isAuthenticated">
        Welcome <b>{{ this.$store.state.user.name }}</b>! You are connected to
        <b>{{ this.$store.state.serverInfo.company }}'s <em>{{ this.$store.state.serverInfo.name }}</em></b>
      </div>

      <v-spacer></v-spacer>

      <v-btn
          outlined
          v-if="!isAuthenticated"
          @click="$store.dispatch('redirectToAuth')"
      >
        <span>Login with Speckle</span>
      </v-btn>
      <v-btn outlined v-else @click="$store.dispatch('logout')">
        Log out
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    }
  }
};
</script>
