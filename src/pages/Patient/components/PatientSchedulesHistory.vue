<script setup>
import PatientSchedulesModal from "./PatientSchedulesModal.vue";
import { ref, onMounted } from "vue";
import AppointmentService from "../../../services/appointmentService";
import authService from "../../../services/authService";

const headers = [
  {
    title: "Nome do Médico",
    align: "start",
    sortable: false,
    key: "doctorName",
  },
  { title: "Data e Horário", align: "center", key: "dateTimeRange" },
];

const appointments = ref([]);
const loading = ref(false);
const error = ref(null);

const loadAppointments = async () => {
  loading.value = true;
  error.value = null;
  const service = new AppointmentService();
  try {
    const user = await authService.userDetails();

    if (user && user.id) {
      const patientId = user.id;

      const [patientAppointmentsData, doctorsList] = await Promise.all([
        service.getSchedulesByPatientId(patientId),
        service.listDoctors(),
      ]);

      appointments.value = patientAppointmentsData.map((appointment) => {
        const date = new Date(appointment.startTime);
        const formattedDate = date.toLocaleDateString("pt-BR");
        const formattedStartTime = new Date(
          appointment.startTime
        ).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const formattedEndTime = new Date(
          appointment.endTime
        ).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const doctor = doctorsList.find(
          (doc) => doc.id === appointment.doctorId
        );
        const doctorName = doctor ? doctor.name : "Desconhecido";

        return {
          doctorName: doctorName,
          dateTimeRange: `${formattedDate} ${formattedStartTime} - ${formattedEndTime}`,
        };
      });
    } else {
      error.value =
        "Não foi possível encontrar o ID do paciente para carregar o histórico. Verifique se o usuário está logado e se o ID está disponível.";
    }
  } catch (err) {
    console.error("Failed to load appointments:", err);
    error.value = err.message || "Erro ao carregar histórico de agendamentos.";
  } finally {
    loading.value = false;
  }
};

onMounted(loadAppointments);

const handleAppointmentSuccess = () => {
  console.log("Agendamento criado com sucesso! Recarregando a tabela...");
  loadAppointments();
};
</script>

<template>
  <v-container class="ma-auto">
    <PatientSchedulesModal @appointment-success="handleAppointmentSuccess" />

    <v-card class="mx-auto" max-width="900" elevation="4">
      <v-card-title class="text-h6 text-center">
        Histórico de Agendamentos do Paciente
      </v-card-title>

      <v-alert type="error" v-if="error" class="mx-4 my-2">
        {{ error }}
      </v-alert>

      <v-data-table
        class="elevation-1"
        :headers="headers"
        :items="appointments"
        item-key="id"
        density="compact"
        :loading="loading"
        no-data-text="Nenhum agendamento encontrado."
        loading-text="Carregando histórico..."
      >
      </v-data-table>
    </v-card>
  </v-container>
</template>

<style scoped>
.v-card-title {
  font-weight: bold;
}
</style>
