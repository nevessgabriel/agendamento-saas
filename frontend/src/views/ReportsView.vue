<script setup>
import StatsCard from '../components/StatsCard.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="reports-layout">
    <header class="navbar">
      <div class="brand">Relatórios & Métricas</div>
      <button @click="router.push('/dashboard')" class="btn-back">
        Voltar ao Dashboard
      </button>
    </header>

    <main class="content">
      <StatsCard />
    </main>
  </div>
</template>

<style scoped>
.reports-layout {
  min-height: 100vh;
  background-color: #f4f6f8;
}

.navbar {
  background-color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
}

.brand {
  font-weight: bold;
  font-size: 1.2rem;
  color: #2c3e50;
}

.content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.btn-back {
  background: none;
  border: 1px solid #666;
  color: #666;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back:hover {
  background-color: #666;
  color: white;
}
</style>