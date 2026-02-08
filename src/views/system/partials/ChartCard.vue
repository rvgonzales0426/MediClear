<script setup>
import { Bar, Pie, Line, Doughnut } from 'vue-chartjs'
import { computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
)

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  chartData: {
    type: Object,
    required: true,
  },
  chartType: {
    type: String,
    default: 'bar',
    validator: (value) => ['bar', 'pie', 'line', 'doughnut'].includes(value),
  },
  height: {
    type: Number,
    default: 300,
  },
})

// Responsive chart options based on chart type
const chartOptions = computed(() => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 11,
          },
        },
      },
      title: {
        display: false,
      },
    },
  }

  // Special handling for pie and doughnut charts on mobile
  if (props.chartType === 'pie' || props.chartType === 'doughnut') {
    return {
      ...baseOptions,
      plugins: {
        ...baseOptions.plugins,
        legend: {
          position: window.innerWidth < 768 ? 'bottom' : 'top',
          labels: {
            boxWidth: 12,
            padding: window.innerWidth < 768 ? 8 : 10,
            font: {
              size: window.innerWidth < 768 ? 10 : 11,
            },
          },
        },
      },
    }
  }

  return baseOptions
})
</script>

<template>
  <v-card elevation="4">
    <v-card-title class="text-wrap">{{ title }}</v-card-title>
    <v-card-text>
      <div :style="{ height: height + 'px', minHeight: '250px' }">
        <Bar v-if="chartType === 'bar'" :data="chartData" :options="chartOptions" />
        <Pie v-else-if="chartType === 'pie'" :data="chartData" :options="chartOptions" />
        <Line v-else-if="chartType === 'line'" :data="chartData" :options="chartOptions" />
        <Doughnut v-else-if="chartType === 'doughnut'" :data="chartData" :options="chartOptions" />
      </div>
    </v-card-text>
  </v-card>
</template>
