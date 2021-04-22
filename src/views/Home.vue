<template lang="html">
  <v-container v-if="$store.getters.isAuthenticated" fluid class="home">
    <v-row align="center">
      <v-col
          class="d-flex"
          cols="6"
          sm="6"
          offset="3"
      >
        <stream-search @selected="streamSelected"/>
      </v-col>
    </v-row>
    <v-row v-if="lastCommitChildren">
      <v-col class="d-flex" cols="6" offset="3">
        <v-select
            v-model="selectedKeys"
            :items="availableKeys"
            chips
            label="Select data to display"
            multiple
        ></v-select>
      </v-col>
    </v-row>
    <v-row v-if="lastCommitChildren">
      <v-col class="d-flex" cols="6" offset="3">
        <v-data-table
            :headers="filteredHeaders"
            :items="lastCommitChildren"
            class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
  <v-container fluid class="home" v-else>
    <p>Please log in to access you Speckle data.</p>
  </v-container>
</template>

<script>
import StreamSearch from "@/components/StreamSearch";
const TOKEN = 'SpeckleDemo.AuthToken'
const SERVER_URL = process.env.VUE_APP_SERVER_URL


export default {
  name: 'Home',
  components: {StreamSearch},
  data: () => {
    return {
      selectedStream: null,
      lastCommitChildren: null,
      selectedKeys: ["id", "message"]
    }
  },
  methods: {
    streamSelected(stream){
      console.log("Stream selected", stream)
      let token = localStorage.getItem(TOKEN)
      if (token)
        fetch(
            `${SERVER_URL}/graphql`,
            {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                query: `query {
                  stream(id: "${stream.id}"){
                    commits(limit: 10, cursor: null) {
                      totalCount
                      cursor
                      items{
                        id
                        message
                        branchName
                        sourceApplication
                        referencedObject
                        authorName
                        createdAt
                      }
                    }
                  }
                }`
              })
            })
            .then(res => res.json())
            .then(json => json.data.stream.commits)
            .then(commits => {
              console.log("commits", commits)
              this.lastCommitChildren = commits.items
            })

    }
  },
  computed: {
    availableKeys: function(){
      var keys = {}
      this.lastCommitChildren?.forEach(obj => {
        Object.keys(obj).forEach(key => {
          if(!keys[key]){
            keys[key] = true
          }
        })
      })
      return Object.keys(keys)
    },
    filteredHeaders: function() {
        return this.selectedKeys.map(key => { return { text: key, value: key}})
    }
  }
}
</script>

<style lang="scss">
#viewer {
  min-height: 500px;
}
</style>