<template>
  <v-container>
    <v-row>
      <v-col class="col-6">
        <v-card max-height="500px">
          <v-card-title>Elements Per Level/Category</v-card-title>
          <v-card-text>
            <horizontal-barchart v-if="objsByLevelData" :chart-data="objsByLevelData" :options="options"></horizontal-barchart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="col-6">
        <v-card max-height="500px">
          <v-card-title>Available Families and Types</v-card-title>
          <v-card-text>
            <v-expansion-panels>
              <v-expansion-panel
                  v-for="(item,key) in availableFamTypes"
                  :key="key"
              >
                <v-expansion-panel-header>
                  {{ key }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ul>
                    <li v-for="(count, type) in item" :key="type">{{type}}: {{count}}</li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

</template>

<script>
import ObjectLoader from '@speckle/objectloader'
import HorizontalBarchart from "@/components/charts/HorizontalBarchart";
import interpolate from "color-interpolate";

export default {
  name: "ObjectLoaderTest",
  components: {HorizontalBarchart},
  props: ["streamId", "objectId"],
  data() {
    return {
      loader: null,
      objsPerLevel: null,
      colorRange: interpolate(["#047EFB","#4caf50"]),
      availableLevels: null,
      availableFamTypes: null,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            stacked: true,
            categoryPercentage: 0.5,
            barPercentage: 1
          }],
          yAxes: [{
            stacked: true
          }]
        }
      },
    }
  },
  computed: {
    objsByLevelData() {
      // Fast exit if no object has been set yet
      if (!this.objsPerLevel) return null

      var labels = []
      var dataSets = []
      var count = 0
      // Loop through categories
      for (const [key, value] of Object.entries(this.objsPerLevel)) {
        // Create empty data set
        let dataSet = {
          label: key,
          backgroundColor: this.colorRange(count / Object.keys(this.objsPerLevel).length),
          data: []
        }
        count++
        // Loop through levels on each category
        for (const [lvlKey, lvlValue] of Object.entries(value)) {
          // Append level name to labels if it hasn't already
          if (labels.indexOf(lvlKey) === -1) labels.push(lvlKey)
          // Push category count per level to dataset data
          dataSet.data.push(Object.keys(lvlValue).length)
        }
        // Add dataset to list
        dataSets.push(dataSet)
      }
      return {
        labels,
        datasets: dataSets,
      }
    }
  },
  async mounted() {
    this.processStreamObjects()
  },
  updated() {
    //this.processStreamObjects()
  },
  methods: {
    async processStreamObjects(){
      this.$emit("loaded", false)
      this.loader = new ObjectLoader({
        serverUrl: process.env.VUE_APP_SERVER_URL,
        streamId: this.streamId,
        objectId: this.objectId
      })
      var total = 0
      var count = 0

      function shouldIgnore(obj) {
        return obj.speckle_type.startsWith("Objects.Geometry") ||
            obj.speckle_type.endsWith("DataChunk")
      }

      const objectsPerLevel = {}
      const availableCategoriesAndTypes = {}

      for await (let obj of this.loader.getObjectIterator()) {
        // if (!total) total = obj.totalChildrenCount
        // console.log(`Progress: ${count++}/${total}`)

        // Objects per level
        if (obj.level) {
          var cat = obj.family || "None";
          var lvl = obj.level.name
          if (!objectsPerLevel[cat])
            objectsPerLevel[cat] = {}
          if (!objectsPerLevel[cat][lvl])
            objectsPerLevel[cat][lvl] = {}

          objectsPerLevel[cat][lvl][obj.elementId] = obj
        }

        // Available types and categories
        if (obj.category) {
          if (!availableCategoriesAndTypes[obj.category]) availableCategoriesAndTypes[obj.category] = {}
          if (!availableCategoriesAndTypes[obj.category][obj.family]) {
            availableCategoriesAndTypes[obj.category][obj.family] = 0
          }
          availableCategoriesAndTypes[obj.category][obj.family]++
        }
      }

      this.objsPerLevel = objectsPerLevel
      this.availableFamTypes = availableCategoriesAndTypes
      this.$emit("loaded", true)
    }
  }
}
</script>

<style scoped>
.scroll-box {
  overflow: scroll;
  padding: 1em;
}
.v-card {
  display: flex !important;
  flex-direction: column;
}

.v-card__text {
  flex-grow: 1;
  overflow: auto;
}
</style>