<script setup>
import { ref, onMounted, watch } from "vue";
import api from "../services/api";
import Sidebar from "../components/Sidebar.vue";
import RevenueChart from "../components/RevenueChart.vue";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";

// Register ChartJS components for Doughnut
ChartJS.register(ArcElement, Tooltip, Legend);

// --- STATE ---
const stats = ref({ revenue: 0, bookings: 0 });
const monthlyData = ref([]);
const loading = ref(true);
const chartLoading = ref(false);

// Filters State
const selectedPeriod = ref(6); // Default: Last 6 months
const customStart = ref("");
const customEnd = ref("");

// Filter Options
const periods = [
  { label: "Mensal", value: 1 },
  { label: "Trimestral", value: 3 },
  { label: "Semestral", value: 6 },
  { label: "Anual", value: 12 },
];

// Doughnut Chart Data & Options
const doughnutData = ref({
  labels: [],
  datasets: [],
});

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      labels: { boxWidth: 15, padding: 15 },
    },
  },
};

const fetchRevenueChart = async () => {
  chartLoading.value = true;
  try {
    let url = "/reports/charts?type=monthly_revenue";

    if (customStart.value && customEnd.value) {
      url += `&startDate=${customStart.value}&endDate=${customEnd.value}`;
    } else {
      url += `&range=${selectedPeriod.value || 6}`;
    }

    const res = await api.get(url);

    monthlyData.value = res.data.map((item) => ({
      month: item.label, // Format: YYYY-MM
      total: Number(item.value),
    }));
  } catch (error) {
    console.error("Error fetching revenue chart:", error);
  } finally {
    chartLoading.value = false;
  }
};

const selectQuickPeriod = (val) => {
  customStart.value = "";
  customEnd.value = "";
  selectedPeriod.value = val;
  fetchRevenueChart();
};

const handleCustomDateSearch = () => {
  if (customStart.value && customEnd.value) {
    selectedPeriod.value = null;
    fetchRevenueChart();
  } else {
    alert("Please select both Start and End dates.");
  }
};

onMounted(async () => {
  try {
    console.log("Iniciando carregamento do dashboard...");
    loading.value = true;

    const resSummary = await api.get("/reports/summary");
    stats.value = resSummary.data;
    console.log("Resumo carregado:", stats.value);

    const resServices = await api.get("/reports/charts?type=popular_services");
    if (resServices.data.length > 0) {
      doughnutData.value = {
        labels: resServices.data.map((s) => s.label),
        datasets: [
          {
            backgroundColor: [
              "#42b983",
              "#35495e",
              "#FFCE56",
              "#36A2EB",
              "#FF6384",
            ],
            data: resServices.data.map((s) => Number(s.value)),
            borderWidth: 1,
          },
        ],
      };
    }

    await fetchRevenueChart();
    console.log("Gráficos carregados.");
  } catch (error) {
    console.error("Erro fatal no dashboard:", error);
    alert(
      "Erro ao carregar dados. Verifique se o servidor backend está rodando.",
    );
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="layout">
    <Sidebar />

    <main class="main-content">
      <h1 class="page-title">Relatórios & Métricas</h1>

      <div v-if="loading" class="loading-state">Loading dashboard data...</div>

      <div v-else class="dashboard-grid">
        <div class="kpi-card">
          <h3>Receita Total</h3>
          <p class="big-number">R$ {{ Number(stats.revenue).toFixed(2) }}</p>
        </div>
        <div class="kpi-card">
          <h3>Total Reservas</h3>
          <p class="big-number">{{ stats.bookings }}</p>
        </div>

        <div class="chart-card wide">
          <div class="chart-header">
            <h3>Faturamento</h3>

            <div class="toolbar">
              <div class="quick-filters">
                <button
                  v-for="p in periods"
                  :key="p.value"
                  @click="selectQuickPeriod(p.value)"
                  :class="[
                    'btn-filter',
                    { active: selectedPeriod === p.value },
                  ]"
                >
                  {{ p.label }}
                </button>
              </div>

              <div class="separator">|</div>

              <div class="custom-dates">
                <input type="date" v-model="customStart" class="date-input" />
                <span class="to">até</span>
                <input type="date" v-model="customEnd" class="date-input" />
                <button @click="handleCustomDateSearch" class="btn-go">
                  OK
                </button>
              </div>
            </div>
          </div>

          <div class="chart-wrapper-bar">
            <div v-if="chartLoading" class="mini-loading">Atualizando...</div>

            <div v-else-if="monthlyData.length === 0" class="empty-chart">
              <p>Nenhum dado financeiro encontrado neste período.</p>
            </div>

            <RevenueChart v-else :chartData="monthlyData" />
          </div>
        </div>

        <div class="chart-card">
          <h3>Serviços Populares</h3>
          <div class="chart-wrapper">
            <div
              v-if="doughnutData.labels && doughnutData.labels.length > 0"
              class="h-100"
            >
              <Doughnut :data="doughnutData" :options="doughnutOptions" />
            </div>

            <div v-else class="empty-chart">
              <p>Sem dados de serviços ainda.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* --- Layout --- */
.layout {
  min-height: 100vh;
  background-color: #f4f6f8;
  display: flex;
}
.main-content {
  flex: 1;
  margin-left: 70px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.page-title {
  margin-bottom: 2rem;
  color: #2c3e50;
  align-self: flex-start;
  margin-left: 2rem;
}

/* --- Grid System --- */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 100%;
  max-width: 1100px;
}
.wide {
  grid-column: span 2;
}

/* --- Cards --- */
.kpi-card,
.chart-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}
.kpi-card h3 {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
  text-transform: uppercase;
}
.big-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #42b983;
  margin: 10px 0 0 0;
}

/* --- Filter Toolbar --- */
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 15px;
}
.chart-header h3 {
  margin: 0;
  color: #2c3e50;
}

.toolbar {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  padding: 5px;
  border-radius: 8px;
  border: 1px solid #eee;
  flex-wrap: wrap;
  gap: 10px;
}
.quick-filters {
  display: flex;
  gap: 2px;
}

.btn-filter {
  border: none;
  background: transparent;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  color: #666;
  font-size: 0.85rem;
}
.btn-filter:hover {
  background: rgba(0, 0, 0, 0.05);
}
.btn-filter.active {
  background: white;
  color: #42b983;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.separator {
  color: #ddd;
}

.custom-dates {
  display: flex;
  align-items: center;
  gap: 5px;
}
.date-input {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px;
  font-size: 0.85rem;
  color: #555;
}
.to {
  font-size: 0.8rem;
  color: #888;
}
.btn-go {
  background: #42b983;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}
.btn-go:hover {
  background: #3aa876;
}

.chart-wrapper {
  height: 300px;
  position: relative;
}
.chart-wrapper-bar {
  height: 350px;
  position: relative;
}
.h-100 {
  height: 100%;
  width: 100%;
}

.loading-state {
  font-size: 1.2rem;
  color: #666;
  margin-top: 3rem;
}
.empty-chart {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-style: italic;
  background: #fafafa;
  border-radius: 8px;
  border: 1px dashed #eee;
}
.mini-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #42b983;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
}

/* --- Mobile --- */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .wide {
    grid-column: span 1;
  }
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .toolbar {
    width: 100%;
    justify-content: space-between;
    margin-top: 10px;
  }
  .custom-dates {
    flex-wrap: wrap;
    width: 100%;
    margin-top: 5px;
  }
  .main-content {
    margin-left: 0;
  }
}
</style>
