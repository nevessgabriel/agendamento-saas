<script setup>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
// Import icons from Lucide
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  History,
  Settings,
  LogOut,
  Scissors,
} from "lucide-vue-next";

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
      <div class="icon-container">
        <Scissors :size="28" color="#42b983" />
      </div>
      <span class="logo-text">Central de Agendamento</span>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-item" active-class="active">
        <LayoutDashboard :size="22" />
        <span class="text">Dashboard</span>
      </router-link>

      <router-link to="/calendar" class="nav-item" active-class="active">
        <CalendarDays :size="22" />
        <span class="text">Agenda</span>
      </router-link>

      <router-link to="/reports" class="nav-item" active-class="active">
        <ClipboardList :size="22" />
        <span class="text">Relatórios</span>
      </router-link>

      <router-link to="/history" class="nav-item" active-class="active">
        <History :size="22" />
        <span class="text">Histórico</span>
      </router-link>

      <router-link to="/settings" class="nav-item" active-class="active">
        <Settings :size="22" />
        <span class="text">Configurações</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button @click="handleLogout" class="nav-item logout-btn">
        <LogOut :size="22" />
        <span class="text">Sair</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
/* Main Sidebar Container */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 70px;
  background: #1e293b;
  color: #94a3b8;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
}

/* EXPAND ON HOVER */
.sidebar:hover {
  width: 260px;
}

.sidebar-header {
  min-height: 80px;
  display: flex;
  align-items: center;
  padding: 0 1.2rem;
  background-color: rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.icon-container {
  min-width: 30px;
  display: flex;
  justify-content: center;
  margin-right: 1rem;
}

.logo-text {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  opacity: 0;
  white-space: nowrap;
  transition: opacity 0.2s;
  pointer-events: none;
}

.sidebar:hover .logo-text {
  opacity: 1;
  white-space: normal; /* ALLOW WRAP */
  line-height: 1.2;
  transition-delay: 0.1s;
}

.sidebar-nav {
  flex: 1;
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1.4rem;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
  border-left: 3px solid transparent;
  background: none;
  border: none;
  font-size: 0.95rem;
  cursor: pointer;
  width: 100%;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
}

.nav-item.active {
  background-color: rgba(66, 185, 131, 0.1);
  color: #42b983;
  border-left-color: #42b983;
}

.text {
  margin-left: 1rem;
  opacity: 0;
  transition: opacity 0.2s;
  font-weight: 500;
}

.sidebar:hover .text {
  opacity: 1;
  transition-delay: 0.1s;
}

.sidebar-footer {
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.logout-btn {
  color: #ef4444;
}

.logout-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: #f87171;
}
</style>
