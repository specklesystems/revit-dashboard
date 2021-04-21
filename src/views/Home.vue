<template lang="html">
  <div class="home">
    <button @click="this.authRedirect">Login with Speckle</button>
  </div>
</template>

<script>

export default {
  name: 'Home',
  async mounted() {
    console.log(process.env.VUE_APP_SPECKLE_ID)
    console.log(process.env.VUE_APP_SPECKLE_SECRET)
  },
  data: () => {
    return {
      appid: process.env.VUE_APP_SPECKLE_ID || "",
      challenge: process.env.VUE_APP_SPECKLE_SECRET || ""
    }
  },
  methods: {
    authRedirect() {
      window.location = `https://speckle.xyz/authn/verify/${this.appid}/${this.challenge}`
    }
  }
}
</script>

<style lang="scss">
#viewer {
  min-height: 500px;
}
</style>