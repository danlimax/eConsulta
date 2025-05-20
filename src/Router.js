import { createWebHistory, createRouter } from "vue-router";
import authService from "@/services/authService";

import Home from "./pages/Home/index.vue";
import Doctor from "./pages/Doctor/Doctor.vue";
import Patient from "./pages/Patient/Patient.vue";
import Login from "./pages/Login/Login.vue";
import Register from "./pages/Register/Register.vue";

const routes = [
  { path: "/", component: Home },
  {
    path: "/doctor",
    component: Doctor,
    meta: { requiresAuth: true, requiresDoctor: true },
  },
  {
    path: "/patient",
    component: Patient,
    meta: { requiresAuth: true, requiresPatient: true },
  },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresDoctor = to.matched.some(
    (record) => record.meta.requiresDoctor
  );
  const requiresPatient = to.matched.some(
    (record) => record.meta.requiresPatient
  );

  if (requiresAuth) {
    if (!authService.isAuthenticated()) {
      next("/login");
      return;
    }

    if (requiresDoctor || requiresPatient) {
      try {
        const userDetails = await authService.userDetails();

        if (requiresDoctor && userDetails.role !== "medico") {
          next("/");
          return;
        }

        if (requiresPatient && userDetails.role !== "paciente") {
          next("/");
          return;
        }
      } catch (error) {
        authService.logout();
        next("/login");
        return;
      }
    }
  }

  next();
});

export default router;
