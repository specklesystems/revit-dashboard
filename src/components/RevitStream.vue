<template>
  <v-container id="revitStream" class="pa-6">
    <v-container v-if="refObj">
      <v-row>
        <v-col>
          <revit-project-info :info="refObj['@Project Information']" :stream="stream"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="col-12">
          <revit-categories :revit-data="refObj"></revit-categories>
        </v-col>
        <v-col class="col-12">
<!--          <traverse-test :stream-id="streamId" :object="refObj"></traverse-test>-->
          <object-loader-test v-if="selectedCommit" :stream-id="streamId" :object-id="selectedCommit.referencedObject"></object-loader-test>
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

export default {
  name: "RevitStream",
  components: {ObjectLoaderTest, RevitCategories, RevitProjectInfo},
  data(){
    return {
      stream: null,
      selectedCommit: null,
      refObj: null,
      serverUrl: process.env.VUE_APP_SERVER_URL
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
    clearSelection(){
      this.$store.dispatch('clearStreamSelection')
      this.stream = null
      this.refObj = null
      this.selectedCommit = null
    },

    async getStream(){
      console.log(this.streamId)
      var res = await getStreamCommits(this.streamId,1,null)
      console.log(res)
      console.log("commits", res.data.stream.commits.items)
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
      console.log(blob)
      const imgUrl = URL.createObjectURL(blob)
      if (this.$refs.cover) this.$refs.cover.style.backgroundImage = `url('${imgUrl}')`
    },
  },
  watch: {
    streamId: {
      handler: async function(val, oldVal) {
        console.log("streamId changed", val, oldVal)
        if(val) this.getStream()
      }
    },
    selectedCommit: {
      handler: async function (val, oldVal) {
        console.log("selectedCommit changed")
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