<template lang="html">
  <v-container fluid class="home">
    <v-row align="center">
      <v-col
          v-if="streams"
          class="d-flex"
          cols="6"
          sm="6"
          offset="3"
      >
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
    <v-row v-if="lastCommitChildren">
      <v-data-table
          :headers="tableHeaders"
          :items="filteredCommitChildren"
          :items-per-page="5"
          class="elevation-1"
      ></v-data-table>
      <p>{{ JSON.stringify(filteredCommitChildren,null,2) }}</p>
    </v-row>
  </v-container>
</template>

<script>
const TOKEN = 'SpeckleDemo.AuthToken'
const SERVER_URL = 'https://speckle.xyz'


export default {
  name: 'Home',
  data: () => {
    return {
      selectedStreamId: null,
      selectedStream: null,
      lastCommitChildren: null,
      tableHeaders: [
        { text: "Name", value: "name"},
        { text: "Id", value: "id"},
        { text: "Children", value: "totalChildrenCount"},
      ],
    }
  },
  methods: {
    async handleStreamSelection(val) {
      console.log("A stream was selected", val)
      this.selectedStream = this.selectedStreamId ? this.streams?.items?.find(s => s.id == this.selectedStreamId) : null;
      if (this.selectedStream) {

        var commit = this.selectedStream.commits.items[0]
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
                    stream(id: "${this.selectedStreamId}"){
                      object(id: "${commit.referencedObject}"){
                        children {
                          objects {
                            speckleType
                            data
                          }
                        }
                      }
                    }
                  }`
                })
              })
              .then(res => res.json())
              .then(json => {
                this.lastCommitChildren = json.data.stream?.object?.children?.objects
              })
              .catch(err => console.error(err))
      }
    }
  },

  computed: {
    streams: function () {
      return this.$store.state.user?.streams
    },
    filteredCommitChildren: function (){
      return this.lastCommitChildren.map(obj => {
        var copy = Object.assign({},obj.data)
        copy.name = copy.speckle_type
        delete copy.data
        return {
          name: copy.speckle_type,
          id: copy.id,
          totalChildrenCount: copy.totalChildrenCount
        }
      })
    }
  }
}
</script>

<style lang="scss">
#viewer {
  min-height: 500px;
}
</style>