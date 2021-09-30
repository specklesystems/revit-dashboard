<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card max-height="500px">
          <v-card-title>Objects by category</v-card-title>
          <v-card-text>
            <doughnut-chart ref="doughnut" v-if="objsByCategoryData" :chart-data="objsByCategoryData"
                            :options="doughnutOptions"></doughnut-chart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-6">
        <v-card max-height="500px">
          <v-card-title>Elements Per Level/Category</v-card-title>
          <v-card-text>
            <horizontal-barchart v-if="objsByLevelData" :chart-data="objsByLevelData"
                                 :options="options"></horizontal-barchart>
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
                    <li v-for="(count, type) in item" :key="type">{{ type }}: {{ count }}</li>
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
import DoughnutChart from "@/components/charts/DoughnutChart";

export default {
  name: "ObjectLoaderTest",
  components: {DoughnutChart, HorizontalBarchart},
  props: ["streamId", "objectId", "revitData"],
  data() {
    return {
      loader: null,
      objsPerLevel: null,
      colorRange: interpolate(["#047EFB", "#4caf50"]),
      availableLevels: {},
      availableFamTypes: null,
      totals: {
        levels: 0,
        elements: 0,
        views: 0
      },
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
      doughnutOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'right',
          onClick: (e, legendItem) => {
            1
            console.log("legend item clicked", e, legendItem, this.$refs.doughnut.$data._chart)
            this.$emit("legend-clicked", e, legendItem)
          }
        },
        pieceLabel: {
          // mode 'label', 'value' or 'percentage', default is 'percentage'
          mode: 'value',

          // precision for percentage, default is 0
          precision: 0,

          // font size, default is defaultFontSize
          fontSize: 18,

          // font color, default is '#fff'
          fontColor: '#fff',

          // font style, default is defaultFontStyle
          fontStyle: 'bold',

          // font family, default is defaultFontFamily
          fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
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
    },
    objsByCategoryData() {
      // Fast exit if no object has been set yet
      if (!this.objsPerLevel) return null

      var labels = []
      var count = 0
      let dataSet = {
        backgroundColor: [],
        data: []
      }
      // Loop through categories
      for (const [key, value] of Object.entries(this.objsPerLevel)) {
        // Loop through levels on each category
        labels.push(key)
        dataSet.backgroundColor.push(this.colorRange(count / Object.keys(this.objsPerLevel).length))
        var total = 0
        for (const [lvlKey, lvlValue] of Object.entries(value)) {
          // Push category count per level to dataset data
          total += Object.keys(lvlValue).length
        }
        dataSet.data.push(total)
        count++
      }
      return {
        labels,
        datasets: [dataSet],
      }

    }
  },
  async mounted() {
    this.processStreamObjects()
  },
  watch: {
    streamId: {
      handler: function (val, oldVal) {
        this.processStreamObjects()
      }
    },
    objectId: {
      handler: function (val, oldVal) {
        this.processStreamObjects()
      }
    }
  },
  methods: {
    async processStreamObjects() {
      this.$emit("loaded", false)
      this.loader = new ObjectLoader({
        serverUrl: process.env.VUE_APP_SERVER_URL,
        streamId: this.streamId,
        objectId: this.objectId
      })

      function shouldIgnore(obj) {
        return obj.speckle_type.startsWith("Objects.Geometry") ||
            obj.speckle_type.endsWith("DataChunk") ||
            obj.speckle_type.endsWith("ElementType") ||
            obj.speckle_type === "Base" ||
            obj.speckle_type.endsWith("ProjectInfo")
      }

      const typeCategoryMap = {}
      const objectsPerLevel = {}
      const availableCategoriesAndTypes = {}
      var totalViews = 0
      var totalElements = 0

      for await (let obj of this.loader.getObjectIterator()) {
        // if (!total) total = obj.totalChildrenCount
        // console.log(`Progress: ${count++}/${total}`)

        if (obj.speckle_type.endsWith("ElementType")) {
          typeCategoryMap[obj.type] = obj.category
          if (!availableCategoriesAndTypes[obj.category]) availableCategoriesAndTypes[obj.category] = {}
          if (!availableCategoriesAndTypes[obj.category][obj.family]) {
            availableCategoriesAndTypes[obj.category][obj.family] = {}
          }
          availableCategoriesAndTypes[obj.category][obj.family][obj.type] = obj
          continue
        }

        if (obj.speckle_type === "Objects.BuiltElements.View" || obj.speckle_type === "Objects.BuiltElements.View:Objects.BuiltElements.View3D") {
          totalViews++
          continue
        }

        // Objects per level
        if (shouldIgnore(obj)) continue
        totalElements++

        var cat = obj.type || "Other"
        var lvl = obj.level?.name || "No level"
        if (lvl !== "No level") {
          this.availableLevels[lvl] = obj.level
        }
        if (!objectsPerLevel[cat])
          objectsPerLevel[cat] = {}
        if (!objectsPerLevel[cat][lvl])
          objectsPerLevel[cat][lvl] = {}

        objectsPerLevel[cat][lvl][obj.elementId] = obj
      }
      var catsPerLevel = {}
      Object.keys(objectsPerLevel).forEach(fam => {
        var value = objectsPerLevel[fam]
        var cat = typeCategoryMap[fam]
        if (!catsPerLevel[cat]) catsPerLevel[cat] = {}
        Object.keys(value).forEach(levelKey => {
          console.log(levelKey)
          if (!catsPerLevel[cat][levelKey]) catsPerLevel[cat][levelKey] = {}
          catsPerLevel[cat][levelKey] = {...catsPerLevel[cat][levelKey], ...objectsPerLevel[fam][levelKey]}
        })
      })

      this.objsPerLevel = catsPerLevel
      this.availableFamTypes = availableCategoriesAndTypes
      this.totals.levels = Object.keys(this.availableLevels).length
      this.totals.views = totalViews
      this.totals.elements = totalElements
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