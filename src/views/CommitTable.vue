<template lang="html">
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
</template>
<script>
export default {
  name: 'CommitTable',
  data: () => {
    return {
      loading: false,
      options: {
        itemsPerPage: 5
      },
      selectedKeys: ["id", "message", "branchName", "authorName"],
    }
  },
  mounted() {
    var storedOpts = this.$store.state.tableOptions
    if (storedOpts) this.options = storedOpts
  },
  computed: {
    commits: function () {
      return this.$store.state.latestCommits
    },
    previousCursors: function () {
      return this.$store.state.previousCursors || [null]
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
    },
  },
  watch: {
    options: {
      async handler(val, oldval) {
        this.$store.commit("setTableOptions", val)
        if (oldval.page && val.page != oldval.page) {
          if (val.page > oldval.page) {
            this.loading = true
            var cursor = this.$store.state.latestCommits.cursor
            await this.$store.dispatch("getCommits", cursor)
            this.$store.commit("addCursorToPreviousList", cursor)
            this.loading = false

          } else {
            console.log("page down")
            this.loading = true
            await this.$store.dispatch("getCommits", this.previousCursors[val.page - 1])
            this.loading = false
          }
        }
      },
      deep: true
    }
  }

}
</script>
