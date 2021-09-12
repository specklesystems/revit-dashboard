<template>
  <v-container id="revitStream" class="pa-6">
    <h2 class="pt-6 primary--text">
      <span v-if="stream">
        {{ stream.name }} — {{ stream.id }}
        <v-btn outlined text small class="ml-3" :href="serverUrl+'/streams/'+stream.id">View in server</v-btn>
        <v-btn outlined text small class="ml-3" color="error" @click="$store.dispatch('clearStreamSelection')">Clear selection</v-btn>
      </span>
      <span v-else>
        <em>No stream selected. Find one using the search bar 👆🏼</em>
      </span>
    </h2>
  </v-container>
</template>

<script>
export default {
  name: "RevitStream.vue",
  props: [ "streamId" ],
  data(){
    return {
      stream: null
    }
  },
  computed: {
    isRevitCommit: () => true
  },
  watch: {
    streamId: {
      handler: (val, oldVal) => {
        console.log("stream id changed")
      }
    }
  }
}
</script>

<style scoped>

</style>