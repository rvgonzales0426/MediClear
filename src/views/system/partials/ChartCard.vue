<script setup>
import { Bar, Pie, Line, Doughnut } from 'vue-chartjs'
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

defineProps({
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

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
    },
  },
}
</script>

<template>
  <v-card elevation="4">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <div :style="{ height: height + 'px' }">
        <Bar v-if="chartType === 'bar'" :data="chartData" :options="chartOptions" />
        <Pie v-else-if="chartType === 'pie'" :data="chartData" :options="chartOptions" />
        <Line v-else-if="chartType === 'line'" :data="chartData" :options="chartOptions" />
        <Doughnut v-else-if="chartType === 'doughnut'" :data="chartData" :options="chartOptions" />
      </div>
    </v-card-text>
  </v-card>
</template>
