<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../services/api";

const route = useRoute();
const companySlug = route.params.slug;
const companyIdReal = ref(null);

const company = ref(null);
const services = ref([]);
const loading = ref(true);
const success = ref(false);

// Form Data
const form = ref({
  serviceId: "",
  date: "",
  time: "",
  clientName: "",
  clientPhone: "",
});

// Load Company Data
onMounted(async () => {
  try {
    const res = await api.get(`/public/${companySlug}`);

    company.value = res.data.company;
    services.value = res.data.services;

    companyIdReal.value = res.data.company.id;
  } catch (error) {
    alert("Empresa não encontrada ou link inválido");
  } finally {
    loading.value = false;
  }
});

// Handle Form Submission
const handleSubmit = async () => {
  try {
    const fullDateTime = `${form.value.date}T${form.value.time}:00`;

    await api.post("/public/book", {
      companyId: companyIdReal.value,
      serviceId: form.value.serviceId,
      clientName: form.value.clientName,
      clientPhone: form.value.clientPhone,
      startTime: fullDateTime,
    });

    success.value = true;
  } catch (error) {
    alert("Erro ao agendar.");
  }
};
</script>

<template>
  <div class="booking-page">
    <div v-if="loading" class="loading">Carregando...</div>

    <div v-else-if="success" class="success-card">
      <h1>✅ Agendado!</h1>
      <p>
        Seu horário foi reservado com sucesso na
        <strong>{{ company.name }}</strong
        >.
      </p>
      <button
        @click="
          success = false;
          form.clientName = '';
        "
      >
        Agendar Outro
      </button>
    </div>

    <div v-else class="booking-card">
      <header>
        <h1>{{ company?.name || "Agendamento" }}</h1>
        <p>Escolha um serviço e horário abaixo.</p>
      </header>

      <form @submit.prevent="handleSubmit">
        <div class="group">
          <label>O que você deseja fazer?</label>
          <select v-model="form.serviceId" required>
            <option value="" disabled selected>Selecione um serviço...</option>
            <option v-for="s in services" :key="s.id" :value="s.id">
              {{ s.name }} - R$ {{ s.price }}
            </option>
          </select>
        </div>

        <div class="row">
          <div class="group">
            <label>Data</label>
            <input type="date" v-model="form.date" required />
          </div>
          <div class="group">
            <label>Hora</label>
            <select v-model="form.time" required>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
            </select>
          </div>
        </div>

        <div class="group">
          <label>Seu Nome</label>
          <input v-model="form.clientName" placeholder="João Silva" required />
        </div>

        <div class="group">
          <label>Seu Telefone</label>
          <input v-model="form.clientPhone" placeholder="(11) 99999-9999" />
        </div>

        <button type="submit" class="btn-book">Confirmar Agendamento</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.booking-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  font-family: "Segoe UI", sans-serif;
}

.booking-card,
.success-card {
  background: white;
  width: 100%;
  max-width: 450px;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

header h1 {
  margin: 0;
  color: #333;
}
header p {
  color: #666;
  margin-top: 5px;
}

.group {
  margin-bottom: 1rem;
}
.group label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: #444;
}
.group input,
.group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: #f9f9f9;
}

.row {
  display: flex;
  gap: 1rem;
}

.btn-book {
  width: 100%;
  padding: 15px;
  background: #764ba2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;
}
.btn-book:hover {
  background: #5b3780;
}

.success-card {
  text-align: center;
}
.success-card h1 {
  color: #42b983;
}
</style>
