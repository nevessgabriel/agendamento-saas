<script setup>
import { ref, onMounted, watch } from "vue";
import { useScheduleStore } from "../stores/scheduleStore";
import { useServiceStore } from "../stores/serviceStore";
import Sidebar from "../components/Sidebar.vue"; // Imported Sidebar

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
  // Fetch only for the specific date selected
  await scheduleStore.fetchSchedules(selectedDate.value);
});

// Watcher: Re-fetch data when the user picks a new date
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
    // Pass 'selectedDate' context so the store refreshes the correct day list
    await scheduleStore.deleteSchedule(id, selectedDate.value);
  }
};
</script>

<template>
  <div class="layout">
    <Sidebar />

    <main class="main-content">
      <div class="calendar-card">
        <div class="header-controls">
          <h2>Agenda Diária</h2>
          <div class="controls-right">
            <input type="date" v-model="selectedDate" class="date-picker" />
          </div>
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

              <button
                v-else
                @click="openBookingModal(time)"
                class="btn-add-slot"
              >
                + Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

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
/* Layout Structure */
.layout {
  min-height: 100vh;
  background-color: #f4f6f8;
  display: flex;
}

/* Main Content Area */
.main-content {
  flex: 1;
  margin-left: 70px; /* Space for Sidebar */
  padding: 2rem;

  /* Centering Logic */
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* The Card itself */
.calendar-card {
  width: 100%;
  max-width: 900px; /* Limits width on large screens */
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-controls h2 {
  color: #2c3e50;
  margin: 0;
}

.date-picker {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #2c3e50;
  font-weight: bold;
}

.time-row {
  display: flex;
  border-bottom: 1px solid #eee;
  height: 60px; /* Fixed height per hour slot */
}

.time-label {
  width: 80px;
  padding: 1rem;
  color: #666;
  border-right: 1px solid #eee;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  color: #2c3e50;
}

.btn-xs {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
}

.btn-add-slot {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  color: transparent;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: bold;
}

.btn-add-slot:hover {
  background-color: #f9f9f9;
  color: #ccc;
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
  z-index: 2000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 350px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal h3 {
  margin-top: 0;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1rem;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.3rem;
  border: 1px solid #ddd;
  border-radius: 4px;
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
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-cancel {
  background: #ccc;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  color: #333;
}
</style>
