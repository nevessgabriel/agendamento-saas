<script setup>
import StatsCard from "../components/StatsCard.vue";
import Sidebar from "../components/Sidebar.vue";
</script>

<template>
  <div class="layout">
    <Sidebar />

    <main class="main-content" style="margin-left: 70px; padding: 2rem">
      <h1 style="margin-bottom: 2rem; color: #2c3e50">Relatórios & Métricas</h1>

      <StatsCard />
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

.main-content > * {
  width: 100%;
  max-width: 1000px;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}
</style>
