<script setup>
import { ref, onMounted } from "vue";
import AppointmentService from "../../../services/appointmentService";

const headers = [
  { title: "Nome", align: "start", sortable: false, key: "name" },
  { title: "Horário", align: "end", key: "schedule" },
  { title: "Data", align: "end", key: "date" },
];

const appointments = ref([]);

const loadAppointments = async () => {
  const service = new AppointmentService();
  try {
    const data = await service.list();
    appointments.value = data.map((appointment) => ({
      name: appointment.doctor?.name ?? "Desconhecido",
      schedule: new Date(appointment.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date(appointment.startTime).toLocaleDateString(),
    }));
  } catch (error) {
    console.error("Failed to load appointments", error);
  }
};

onMounted(loadAppointments);
</script>

<template>
  <v-data-table
    class="w-lg-50 w-md-75 ma-auto"
    :headers="headers"
    :items="appointments"
    density="compact"
    item-key="name"
  ></v-data-table>
</template>
