<template lang="html">
  <WelcomeView v-if="!$store.getters.isAuthenticated"/>
  <v-container v-else class="home pa-6">
    <stream-search @selected="$store.dispatch('handleStreamSelection', $event)"/>
    <h2 class="pt-6 primary--text">
      <span v-if="selectedStream">
        {{ selectedStream.name }} — {{ selectedStream.id }}
        <v-btn outlined text small class="ml-3" :href="serverUrl+'/streams/'+selectedStream.id">View in server</v-btn>
        <v-btn outlined text small class="ml-3" color="error" @click="$store.dispatch('clearStreamSelection')">Clear selection</v-btn>
      </span>
      <span v-else>
        <em>No stream selected. Find one using the search bar 👆🏼</em>
      </span>
    </h2>

    <div class="pt-6">
      <v-select
          v-model="selectedKeys"
          :items="availableKeys"
          chips
          label="Select data to display"
          multiple
      ></v-select>
      <h3 class="pa-2 primary--text">Stream commits:</h3>
      <v-data-table
          :loading="loading"
          :headers="filteredHeaders"
          :items="commits ? commits.items : []"
          :options.sync="options"
          :server-items-length="commits ? commits.totalCount : null"
          disable-sort
          disable-filtering
          :disable-pagination="loading"
          class="elevation-1"
      ></v-data-table>
    </div>
  </v-container>
</template>

<script>
import StreamSearch from "@/components/StreamSearch";
import WelcomeView from "@/components/WelcomeView";

export default {
  name: 'Home',
  components: {WelcomeView, StreamSearch},
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