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
    <v-row v-if="commits">
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
    <v-row v-if="commits">
      <v-col class="d-flex" cols="6" offset="3">
        <v-data-table
            :loading="loading"
            :headers="filteredHeaders"
            :items="commits.items"
            :options.sync="options"
            :server-items-length="commits.totalCount"
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
import { getStreamCommits} from "@/speckleUtils";

export default {
  name: 'Home',
  components: {StreamSearch},
  data: () => {
    return {
      loading: false,
      options: {
        itemsPerPage: 5
      },
      selectedStream: null,
      commits: null,
      selectedKeys: ["id", "message"]
    }
  },
  methods: {
    streamSelected(stream) {
      console.log("Stream selected", stream)
      this.selectedStream = stream
      let ipp = this.options.itemsPerPage
      getStreamCommits(stream.id, 10, null)
            .then(json => {
              console.log("got stream commits", json.data.stream.commits)
              this.commits = json.data.stream.commits
            })
    },
    itemsPerPageUpdated(itemsPerPage){
      console.log("Items per page updated", itemsPerPage)
    },
    pageUpdated(page){
      console.log("Page updated", page)
    }
  },
  computed: {
    availableKeys: function () {
      var keys = {}
      this.commits?.items.forEach(obj => {
        Object.keys(obj).forEach(key => {
          if (!keys[key]) {
            keys[key] = true
          }
        })
      })
      return Object.keys(keys)
    },
    filteredHeaders: function () {
      return this.selectedKeys.map(key => {
        return {text: key, value: key}
      })
    }
  },
  watch: {
    options: {
      handler() {
        console.log('options have changed', this.options)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
#viewer {
  min-height: 500px;
}
</style>