<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useServiceStore } from "../stores/serviceStore";
import { useRouter } from "vue-router";

// Stores and Router initialization
const authStore = useAuthStore();
const serviceStore = useServiceStore();
const router = useRouter();

// Local state for the "Add Service" form
const newService = ref({
  name: "",
  price: "",
  duration: 30, // default duration in minutes
});

// Load services when component mounts
onMounted(() => {
  serviceStore.fetchServices();
});

// Handlers
const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

const handleCreateService = async () => {
  if (!newService.value.name) return;

  try {
    await serviceStore.addService({
      name: newService.value.name,
      price: parseFloat(newService.value.price),
      duration: parseInt(newService.value.duration),
    });

    // Reset form
    newService.value = { name: "", price: "", duration: 30 };
    alert("Service created successfully!");
  } catch (error) {
    alert("Failed to create service");
  }
};

const handleDelete = async (id) => {
  if (confirm("Are you sure you want to delete this service?")) {
    await serviceStore.deleteService(id);
  }
};
</script>

<template>
  <div class="dashboard-layout">
    <header class="navbar">
      <div class="brand">SaaS Scheduler</div>
      <div class="user-info">
        <span>Bem-vindo, {{ authStore.user?.email }}</span>
        <button @click="handleLogout" class="btn-logout">Logout</button>
      </div>
    </header>

    <div class="actions-bar">
      <router-link to="/calendar" class="dashboard-btn">
        📅 Ver Agenda
      </router-link>

      <router-link to="/reports" class="dashboard-btn">
        📊 Ver Relatórios
      </router-link>
    </div>

    <main class="content">
      <section class="card form-card">
        <h2>Registre aqui um novo serviço</h2>
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
            <label>Duração (minutos)</label>
            <select v-model="newService.duration">
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">60 min</option>
            </select>
          </div>

          <button type="submit" class="btn-primary">Adicionar Serviço</button>
        </form>
      </section>

      <section class="services-list">
        <h2>Seus serviços</h2>

        <div v-if="serviceStore.loading">Carregando...</div>

        <div v-else-if="serviceStore.services.length === 0" class="empty-state">
          Sem serviços registrados ainda. Adicione algum acima!
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
              Delete
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Layout Structure */
.dashboard-layout {
  min-height: 100vh;
  background-color: #f4f6f8;
}

/* Navbar */
.navbar {
  background-color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.brand {
  font-weight: bold;
  font-size: 1.2rem;
  color: #2c3e50;
}

.user-info span {
  margin-right: 1rem;
  color: #666;
}

/* Content Area */
.content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Cards & Forms */
.card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
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
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Grid for Services */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.service-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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

/* Buttons */
.btn-primary {
  background-color: #42b983;
  color: white;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-logout {
  background: none;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete {
  background-color: #ffeaea;
  color: #e74c3c;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-delete:hover {
  background-color: #ffdada;
}

.actions-bar {
  display: flex;
  justify-content: flex-end;
  padding: 20px 2rem;
  margin-bottom: 10px;
}

.dashboard-btn {
  background-color: #9b59b6;
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;

  width: 200px;
  height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: none;
}

.dashboard-btn:hover {
  background-color: #8e44ad;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
</style>
