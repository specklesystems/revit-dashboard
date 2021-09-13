<template lang="html">
  <v-container class="home pa-6">
    <revit-stream :stream-id="selectedStream ? selectedStream.id : null"/>
  </v-container>
</template>

<script>
import StreamSearch from "@/components/StreamSearch";
import WelcomeView from "@/components/WelcomeView";
import CommitTable from "./CommitTable";
import RevitStream from "@/components/RevitStream"

export default {
  name: 'Home',
  components: {RevitStream},
  data: () => {
    return {
      serverUrl: process.env.VUE_APP_SERVER_URL,
    }
  },
  methods: {},
  computed: {
    selectedStream: function () {
      return this.$store.state.currentStream
    },
  }
}
</script>

<style lang="scss">
#viewer {
  min-height: 500px;
}

.v-data-footer__select {
  display: none !important;
}
</style>