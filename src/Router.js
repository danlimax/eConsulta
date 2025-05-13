import { createWebHistory, createRouter } from "vue-router";

import Home from "./pages/Home/Home.vue";
import Doctor from "./pages/Doctor/Doctor.vue";
import Patient from "./pages/Patient/Patient.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/doctor", component: Doctor },
  { path: "/patient", component: Patient },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
