// frontend/src/stores/scheduleStore.js
import { defineStore } from "pinia";
import api from "../services/api";
import { ref } from "vue";

export const useScheduleStore = defineStore("schedule", () => {
  // State
  const schedules = ref([]);
  const loading = ref(false);

  // Actions

  // Fetch schedules for a specific date (Format: YYYY-MM-DD)
  async function fetchSchedules(date) {
    loading.value = true;
    try {
      // Backend expects ?date=2023-10-25
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
      // After creating, refresh the list to show the new block
      // We extract the date from the startTime string
      const dateStr = appointmentData.startTime.split("T")[0];
      await fetchSchedules(dateStr);
      return true;
    } catch (err) {
      console.error("Error booking:", err);
      throw err; // Let the component handle the error message
    }
  }

  // Delete appointment
  async function deleteSchedule(id, dateContext) {
    try {
      await api.delete(`/schedules/${id}`);
      await fetchSchedules(dateContext); // Refresh list
    } catch (err) {
      console.error("Error deleting:", err);
    }
  }

  return { schedules, loading, fetchSchedules, createSchedule, deleteSchedule };
});
