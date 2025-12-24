<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useServiceStore } from "../stores/serviceStore";
import Sidebar from "../components/Sidebar.vue";

// Stores initialization
const authStore = useAuthStore();
const serviceStore = useServiceStore();

// Local state for "Add Service" form
const newService = ref({
  name: "",
  price: "",
  duration: 30,
});

onMounted(() => {
  serviceStore.fetchServices();
});

const handleCreateService = async () => {
  if (!newService.value.name) return;

  try {
    await serviceStore.addService({
      name: newService.value.name,
      price: parseFloat(newService.value.price),
      duration: parseInt(newService.value.duration),
    });

    newService.value = { name: "", price: "", duration: 30 };
    alert("Serviço criado com sucesso!");
  } catch (error) {
    alert("Erro ao criar serviço");
  }
};

const handleDelete = async (id) => {
  if (confirm("Tem certeza que deseja excluir?")) {
    await serviceStore.deleteService(id);
  }
};
</script>

<template>
  <div class="dashboard-layout">
    <Sidebar />

    <main class="main-content">
      <header class="top-header">
        <h1>Painel de Controle</h1>
        <div class="user-badge">
          <span>Olá, {{ authStore.user?.email }}</span>
        </div>
      </header>

      <section class="card form-card">
        <h2>Registre um novo serviço</h2>
        <form @submit.prevent="handleCreateService" class="service-form">
          <div class="form-group">
            <label>Nome do Serviço</label>
            <input
              v-model="newService.name"
              placeholder="ex. Corte de cabelo"
              required
            />
          </div>

          <div class="form-group">
            <label>Preço (R$)</label>
            <input
              v-model="newService.price"
              type="number"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div class="form-group">
            <label>Duração</label>
            <select v-model="newService.duration">
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">60 min</option>
            </select>
          </div>

          <button type="submit" class="btn-primary">Adicionar</button>
        </form>
      </section>

      <section class="services-list">
        <h2>Seus serviços</h2>

        <div v-if="serviceStore.loading">Carregando...</div>

        <div v-else-if="serviceStore.services.length === 0" class="empty-state">
          Sem serviços registrados ainda.
        </div>

        <div v-else class="grid">
          <div
            v-for="service in serviceStore.services"
            :key="service.id"
            class="service-card"
          >
            <div class="service-info">
              <h3>{{ service.name }}</h3>
              <p>{{ service.duration }} mins • R$ {{ service.price }}</p>
            </div>
            <button @click="handleDelete(service.id)" class="btn-delete">
              Excluir
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  background-color: #f4f6f8;
  display: flex;
}

.main-content {
  flex: 1;
  margin-left: 70px; /* IMPORTANTE: Espaço reservado para a Sidebar fechada */
  padding: 2rem;
  transition: margin-left 0.3s ease;
}

.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.top-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
}

.user-badge {
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  color: #666;
  font-weight: 500;
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.service-form {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
}

.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.4rem;
}
.form-group input,
.form-group select {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.btn-primary {
  background-color: #9b59b6;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  height: 42px;
}

.btn-primary:hover {
  background-color: #8e44ad;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.service-card {
  background: white;
  padding: 1.2rem;
  border-radius: 12px;
  border: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s;
}

.service-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.service-info h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #2c3e50;
}
.service-info p {
  margin: 0.4rem 0 0 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.btn-delete {
  background-color: #fff5f5;
  color: #e74c3c;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-delete:hover {
  background-color: #fee2e2;
}

.empty-state {
  text-align: center;
  color: #999;
  margin-top: 2rem;
}
</style>
