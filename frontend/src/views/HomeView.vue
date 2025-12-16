<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const companies = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await api.get("/public/companies");
    companies.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar empresas", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="landing-page">
    <div class="hero">
      <h1>SaaS Scheduler</h1>
      <p>A plataforma completa para gerenciar sua barbearia ou clínica.</p>

      <div class="buttons">
        <router-link to="/login" class="btn-primary"
          >Área do Dono (Login)</router-link
        >
      </div>
    </div>

    <div class="demo-section">
      <h2>Encontre um estabelecimento</h2>

      <div v-if="loading">Carregando barbearias...</div>

      <div v-else-if="companies.length === 0">
        Nenhuma empresa cadastrada no momento.
      </div>

      <div v-else class="cards">
        <router-link
          v-for="company in companies"
          :key="company.id"
          :to="`/agendar/${company.slug}`"
          class="shop-card"
        >
          <div class="card-icon">💈</div>
          <h3>{{ company.name }}</h3>
          <p>Clique para agendar</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  font-family: "Segoe UI", sans-serif;
  text-align: center;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.hero {
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  padding: 5rem 1rem;
  margin-bottom: 2rem;
}
.hero h1 {
  margin: 0;
  font-size: 3rem;
  font-weight: 800;
}
.hero p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.btn-primary {
  background: #42b983;
  color: white;
  padding: 12px 25px;
  text-decoration: none;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1.1rem;
  transition: transform 0.2s;
  display: inline-block;
}
.btn-primary:hover {
  transform: scale(1.05);
  background: #3aa876;
}

.demo-section {
  padding: 0 2rem 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
.demo-section h2 {
  color: #333;
  margin-bottom: 2rem;
}

/* Grid de Cards */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.shop-card {
  background: white;
  padding: 2rem;
  text-decoration: none;
  color: #333;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.shop-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-color: #3498db;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.shop-card h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}
.shop-card p {
  margin: 0.5rem 0 0 0;
  color: #888;
  font-size: 0.9rem;
}
</style>
