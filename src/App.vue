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
        <h3>Speckle</h3>
      </div>

      <v-spacer></v-spacer>

      <stream-search @selected="$store.dispatch('handleStreamSelection', $event)"/>

      <v-spacer></v-spacer>

      <div v-if="isAuthenticated" class="mr-1">
        Welcome <b>{{ this.$store.state.user.name }}</b>!
      </div>

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
import StreamSearch from "@/components/StreamSearch";

export default {
  name: 'App',
  components: {StreamSearch},
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    }
  }
};
</script>
