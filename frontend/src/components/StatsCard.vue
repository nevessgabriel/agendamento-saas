<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../services/api";
// Chart.js imports
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const stats = ref(null);
const loading = ref(true);

// Fetch data from our new backend endpoint
const fetchStats = async () => {
  try {
    const response = await api.get("/stats");
    stats.value = response.data;
  } catch (error) {
    console.error("Error loading stats");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchStats();
});

// Prepare data for the Chart
const chartData = computed(() => {
  if (!stats.value || !stats.value.servicesDistribution) return null;

  return {
    labels: stats.value.servicesDistribution.map((item) => item.name),
    datasets: [
      {
        backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
        data: stats.value.servicesDistribution.map((item) => item.count),
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <div class="stats-container">
    <div v-if="loading">Loading charts...</div>

    <div v-else-if="stats" class="stats-grid">
      <div class="stat-card money">
        <h3>Receita estimada</h3>
        <p class="big-number">R$ {{ stats.overview.total_revenue }}</p>
      </div>

      <div class="stat-card">
        <h3>Total de reservas</h3>
        <p class="big-number">{{ stats.overview.total_appointments }}</p>
      </div>

      <div class="stat-card chart-card">
        <h3>Serviço mais popular</h3>
        <div class="chart-wrapper">
          <Doughnut
            v-if="chartData"
            :data="chartData"
            :options="chartOptions"
          />
          <p v-else>Sem data ainda.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Make the chart take full width on the next row or side column depending on layout */
.chart-card {
  grid-column: span 2; /* Occupy full width */
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.stat-card.money p {
  color: #42b983;
}

.big-number {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0.5rem 0;
  color: #2c3e50;
}

.chart-wrapper {
  height: 250px;
  position: relative;
}

h3 {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
