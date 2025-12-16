// frontend/src/stores/auth.js
import { defineStore } from "pinia";
import api from "../services/api";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  //State
  const token = ref(localStorage.getItem("token") || "");
  const user = ref(JSON.parse(localStorage.getItem("user") || "null"));

  //Getters
  const isAuthenticated = computed(() => !!token.value);

  //Actions
  async function login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password });

      //Save token and user info
      token.value = response.data.token;
      user.value = response.data.user;

      //Save to localStorage
      localStorage.setItem("token", token.value);
      localStorage.setItem("user", JSON.stringify(user.value));

      return true;
    } catch (error) {
      console.error("Erro no login:", error.response?.data?.error);
      throw error;
    }
  }

  function logout() {
    token.value = "";
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; //Force redirect to login page
  }

  return { token, user, isAuthenticated, login, logout };
});
