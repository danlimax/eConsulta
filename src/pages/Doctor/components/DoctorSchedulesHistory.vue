<script setup>
import { ref, onMounted, computed, watch } from "vue";
import AppointmentService from "@/services/appointmentService";
import authService from "@/services/authService";
import DoctorSchedulesModal from "./DoctorSchedulesModal.vue";

const service = new AppointmentService();

const appointments = ref([]);
const patients = ref([]);
const headers = [
  { title: "Paciente", key: "patient", align: "start" },
  {
    title: "Data e Horário",
    key: "startTime",
    align: "center",
    sortable: true,
  },
  { title: "Ações", key: "actions", align: "center", sortable: false },
];

const loading = ref(false);
const error = ref(null);
const dialogUpdate = ref(false);
const selectedAppointment = ref(null);
const selectedDate = ref("");
const timeSlots = ref([{ startTime: "", endTime: "" }]);

const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("success");

const showSnackbar = (message, color = "success") => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

const formIsValid = computed(() => {
  if (
    !selectedDate.value ||
    !timeSlots.value[0].startTime ||
    !timeSlots.value[0].endTime
  ) {
    return false;
  }

  const [startHours, startMinutes] = timeSlots.value[0].startTime
    .split(":")
    .map(Number);
  const [endHours, endMinutes] = timeSlots.value[0].endTime
    .split(":")
    .map(Number);

  const startTimeInMinutes = startHours * 60 + startMinutes;
  const endTimeInMinutes = endHours * 60 + endMinutes;

  if (startTimeInMinutes >= endTimeInMinutes) {
    showSnackbar(
      "O horário de início deve ser anterior ao horário de fim.",
      "error"
    );
    return false;
  }

  const baseDate = new Date(selectedDate.value);
  const selectedDateTime = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    startHours,
    startMinutes,
    0,
    0
  );

  if (selectedDateTime.getTime() < new Date().getTime()) {
    showSnackbar("Não é possível agendar horários no passado.", "error");
    return false;
  }

  return true;
});

const fetchAppointments = async () => {
  loading.value = true;
  error.value = null;
  try {
    const user = await authService.userDetails();

    if (user.role === "medico") {
      patients.value = await service.listPatients();
      appointments.value = await service.getSchedulesByDoctorId(user.id);
    } else if (user.role === "paciente") {
      appointments.value = await service.list();
    } else {
      error.value = "Tipo de usuário não suportado.";
    }
  } catch (err) {
    error.value = err.message || "Erro ao carregar agendamentos.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchAppointments();
});

watch(dialogUpdate, (val) => {
  if (!val) {
    resetUpdateForm();
  }
});

const formatDateTime = (dateString, type = "full") => {
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return "Data inválida";
  }

  const date = new Date(dateString);
  const options = {
    timeZone: "America/Sao_Paulo",
  };

  if (type === "date") {
    options.day = "2-digit";
    options.month = "2-digit";
    options.year = "numeric";
    return date.toLocaleString("pt-BR", options);
  } else if (type === "time") {
    options.hour = "2-digit";
    options.minute = "2-digit";
    return date.toLocaleString("pt-BR", options);
  } else {
    options.day = "2-digit";
    options.month = "2-digit";
    options.year = "numeric";
    options.hour = "2-digit";
    options.minute = "2-digit";
    return date.toLocaleString("pt-BR", options);
  }
};

const getFullTimeRange = (startTime, endTime) => {
  const formattedDate = formatDateTime(startTime, "date");
  const formattedStartTime = formatDateTime(startTime, "time");
  const formattedEndTime = formatDateTime(endTime, "time");

  if (
    formattedDate === "Data inválida" ||
    formattedStartTime === "Data inválida" ||
    formattedEndTime === "Data inválida"
  ) {
    return "Horário inválido";
  }

  return `${formattedDate} ${formattedStartTime} - ${formattedEndTime}`;
};

const getPatientName = (patientId) => {
  if (!patientId) {
    return "Horário disponível";
  }
  const patient = patients.value.find((p) => p.id === patientId);
  return patient ? patient.name : "Paciente desconhecido";
};

const openUpdateModal = (item) => {
  selectedAppointment.value = item;
  error.value = null;

  if (item.startTime) {
    const originalStartDate = new Date(item.startTime);
    const originalEndDate = new Date(item.endTime);

    selectedDate.value = originalStartDate.toISOString().split("T")[0];

    const startHours = originalStartDate.getHours().toString().padStart(2, "0");
    const startMinutes = originalStartDate
      .getMinutes()
      .toString()
      .padStart(2, "0");

    const endHours = originalEndDate.getHours().toString().padStart(2, "0");
    const endMinutes = originalEndDate.getMinutes().toString().padStart(2, "0");

    timeSlots.value = [
      {
        startTime: `${startHours}:${startMinutes}`,
        endTime: `${endHours}:${endMinutes}`,
      },
    ];
  } else {
    selectedDate.value = "";
    timeSlots.value = [{ startTime: "", endTime: "" }];
  }

  dialogUpdate.value = true;
};

const resetUpdateForm = () => {
  selectedAppointment.value = null;
  selectedDate.value = "";
  timeSlots.value = [{ startTime: "", endTime: "" }];
  error.value = null;
};

const submitUpdateSchedule = async () => {
  if (!formIsValid.value) {
    return;
  }

  try {
    if (!selectedAppointment.value) {
      showSnackbar("Nenhum agendamento selecionado para atualização.", "error");
      return;
    }

    const slot = timeSlots.value[0];
    const [startHours, startMinutes] = slot.startTime.split(":").map(Number);
    const [endHours, endMinutes] = slot.endTime.split(":").map(Number);

    const baseDate = new Date(selectedDate.value);

    const startDate = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      startHours,
      startMinutes,
      0,
      0
    );

    const endDate = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      endHours,
      endMinutes,
      0,
      0
    );

    const updateData = {
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    };

    await service.updateSchedule(selectedAppointment.value.id, updateData);
    showSnackbar("Agendamento atualizado com sucesso!");
    dialogUpdate.value = false;
    await fetchAppointments();
  } catch (err) {
    const errorMessage = err.message || "Erro ao atualizar agendamento.";
    showSnackbar(errorMessage, "error");
    console.error("Erro ao submeter atualização:", err);
  }
};
</script>

<template>
  <v-container>
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="4000">
      {{ snackbarMessage }}
    </v-snackbar>

    <DoctorSchedulesModal @scheduleCreated="fetchAppointments" />

    <v-card class="mx-auto" max-width="900" elevation="4">
      <v-card-title class="text-h6 text-center">
        Lista de Agendamentos
      </v-card-title>

      <v-alert type="error" v-if="error" class="mx-4 my-2">
        {{ error }}
      </v-alert>

      <v-data-table
        :headers="headers"
        :items="appointments"
        item-key="id"
        class="elevation-1"
        density="compact"
        :loading="loading"
        no-data-text="Nenhum agendamento encontrado."
        loading-text="Carregando agendamentos..."
      >
        <template #item.patient="{ item }">
          {{ getPatientName(item.patientId) }}
        </template>

        <template #item.startTime="{ item }">
          {{ getFullTimeRange(item.startTime, item.endTime) }}
        </template>

        <template #item.actions="{ item }">
          <v-btn
            class="text-none font-weight-regular"
            icon="$calendarEdit"
            @click="openUpdateModal(item)"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialogUpdate" max-width="600">
      <v-card title="Atualizar horários">
        <v-card-text>
          <div class="d-flex flex-column justify-center gap-4">
            <div class="d-flex justify-center">
              <v-date-picker
                v-model="selectedDate"
                show-adjacent-months
                title="Selecione a data *"
                :min="new Date().toISOString().split('T')[0]"
              ></v-date-picker>
            </div>

            <div v-if="selectedDate" class="my-4">
              <v-chip>
                {{
                  new Date(selectedDate).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                }}
              </v-chip>
            </div>

            <v-divider class="my-2"></v-divider>

            <div class="text-subtitle-1 mb-2">Intervalos de horários</div>

            <div
              v-for="(slot, index) in timeSlots"
              :key="index"
              class="d-flex align-center"
            >
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="slot.startTime"
                    label="Horário de início *"
                    type="time"
                    density="compact"
                    :rules="[(v) => !!v || 'Horário de início é obrigatório']"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="slot.endTime"
                    label="Horário de fim *"
                    type="time"
                    density="compact"
                    :rules="[(v) => !!v || 'Horário de fim é obrigatório']"
                  />
                </v-col>
              </v-row>
            </div>
          </div>

          <small class="text-caption text-medium-emphasis mt-4 d-block"
            >* indica um campo obrigatório</small
          >
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Fechar" variant="plain" @click="dialogUpdate = false" />
          <v-btn
            color="primary"
            text="Enviar"
            variant="tonal"
            @click="submitUpdateSchedule"
            :disabled="!formIsValid"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.v-card-title {
  font-weight: bold;
}
</style>
