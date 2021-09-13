<template>
  <v-card>
    <v-card-title>Objects by category</v-card-title>
    <v-card-text><doughnut :options="options" :chart-data="chartData"></doughnut></v-card-text>
  </v-card>
</template>

<script>
import RandomChart from "@/components/charts/RandomChart";
import Doughnut from "@/components/charts/LineChart";
import interpolate from "color-interpolate"

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export default {
  name: "RevitCategories",
  components: {Doughnut},
  props: ["revitData"],
  data(){
    return {
      options: {
        responsive: true,
        legend: {
          display: false
        }
      },
      colorRange: interpolate(["#047EFB","#4caf50"])
    }
  },
  computed: {
    chartData(){
      if(!this.revitData) return null;
      var data = {
        labels: [],
        datasets: [
          {
            backgroundColor: [],
            data: [],
          }
        ],
      }
      let index = 0
      Object.keys(this.revitData).sort().forEach(key => {
        if(key.startsWith("__")
            || key == "id"
            || key == "totalChildrenCount"
            || key == "speckle_type"
            || ["@Project Information"].indexOf(key) !== -1) return;
        var label = null
        if(key.startsWith("@")) label = key.split("@")[1]
        data.labels.push(label)
        data.datasets[0].data.push(this.revitData[key].length)
        let color = this.colorRange(index/(Object.keys(this.revitData).length - 1))
        data.datasets[0].backgroundColor.push(color)
        index++
      })
      return data;
    }
  }
}
</script>

<style scoped>

</style>