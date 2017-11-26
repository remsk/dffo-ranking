<script>
import { Radar } from 'vue-chartjs'

export default {
  name: 'PatternChart',
  extends: Radar,
  props: ['data'],
  data () {
    return {
      chartData: {},
      chartOptions: {
        legend: {
          display: false
        },
        scale: {
          ticks: {
            max: 5,
            min: 0,
            stepSize: 1,
            showLabelBackdrop: false,
            callback: function (value, index, values) {
              return ''
            }
          }
        },
        responsive: false,
        maintainAspectRatio: true
      }
    }
  },
  created () {
    this.chartData = {
      labels: ['HP', 'iBRV', 'mBRV', 'ATK', 'DEF'],
      datasets: [
        {
          label: 'stats',
          backgroundColor: '#f87979',
          data: this.data
        }
      ]
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.chartOptions)
  },
  watch: {
    data: function () {
      this.chartData.datasets[0].data = this.data
      this.$data._chart.destroy()
      // Destroy before re-rendering cause it keep previous data
      this.renderChart(this.chartData, this.chartOptions)
    }
  }
}
</script>