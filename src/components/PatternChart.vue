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
        tooltips: {
          enabled: true,
          displayColors: false,
          callbacks: {
            title: function (tooltipItem, data) {
              if (data.labels[tooltipItem[0].index] === 'iBRV') {
                return 'Base Initial BRV'
              } else if (data.labels[tooltipItem[0].index] === 'mBRV') {
                return 'Base Max BRV'
              }
              return 'Base ' + data.labels[tooltipItem[0].index]
            },
            label: function (tooltipItem, data) {
              switch (data.datasets[0].data[tooltipItem.index]) {
                case 1:
                  return data.datasets[1].data[tooltipItem.index] + ' ★'
                case 2:
                  return data.datasets[1].data[tooltipItem.index] + ' ★★'
                case 3:
                  return data.datasets[1].data[tooltipItem.index] + ' ★★★'
                case 4:
                  return data.datasets[1].data[tooltipItem.index] + ' ★★★★'
                case 5:
                  return data.datasets[1].data[tooltipItem.index] + ' ★★★★★'
                default:
                  return data.datasets[1].data[tooltipItem.index]
              }
            }
          }
        },
        legend: {
          display: false
        },
        scale: {
          pointLabels: {
            fontSize: 12,
            fontColor: 'rgba(204, 204, 204, 1)',
            fontFamily: 'Open Sans'
          },
          angleLines: {
            lineWidth: 1,
            color: '#5b5b5b'
          },
          gridLines: {
            lineWidth: 1,
            color: '#5b5b5b'
          },
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
        maintainAspectRatio: false
      }
    }
  },
  created () {
    this.chartData = {
      labels: ['HP', 'DEF', 'mBRV', 'iBRV', 'ATK'],
      datasets: [
        {
          label: 'Pattern',
          backgroundColor: '#80a0c9',
          borderColor: '#80a0c9',
          borderWidth: 1,
          pointStyle: 'circle',
          pointHoverRadius: 3,
          pointRadius: 0,
          pointHitRadius: 10,
          pointBorderColor: 'rgba(0,0,0,0)',
          pointBackgroundColor: 'rgba(255,255,255,1)',
          data: this.data[0]
        },
        {
          label: 'Base Stat',
          data: this.data[1],
          hidden: true
        }
      ]
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.chartOptions)
  },
  watch: {
    data: function () {
      this.chartData.datasets[0].data = this.data[0]
      this.chartData.datasets[1].data = this.data[1]
      this.$data._chart.destroy()
      // Destroy before re-rendering cause it keep previous data
      this.renderChart(this.chartData, this.chartOptions)
    }
  }
}
</script>