<template lang="html">
  <v-container fluid class="home">
    <v-row align="center">
      <v-col
          v-if="streams"
          class="d-flex"
          cols="6"
          sm="6"
      >
        <p>{{selectedStream}}</p>
        <v-select
            v-model="selectedStreamId"
            :items="streams.items"
            item-text="name"
            item-value="id"
            @change="handleStreamSelection"
            label="Select a stream"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      {{lastCommitChildren}}
    </v-row>
  </v-container>
</template>

<script>
const TOKEN='SpeckleDemo.AuthToken'
const SERVER_URL = 'https://speckle.xyz'


export default {
  name: 'Home',
  data: () => {
    return {
      selectedStreamId: null,
      selectedStream: null,
      lastCommitChildren: null
    }
  },
  methods: {
    async handleStreamSelection(val){
      console.log("A stream was selected", val)
      this.selectedStream = this.selectedStreamId ? this.streams?.items?.find(s => s.id == this.selectedStreamId) : null;
      if(this.selectedStream){
        console.log("Loading up objects from latest commit")
        var commit = this.selectedStream.commits.items[0]
        let token = localStorage.getItem(TOKEN)
        console.log(commit.referencedObject, token)
        if (token) {
          let testResponse = await fetch(`${SERVER_URL}/graphql`, {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({query: `query {
              stream(id: "${this.selectedStreamId}"){
                object(id: "${commit.referencedObject}"){
                  children {
                    objects {
                      id
                      speckleType
                      data
                    }
                  }
                }
              }
            }`})
          })
          let data = (await testResponse.json()).data
          console.log("received data", data.stream.object)
          this.lastCommitChildren = data
      }
    }
  }
  },

  computed: {
    streams: function () {
      return this.$store.state.user?.streams
    }
  }
}
</script>

<style lang="scss">
#viewer {
  min-height: 500px;
}
</style>