<template>
  <v-autocomplete
      v-model="selectedSearchResult"
      :items="streams.items"
      :search-input.sync="search"
      no-filter
      counter="2"
      rounded
      filled
      dense
      flat
      hide-no-data
      hide-details
      placeholder="Streams Search"
      item-text="name"
      item-value="id"
      return-object
      clearable
      append-icon=""
      @update:search-input="debounceInput"
  >
    <template #item="{ item }" color="background">
      <v-list-item-content>
        <v-list-item-title>
          <v-row class="pa-0 ma-0">
            {{ item.name }}
            <v-spacer></v-spacer>
            <span class="streamid">{{ item.id }}</span>
          </v-row>
        </v-list-item-title>
        <v-list-item-subtitle class="caption">
          Updated
          <timeago :datetime="item.updatedAt"></timeago>
        </v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
import {debounce} from "debounce"

const TOKEN = 'SpeckleDemo.AuthToken'
const SERVER_URL = process.env.VUE_APP_SERVER_URL

export default {
  name: "StreamSearch",
  data: () => ({
    search: "",
    streams: {items: []},
    selectedSearchResult: null
  }),
  watch: {
    selectedSearchResult(val) {
      this.search = ""
      this.streams.items = []
      if (val)
        this.$emit("selected", val)
    }
  },
  methods: {
    fetchSearchResults(e) {
      if( !e || e?.length < 3) return;
      console.log("execute search", e)
      let token = localStorage.getItem(TOKEN)
      if (token) {
        fetch(`${SERVER_URL}/graphql`, {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                query: `
                query {
                  streams(query: "${e}") {
                    totalCount
                    cursor
                    items {
                      id
                      name
                      updatedAt
                    }
                  }
                }
              `,
              })
            }
        )
            .then(res => res.json()).then(json => { console.warn(json.data.streams); this.streams = json.data.streams }, this)
      }
    },
    debounceInput: debounce(function (e) {
      this.fetchSearchResults(e)
    }, 300)
  }
}

</script>

<style scoped>

</style>