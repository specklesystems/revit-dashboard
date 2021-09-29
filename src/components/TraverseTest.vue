<template>
  <v-card>
    <v-card-text>
      <p v-for="res in traverseResult" :key="res.elementId">{{ res.name }}</p>
    </v-card-text>
  </v-card>
</template>

<script>
import {traverseAndMatch} from "@/speckleTraverse";

export default {
  name: "TraverseTest",
  props: ["streamId", "object"],
  data() {
    return {
      traverseResult: null,
      cache: {},
      ignored: ["@Project Information", "@parameters", "@data"]
    }
  },
  async mounted() {
    if (this.object) {
      this.traverseResult = await traverseAndMatch(
          this.streamId,
          this.object["@Floors"],
          (obj) => obj.speckle_type === "Objects.BuiltElements.Level:Objects.BuiltElements.Revit.RevitLevel" ),
          this.ignored,
          this.cache
    }
  }
}
</script>

<style scoped>

</style>