<template lang="html">
  <v-container v-if="$store.getters.isAuthenticated" class="home pa-6">
    <stream-search @selected="$store.dispatch('handleStreamSelection', $event)"/>
    <h1 v-if="selectedStream" class="pt-6">
      {{ selectedStream.name }}
      <v-btn outlined text small :href="serverUrl+'/streams/'+selectedStream.id">View in server</v-btn>
    </h1>
    <div v-if="commits" class="pt-6">
      <v-select
          v-if="commits"
          v-model="selectedKeys"
          :items="availableKeys"
          chips
          label="Select data to display"
          multiple
      ></v-select>
      <h3>Stream commits:</h3>
      <v-data-table
          :loading="loading"
          :headers="filteredHeaders"
          :items="commits.items"
          :options.sync="options"
          :server-items-length="commits.totalCount"
          disable-sort
          disable-filtering
          :disable-pagination="loading"
          class="elevation-1"
      ></v-data-table>
    </div>
  </v-container>
  <v-container fluid class="home" v-else>
    <p>Please log in to access you Speckle data.</p>
  </v-container>
</template>

<script>
import StreamSearch from "@/components/StreamSearch";

export default {
  name: 'Home',
  components: {StreamSearch},
  data: () => {
    return {
      loading: false,
      options: {
        itemsPerPage: 5
      },
      serverUrl: process.env.VUE_APP_SERVER_URL,
      selectedKeys: ["id", "message", "branchName", "authorName"],
    }
  },
  mounted() {
    var storedOpts = this.$store.state.tableOptions
    if (storedOpts) this.options = storedOpts
  },
  methods: {},
  computed: {
    selectedStream: function () {
      return this.$store.state.currentStream
    },
    previousCursors: function () {
      return this.$store.state.previousCursors || [null]
    },
    commits: function () {
      return this.$store.state.latestCommits
    },
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
      handler(val, oldval) {
        this.$store.commit("setTableOptions", val)
        if (oldval.page && val.page != oldval.page) {
          if (val.page > oldval.page) {
            this.loading = true
            var cursor = this.$store.state.latestCommits.cursor
            this.$store.dispatch("getCommits", cursor).then(() => {
              this.$store.commit("addCursorToPreviousList", cursor)
              this.loading = false
            })
          } else {
            console.log("page down")
            this.loading = true
            this.$store.dispatch("getCommits", this.previousCursors[val.page - 1]).then(() => {
              this.loading = false
            })
          }
        }
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

.v-data-footer__select {
  display: none !important;
}
</style>