<template lang="html">
  <div class="home">
    <v-btn @click="this.authRedirect">Login with Speckle</v-btn>
    <p>{{ this.$store.state.user }}</p>
    <p>{{ this.$store.state.serverInfo }}</p>
  </div>
</template>

<script>

export default {
  name: 'Home',
  async mounted() {
    await this.$store.dispatch("getServerInfo")
  },
  data: () => {
    return {

    }
  },
  methods: {
    authRedirect() {
      this.$store.dispatch("redirectToAuth")
    },
  },
  computed: {
  }
}
</script>

<style lang="scss">
#viewer {
  min-height: 500px;
}
</style>