<script setup>
import { computed } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const props = defineProps({
  chartData: {
    type: Array,
    required: true,
  },
});

// Configure Chart Data Structure
const data = computed(() => {
  return {
    // X-Axis Labels (Months)
    labels: props.chartData.map((item) => item.month),
    datasets: [
      {
        label: "Receita (R$)",
        backgroundColor: "#42b983",
        data: props.chartData.map((item) => item.total),
        borderRadius: 6,
      },
    ],
  };
});

// Chart Visual Options
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `R$ ${context.raw.toFixed(2)}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: "#f0f0f0" },
    },
    x: {
      grid: { display: false },
    },
  },
};
</script>

<template>
  <div class="chart-container">
    <Bar :data="data" :options="options" />
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
