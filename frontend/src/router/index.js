// frontend/src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

//Importing views
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import CalendarView from "../views/CalendarView.vue";
import ReportsView from "../views/ReportsView.vue";
import ClientBookingView from "../views/ClientBookingView.vue";
import HomeView from "../views/HomeView.vue";
import HistoryView from "../views/HistoryView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      meta: { requiresAuth: true }, //Route that needs authentication
    },
    {
      path: "/calendar",
      name: "calendar",
      component: CalendarView,
      meta: { requiresAuth: true },
    },
    {
      path: "/reports",
      name: "reports",
      component: ReportsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/agendar/:slug",
      name: "client-booking",
      component: ClientBookingView,
      meta: { requiresAuth: false },
    },
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/history",
      name: "history",
      component: HistoryView,
      meta: { requiresAuth: true },
    },
    {
      path: "/",
      redirect: "/dashboard", // Redirect root to dashboard
    },
  ],
});

//Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login"); //Redirect to login if not authenticated
  } else {
    next(); //Proceed to route
  }
});

export default router;
