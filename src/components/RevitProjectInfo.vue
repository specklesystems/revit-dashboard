<template>
  <div>
    <v-card v-if="projectInfo">
      <v-card-title>{{projectInfo.name}} {{projectInfo.number}}<span class="d-flex align-center text-body-2 grey--text border pl-2"> <v-icon size="medium" color="grey" class="pr-1">mdi-home-circle-outline</v-icon>{{projectInfo.address}}</span></v-card-title>
      <v-card-subtitle class="d-flex aling-center">
        <v-icon size="small" class="pr-1">mdi-account-circle-outline</v-icon>{{projectInfo.author}}
        <v-icon size="small" class="pr-1 pl-2">mdi-calendar-check-outline</v-icon>{{projectInfo.status}}
      </v-card-subtitle>
    </v-card>
  </div>
</template>

<script>
import {getStreamObject} from "@/speckleUtils";

export default {
  name: "RevitProjectInfo",
  components: {},
  props: ["info"],
  data(){
    return {
      projectInfo: null
    }
  },
  watch: {
    info: {
      deep: true,
      immediate: true,
      handler: async function (val, oldVal) {
        if(!val) return
        var id = this.$store.state.currentStream.id
        var res = await getStreamObject(id, this.info[0].referencedId)
        console.log(res)
        this.projectInfo = res
      }
    }
  }
}
</script>

<style scoped>
.renderer-parent {
  height: 200px;
  width: 400px;
  background-color: antiquewhite;
}
</style>