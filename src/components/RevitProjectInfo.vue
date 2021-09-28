<template>
  <v-row>
    <v-col class="col-6">
      <p>Stream details</p>
      <v-card outlined>
        <v-card-title>
          {{ stream.name }}
          <v-btn outlined text small class="ml-3" :href="serverUrl+'/streams/'+stream.id">View in server</v-btn>
        </v-card-title>
        <v-card-subtitle>
        </v-card-subtitle>
      </v-card>
    </v-col>
    <v-col class="col-6">
      <p>Project information</p>
      <v-card v-if="projectInfo" outlined>
        <v-card-title>{{ projectInfo.name }} {{ projectInfo.number }}<span
            class="d-flex align-center text-body-2 grey--text border pl-2">
          <v-icon size="medium" color="grey"
                  class="pr-1">mdi-home-circle-outline</v-icon>{{ projectInfo.address }}</span>
        </v-card-title>
        <v-card-subtitle class="d-flex aling-center">
          <v-icon size="small" class="pr-1">mdi-account-circle-outline</v-icon>
          {{ projectInfo.author }}
          <v-icon size="small" class="pr-1 pl-2">mdi-calendar-check-outline</v-icon>
          {{ projectInfo.status }}
        </v-card-subtitle>
      </v-card>
      <v-card v-else>
        <v-card-subtitle>No project info was sent on this commit</v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {getStreamObject} from "@/speckleUtils";

export default {
  name: "RevitProjectInfo",
  components: {},
  props: ["info", "stream"],
  data() {
    return {
      projectInfo: null,
      serverUrl: process.env.VUE_APP_SERVER_URL
    }
  },
  watch: {
    info: {
      deep: true,
      immediate: true,
      handler: async function (val, oldVal) {
        if (!val) return
        var id = this.$route.params.id
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