<template>
  <v-app>
    <v-app-bar
        app
        color="primary"
        dark
        dense
    >
      <router-link to="/">
        <v-btn text>
          <v-img class="mr-2" src="@/assets/img.png" height="24" width="24"/>
          <h3 class="text--white">Speckle</h3>
        </v-btn>
      </router-link>

      <v-spacer></v-spacer>

      <stream-search v-if="isAuthenticated" @selected="$router.push(`/streams/${$event.id}`)"/>

      <v-spacer></v-spacer>

      <v-btn
          class="ma-2"
          outlined
          v-if="!isAuthenticated"
          @click="$store.dispatch('redirectToAuth')"
      >
        <v-img class="mr-2" src="@/assets/img.png" height="14" width="14"/>
        <span>Login/Register</span>
      </v-btn>
        <v-menu v-else offset-y open-on-hover>
          <template v-slot:activator="{ on, attrs }">
            <v-avatar v-bind="attrs" v-on="on" size="32" color="grey lighten-3" style="border-">
              <v-img v-if="$store.state.user.avatar" :src="$store.state.user.avatar"/>
              <v-img v-else :src="`https://robohash.org/${$store.user.id}.png?size=32x32`"/>
            </v-avatar>
          </template>
          <v-list dense nav subheader id="login-menu">
              <v-subheader class="caption">Logged in as:</v-subheader>
              <p class="caption ml-3 mb-1">{{ $store.state.user.name }} <span v-if="$store.state.user.email">({{ $store.state.user.email }})</span></p>
            <v-divider class="ma-1"></v-divider>
            <v-list-item link :href="`${serverUrl}/profile`" target="_blank">
              <v-list-item-title>Go to profile</v-list-item-title>
              <v-list-item-icon><v-icon small>mdi-account</v-icon></v-list-item-icon>
            </v-list-item>
            <v-list-item link @click="$store.dispatch('logout')">
              <v-list-item-title class="error--text">Log out</v-list-item-title>
              <v-list-item-icon><v-icon small color="error">mdi-logout</v-icon></v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-menu>
    </v-app-bar>

    <v-main>
      <transition name="fade">
        <router-view/>
      </transition>
    </v-main>
  </v-app>
</template>

<script>
import StreamSearch from "@/components/StreamSearch";

export default {
  name: 'App',
  components: {StreamSearch},
  data() {
    return {
      serverUrl: process.env.VUE_APP_SERVER_URL
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },
  }
};
</script>

<style lang="scss">
$heading-font-family: 'Space Grotesk';

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}

</style>