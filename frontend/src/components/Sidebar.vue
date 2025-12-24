<script setup>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <span class="logo-icon">💈</span>
      <span class="logo-text">SaaS Scheduler</span>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-item" active-class="active">
        <span class="icon">🏠</span>
        <span class="text">Dashboard</span>
      </router-link>

      <router-link to="/calendar" class="nav-item" active-class="active">
        <span class="icon">📅</span>
        <span class="text">Agenda</span>
      </router-link>

      <router-link to="/reports" class="nav-item" active-class="active">
        <span class="icon">📊</span>
        <span class="text">Relatórios</span>
      </router-link>

      <router-link to="/history" class="nav-item" active-class="active">
        <span class="icon">📜</span>
        <span class="text">Histórico</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button @click="handleLogout" class="nav-item logout-btn">
        <span class="icon">🚪</span>
        <span class="text">Sair</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 70px;
  background: #2c3e50;
  color: white;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar:hover {
  width: 250px;
}

/* Header */
.sidebar-header {
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
}

.logo-icon {
  font-size: 1.8rem;
  margin-right: 1rem;
  min-width: 30px;
}
.logo-text {
  font-size: 1.2rem;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.2s;
}
.sidebar:hover .logo-text {
  opacity: 1;
}

.sidebar-nav {
  flex: 1;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1.4rem;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
  border-left: 4px solid transparent;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
}

.nav-item.active {
  background-color: rgba(255, 255, 255, 0.1);
  color: #9b59b6; /* Roxo do seu tema */
  border-left-color: #9b59b6;
}

.icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  min-width: 30px;
  display: flex;
  justify-content: center;
}
.text {
  opacity: 0;
  transition: opacity 0.2s;
  font-weight: 500;
}

.sidebar:hover .text {
  opacity: 1;
  transition-delay: 0.1s;
}

/* Footer (Logout) */
.sidebar-footer {
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.logout-btn {
  color: #e74c3c;
}
.logout-btn:hover {
  background-color: rgba(231, 76, 60, 0.1);
  color: #ff6b6b;
}
</style>
