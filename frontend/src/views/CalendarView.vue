<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useScheduleStore } from "../stores/scheduleStore";
import { useServiceStore } from "../stores/serviceStore";

const scheduleStore = useScheduleStore();
const serviceStore = useServiceStore();

// State
const selectedDate = ref(new Date().toISOString().split("T")[0]); // Today YYYY-MM-DD
const showModal = ref(false);

// Form Data for new appointment
const form = ref({
  clientName: "",
  clientPhone: "",
  serviceId: "",
  timeSlot: "", // Will hold "09:00", "10:30" etc.
});

// Load data on mount and when date changes
onMounted(async () => {
  await serviceStore.fetchServices();
  await scheduleStore.fetchSchedules(selectedDate.value);
});

watch(selectedDate, async (newDate) => {
  await scheduleStore.fetchSchedules(newDate);
});

// Helper: Generate time slots for the UI (08:00 to 20:00)
const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

// Helper: Check if a slot has an appointment
const getAppointmentForSlot = (time) => {
  return scheduleStore.schedules.find((s) => {
    // Backend sends ISO string (2023-10-25T09:00:00.000Z)
    // We compare the HH:MM part
    const scheduleTime = new Date(s.start_time).toTimeString().substring(0, 5);
    return scheduleTime.startsWith(time.substring(0, 2));
  });
};

// Actions
const openBookingModal = (time) => {
  form.value.timeSlot = time;
  form.value.clientName = "";
  form.value.clientPhone = "";
  form.value.serviceId = "";
  showModal.value = true;
};

const handleBooking = async () => {
  try {
    // Construct full ISO datetime: "2023-10-25T09:00:00"
    const fullDateTime = `${selectedDate.value}T${form.value.timeSlot}:00`;

    await scheduleStore.createSchedule({
      clientName: form.value.clientName,
      clientPhone: form.value.clientPhone,
      serviceId: form.value.serviceId,
      startTime: fullDateTime,
    });

    showModal.value = false;
    alert("Agendamento realizado com sucesso!");
  } catch (error) {
    alert("Erro: Horário indisponível ou erro no servidor.");
  }
};

const handleCancel = async (id) => {
  if (confirm("Cancelar este agendamento?")) {
    await scheduleStore.deleteSchedule(id, selectedDate.value);
  }
};
</script>

<template>
  <div class="calendar-layout">
    <div class="header-controls">
      <h2>Agenda Diária</h2>
      <input type="date" v-model="selectedDate" class="date-picker" />
      <router-link to="/dashboard" class="btn-back"
        >Voltar ao Dashboard</router-link
      >
    </div>

    <div class="day-view">
      <div v-for="time in timeSlots" :key="time" class="time-row">
        <div class="time-label">{{ time }}</div>

        <div class="slot-content">
          <div v-if="getAppointmentForSlot(time)" class="appointment-card">
            <span>
              <strong>{{
                getAppointmentForSlot(time).start_time.substring(11, 16)
              }}</strong>
              -
              {{ getAppointmentForSlot(time).client_name }}
              ({{ getAppointmentForSlot(time).service_name }})
            </span>
            <button
              @click="handleCancel(getAppointmentForSlot(time).id)"
              class="btn-xs"
            >
              X
            </button>
          </div>

          <button v-else @click="openBookingModal(time)" class="btn-add-slot">
            + Adicionar
          </button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Novo Agendamento: {{ form.timeSlot }}</h3>
        <form @submit.prevent="handleBooking">
          <div class="form-group">
            <label>Cliente</label>
            <input
              v-model="form.clientName"
              required
              placeholder="Nome do Cliente"
            />
          </div>
          <div class="form-group">
            <label>Telefone</label>
            <input v-model="form.clientPhone" placeholder="(00) 00000-0000" />
          </div>
          <div class="form-group">
            <label>Serviço</label>
            <select v-model="form.serviceId" required>
              <option
                v-for="svc in serviceStore.services"
                :value="svc.id"
                :key="svc.id"
              >
                {{ svc.name }} ({{ svc.duration }} min)
              </option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn-cancel">
              Cancelar
            </button>
            <button type="submit" class="btn-confirm">Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-layout {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.date-picker {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.time-row {
  display: flex;
  border-bottom: 1px solid #eee;
  height: 60px; /* Altura fixa para cada hora */
}

.time-label {
  width: 80px;
  padding: 1rem;
  color: #666;
  border-right: 1px solid #eee;
  font-weight: bold;
}

.slot-content {
  flex-grow: 1;
  padding: 5px;
}

/* Appointment Styling */
.appointment-card {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
  height: 100%;
  border-radius: 4px;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.btn-xs {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-weight: bold;
}

.btn-add-slot {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  color: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-slot:hover {
  background-color: #f9f9f9;
  color: #ccc;
}

.btn-back {
  text-decoration: none;
  color: #666;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 300px;
}

.form-group {
  margin-bottom: 1rem;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.2rem;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.btn-confirm {
  background: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel {
  background: #ccc;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>
