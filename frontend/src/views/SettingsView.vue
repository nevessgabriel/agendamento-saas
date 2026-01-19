<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import Sidebar from "../components/Sidebar.vue";
import { useToast } from "vue-toastification";

const toast = useToast();

// Reactive state for the form
const form = ref({
  name: "",
  slug: "",
  phone: "",
  address: "",
});

const loading = ref(false);

onMounted(async () => {
  try {
    const res = await api.get("/company/me");
    form.value = res.data;
  } catch (error) {
    toast.error("Erro ao carregar configurações.");
    console.error(error);
  }
});

const handleUpdate = async () => {
  loading.value = true;
  try {
    await api.put("/company/me", form.value);
    toast.success("Configurações salvas com sucesso!");
  } catch (error) {
    const msg = error.response?.data?.error || "Falha ao atualizar.";
    toast.error(msg);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="layout">
    <Sidebar />

    <main class="main-content">
      <div class="settings-card">
        <header>
          <h2>Configurações da Empresa</h2>
          <p>Atualize as informações visíveis para seus clientes.</p>
        </header>

        <form @submit.prevent="handleUpdate" class="settings-form">
          <div class="form-group">
            <label>Nome da Empresa</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Ex: Empresa do Seu Zé"
            />
          </div>

          <div class="form-group">
            <label>Endereço do Site</label>
            <div class="input-group">
              <span class="prefix">yoursite.com/book/</span>
              <input
                v-model="form.slug"
                type="text"
                required
                placeholder="Seu-Ze-Barbearia"
              />
            </div>
            <small>Este é o link que você compartilha com seus clientes.</small>
          </div>

          <div class="form-group">
            <label>Telefone / WhatsApp</label>
            <input
              v-model="form.phone"
              type="text"
              placeholder="(55) 99999-9999"
            />
          </div>

          <div class="form-group">
            <label>Endereço</label>
            <input v-model="form.address" type="text" placeholder="Rua 15" />
          </div>

          <button type="submit" class="btn-save" :disabled="loading">
            {{ loading ? "Saving..." : "Salvar Alterações" }}
          </button>
        </form>
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
  justify-content: center;
}

.settings-card {
  background: white;
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  height: fit-content;
}

header {
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}
header h2 {
  margin: 0;
  color: #2c3e50;
}
header p {
  margin: 5px 0 0 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #34495e;
  margin-bottom: 0.5rem;
}
.form-group input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}
.form-group small {
  color: #888;
  font-size: 0.8rem;
  margin-top: 4px;
}

.input-group {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}
.input-group .prefix {
  background: #f8f9fa;
  padding: 10px;
  color: #666;
  font-size: 0.9rem;
  border-right: 1px solid #ddd;
}
.input-group input {
  border: none;
  outline: none;
  flex: 1;
  border-radius: 0;
}

.btn-save {
  background-color: #3498db;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1rem;
}
.btn-save:hover {
  background-color: #2980b9;
}
.btn-save:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}
</style>
