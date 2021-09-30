<template>
  <v-container id="revitStream" class="d-flex fill-height align-center justify-center">
    <div v-if="!isRevitCommit" class="d-flex justify-center align-center primary--text">
      The latest commit on this stream does not come from Revit.
    </div>
    <div v-else-if="loading" class="d-flex flex-column justify-center align-center">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
      <p class="body-2 mt-2 primary--text">Processing your data...</p>
    </div>
    <div v-if="refObj && isRevitCommit" v-show="!loading">
      <object-loader-test v-if="selectedCommit"
                          :stream-id="streamId"
                          :object-id="selectedCommit.referencedObject"
                          @loaded="loading = !$event"
                          @legend-clicked="onLegendClick"
                          :info="refObj['@Project Information']"
                          :stream="stream">
      </object-loader-test>
    </div>

  </v-container>
</template>

<script>
import {getStreamCommits, getStreamObject} from "@/speckleUtils";
import RevitProjectInfo from "@/components/RevitProjectInfo";
import ObjectLoaderTest from "@/components/ObjectLoaderTest";
import Chart from "chart.js"

export default {
  name: "RevitStream",
  components: {ObjectLoaderTest},
  data() {
    return {
      stream: null,
      selectedCommit: null,
      refObj: null,
      serverUrl: process.env.VUE_APP_SERVER_URL,
      loading: true
    }
  },
  async mounted() {
    if (this.streamId) {
      this.getStream()
    }
  },
  computed: {
    streamId() {
      return this.$route.params.id
    },
    isRevitCommit() {
      return this.selectedCommit?.sourceApplication?.startsWith("Revit")
    }
  },
  methods: {
    async onLegendClick(e, legendItem) {
      Chart.helpers.each(Chart.instances, function (instance) {
        var chart = instance.chart
        const index = chart.legend.legendItems.findIndex(element => element.text === legendItem.text);
        if (index === -1) return
        const {
          type
        } = chart.config;
        if (type === 'pie' || type === 'doughnut') {
          // Pie and doughnut charts only have a single dataset and visibility is per item
          var ilen = (chart.data.datasets || []).length
          for (let i = 0; i < ilen; ++i) {
            var meta = chart.getDatasetMeta(i);
            // toggle visibility of index if exists
            if (meta.data[index]) {
              meta.data[index].hidden = !meta.data[index].hidden;
            }
          }
        } else {
          const meta = chart.getDatasetMeta(index);

          // See controller.isDatasetVisible comment
          meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null;

          // We hid a dataset ... rerender the chart
        }
        chart.update();
      })
    },
    async getStream() {
      var res = await getStreamCommits(this.streamId, 1, null)
      this.selectedCommit = res.data.stream.commits.items[0]
      this.stream = res.data.stream
    },
  },
  watch: {
    streamId: {
      handler: async function (val, oldVal) {
        if (val) this.getStream()
      }
    },
    selectedCommit: {
      handler: async function () {
        this.refObj = await getStreamObject(this.stream.id, this.selectedCommit.referencedObject)
      }
    }
  }
}
</script>

<style scoped>
.bg-img {
  background-position: center;
  background-repeat: no-repeat;
  /*background-attachment: fixed;*/
}

.max-h {
  max-height: 400px;
  height: 400px;
}
</style>