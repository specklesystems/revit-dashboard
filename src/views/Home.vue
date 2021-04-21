<template>
  <div class="home">
    <button @click="this.authRedirect">Login with Speckle</button>
    <div id="viewer" ref="speckle-viewer"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Viewer } from '@speckle/viewer'

export default {
  name: 'Home',
  async mounted() {
    this.viewer = new Viewer({ container: this.$refs["speckle-viewer"] })
    await this.viewer.loadObject(this.url, this.token)
  },
  data: () => {
    return {
      viewer: null,
      token: "d7fddb61b5820d92ba1342d1981c8411b1fee500be",
      url: "https://speckle.xyz/streams/646cab6494/objects/550a2ef6d20e7f88853388b8d60de6c3"
    }
  },
  methods: {
    authRedirect: () => {
      window.location = "https://speckle.xyz/authn/verify/de9e84c7ca/myChallenge"
    }
  }
}
</script>

<style lang="scss">
#viewer {
  min-height: 500px;
}
</style>