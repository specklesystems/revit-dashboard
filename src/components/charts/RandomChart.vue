<template>
  <div style="display: block">
    <doughnut-chart v-if="datacollection" :chart-data="datacollection" :options="options"></doughnut-chart>
  </div>
</template>

<script>
import DoughnutChart from './DoughnutChart.js'

export default {
  components: {
    DoughnutChart
  },
  data () {
    return {
      datacollection: null,
      options: {
        responsive: true,
        legend: {
          display: false
        }
      }
    }
  },
  mounted () {
    this.fillData()
  },
  methods: {
    fillData () {
      this.datacollection = {
        labels: ["Data One", 'two', 'three'],
        datasets: [
          {
            // backgroundColor: ["green", "blue", "red", "orange", "black"],
            data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
          }
        ],

      }
    },
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  }
}
</script>

<style>
.small {
  max-width: 600px;
  margin:  150px auto;
}
</style>