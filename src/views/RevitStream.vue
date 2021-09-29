<template>
  <v-container id="revitStream" class="d-flex fill-height align-center justify-center">
    <div v-if="!isRevitCommit" class="d-flex justify-center align-center primary--text">
      The latest commit on this stream does not come from Revit.
    </div>
    <div v-else-if="loading" class="d-flex flex-column justify-center align-center">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
      <p class="body-2 mt-2 primary--text">Processing your data...</p>
    </div>

    <v-container v-if="refObj && isRevitCommit" v-show="!loading">
      <v-row>
        <v-col>
          <revit-project-info v-if="!loading" :info="refObj['@Project Information']" :stream="stream"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="col-12">
          <revit-categories v-if="!loading" :revit-data="refObj" @legend-clicked="onLegendClick"></revit-categories>
        </v-col>
        <v-col class="col-12">
          <object-loader-test v-if="selectedCommit" :stream-id="streamId" :object-id="selectedCommit.referencedObject" @loaded="loading = !$event" ></object-loader-test>
        </v-col>
      </v-row>
      <v-row><v-col></v-col></v-row>
    </v-container>

  </v-container>
</template>

<script>
import {getStreamCommits, getStreamObject} from "@/speckleUtils";
import RevitProjectInfo from "@/components/RevitProjectInfo";
import RevitCategories from "@/components/RevitCategories";
import TraverseTest from "@/components/TraverseTest";
import ObjectLoaderTest from "@/components/ObjectLoaderTest";
import Chart from "chart.js"

export default {
  name: "RevitStream",
  components: {ObjectLoaderTest, RevitCategories, RevitProjectInfo},
  data(){
    return {
      stream: null,
      selectedCommit: null,
      refObj: null,
      serverUrl: process.env.VUE_APP_SERVER_URL,
      loading: true
    }
  },
  async mounted(){
    if(this.streamId){
      this.getStream()
    }
  },
  computed: {
    streamId(){ return this.$route.params.id },
    isRevitCommit() { return this.selectedCommit?.sourceApplication?.startsWith("Revit")}
  },
  methods: {
    async onLegendClick(e, legendItem){
      console.log("legend click event", e, legendItem)
      Chart.helpers.each(Chart.instances, function(instance){
        console.log(instance.chart)
        var chart = instance.chart
        const index = legendItem.index;
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
          const index = legendItem.index;
          const meta = chart.getDatasetMeta(index);

          // See controller.isDatasetVisible comment
          meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null;

          // We hid a dataset ... rerender the chart
        }
        chart.update();
      })
    },
    async getStream(){
      var res = await getStreamCommits(this.streamId,1,null)
      this.selectedCommit = res.data.stream.commits.items[0]
      this.stream = res.data.stream
    },
    async getPreviewImage(angle) {
      angle = angle || 0
      let previewUrl = `${this.serverUrl}/preview/${this.streamId}/objects/${this.selectedCommit.referencedObject}/${angle}`

      let token = undefined
      try {
        token = localStorage.getItem('AuthToken')
      } catch (e) {
        console.warn('Sanboxed mode, only public streams will fetch properly.')
      }
      const res = await fetch(previewUrl, {
        mode: "cors",
        headers: token ? { Authorization: `Bearer ${token}`, 'Access-Control-Allow-Origin': '*' } : {'Access-Control-Allow-Origin': '*'}
      })
      const blob = await res.blob()
      const imgUrl = URL.createObjectURL(blob)
      if (this.$refs.cover) this.$refs.cover.style.backgroundImage = `url('${imgUrl}')`
    },
  },
  watch: {
    streamId: {
      handler: async function(val, oldVal) {
        if(val) this.getStream()
      }
    },
    selectedCommit: {
      handler: async function (val, oldVal) {
        var obj = await getStreamObject(this.stream.id, this.selectedCommit.referencedObject)
        this.refObj = obj
        //this.getPreviewImage(0)
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