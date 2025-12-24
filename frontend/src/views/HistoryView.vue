<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import Sidebar from "../components/Sidebar.vue"; // <--- 1. Importe a Sidebar

const history = ref([]);
const loading = ref(false);

const filters = ref({
  startDate: new Date(new Date().setDate(new Date().getDate() - 30))
    .toISOString()
    .substr(0, 10),
  endDate: new Date().toISOString().substr(0, 10),
});

const fetchHistory = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      startDate: filters.value.startDate,
      endDate: filters.value.endDate,
    }).toString();
    const res = await api.get(`/schedules/history?${params}`);
    history.value = res.data;
  } catch (error) {
    alert("Erro ao carregar histórico");
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  fetchHistory();
});
</script>

<template>
  <div class="layout">
    <Sidebar />

    <main class="main-content" style="margin-left: 70px; padding: 2rem">
      <h1 style="margin-bottom: 2rem; color: #2c3e50">
        Histórico de Agendamentos
      </h1>

      <div class="filters-card">
        <div class="filter-group">
          <label>De:</label>
          <input type="date" v-model="filters.startDate" />
        </div>
        <div class="filter-group">
          <label>Até:</label>
          <input type="date" v-model="filters.endDate" />
        </div>
        <button @click="fetchHistory" class="btn-filter">Filtrar</button>
      </div>

      <div class="table-container">
        <div v-if="loading" class="loading">Carregando...</div>
        <div v-else-if="history.length === 0" class="empty">
          Nenhum agendamento encontrado neste período.
        </div>

        <table v-else class="history-table">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Cliente</th>
              <th>Telefone</th>
              <th>Serviço</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in history" :key="item.id">
              <td>{{ formatDate(item.start_time) }}</td>
              <td>{{ item.client_name }}</td>
              <td>{{ item.client_phone || "-" }}</td>
              <td>{{ item.service_name }}</td>
              <td class="price">R$ {{ item.price }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<style scoped>
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

.filters-card,
.table-container,
h1 {
  width: 100%;
  max-width: 1000px;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.filters-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.filter-group {
  display: flex;
  flex-direction: column;
}
.filter-group label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.2rem;
}
.filter-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.btn-filter {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.btn-filter:hover {
  background: #2980b9;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.history-table {
  width: 100%;
  border-collapse: collapse;
}
.history-table th,
.history-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.history-table th {
  background-color: #f8f9fa;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
}
.history-table tr:hover {
  background-color: #f1f1f1;
}
.price {
  color: #27ae60;
  font-weight: bold;
}
.empty {
  padding: 2rem;
  text-align: center;
  color: #888;
}
</style>
