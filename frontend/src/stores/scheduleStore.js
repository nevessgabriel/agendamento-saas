// frontend/src/stores/scheduleStore.js
import { defineStore } from "pinia";
import api from "../services/api";
import { ref } from "vue";

export const useScheduleStore = defineStore("schedule", () => {
  // State
  const schedules = ref([]);
  const loading = ref(false);

  // Actions

  async function fetchSchedules(date) {
    loading.value = true;
    try {
      // Send the date as a query parameter (e.g., /schedules?date=2025-12-24)
      const response = await api.get(`/schedules?date=${date}`);
      schedules.value = response.data;
    } catch (err) {
      console.error("Error fetching schedules:", err);
    } finally {
      loading.value = false;
    }
  }

  // Create a new appointment
  async function createSchedule(appointmentData) {
    try {
      await api.post("/schedules", appointmentData);

      const dateStr = appointmentData.startTime.split("T")[0];

      await fetchSchedules(dateStr);
      return true;
    } catch (err) {
      console.error("Error booking:", err);
      throw err; // Propagate error to the component (to show alerts/toasts)
    }
  }

  // Delete appointment
  async function deleteSchedule(id, dateContext) {
    try {
      await api.delete(`/schedules/${id}`);
      // Refresh the list for the day the user is currently viewing
      await fetchSchedules(dateContext);
    } catch (err) {
      console.error("Error deleting:", err);
    }
  }

  return { schedules, loading, fetchSchedules, createSchedule, deleteSchedule };
});
