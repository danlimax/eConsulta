import { createWebHistory, createRouter } from "vue-router";
import authService from "@/services/authService";

import Home from "./pages/Home/index.vue";
import Doctor from "./pages/Doctor/Doctor.vue";
import Patient from "./pages/Patient/Patient.vue";
import PatientLogin from "./pages/PatientLogin/PatientLogin.vue";
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
  { path: "/login", component: PatientLogin },
  { path: "/register", component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard
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

    // If user type validation is needed, you'd fetch user details here
    // For now, we'll assume the token is valid if it exists
    if (requiresDoctor || requiresPatient) {
      try {
        const userDetails = await authService.userDetails();

        if (requiresDoctor && userDetails.role !== "medico") {
          next("/"); // Redirect to home if not a doctor
          return;
        }

        if (requiresPatient && userDetails.role !== "paciente") {
          next("/"); // Redirect to home if not a patient
          return;
        }
      } catch (error) {
        // If can't fetch user details, token might be invalid
        authService.logout();
        next("/login");
        return;
      }
    }
  }

  next();
});

export default router;
