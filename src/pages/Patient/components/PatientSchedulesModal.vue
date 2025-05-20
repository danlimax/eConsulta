<script setup>
import { ref, computed, watch, onMounted, getCurrentInstance } from "vue";
import AppointmentService from "@/services/appointmentService";
import authService from "@/services/authService";

const appointmentService = new AppointmentService();

const dialog = ref(false);
const loading = ref(false);
const error = ref(null);
const successMessage = ref(null);

const doctors = ref([]);
const selectedDoctor = ref(null);
const selectedDate = ref(null);
const selectedTimeSlotId = ref(null);

const doctorSchedules = ref([]);
const availableDaysForDoctor = ref([]);
const availableTimeSlotsForSelectedDate = ref([]);

const formIsValid = computed(() => {
  return (
    selectedDoctor.value &&
    selectedDate.value &&
    selectedTimeSlotId.value &&
    !loading.value
  );
});

const instance = getCurrentInstance();

onMounted(() => {
  loadDoctors();
});

watch(dialog, (newValue) => {
  if (newValue) {
    resetForm();
    loadDoctors();
  } else {
    error.value = null;
    successMessage.value = null;
  }
});

watch(selectedDoctor, (newDoctorId) => {
  selectedDate.value = null;
  selectedTimeSlotId.value = null;
  availableDaysForDoctor.value = [];
  availableTimeSlotsForSelectedDate.value = [];
  doctorSchedules.value = [];

  if (newDoctorId) {
    loadDoctorSchedules(newDoctorId);
  }
});

watch(selectedDate, (newDateString) => {
  selectedTimeSlotId.value = null;
  availableTimeSlotsForSelectedDate.value = [];

  if (newDateString && doctorSchedules.value.length > 0) {
    filterAvailableTimeSlotsForDate(newDateString);
  }
});

const loadDoctors = async () => {
  loading.value = true;
  error.value = null;
  try {
    const doctorsData = await appointmentService.listDoctors();
    doctors.value = doctorsData.map((doctor) => ({
      title: doctor.name,
      value: doctor.id,
    }));
  } catch (err) {
    error.value = err.message || "Erro ao carregar lista de médicos.";
    console.error("Erro ao carregar médicos:", err);
    setTimeout(() => {
      error.value = null;
    }, 4000);
  } finally {
    loading.value = false;
  }
};

const loadDoctorSchedules = async (doctorId) => {
  loading.value = true;
  error.value = null;
  try {
    const schedules = await appointmentService.getSchedulesByDoctorId(doctorId);
    doctorSchedules.value = schedules;

    const uniqueDays = new Set();
    schedules.forEach((slot) => {
      const slotStartTime = new Date(slot.startTime);
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const slotDateOnly = new Date(slot.startTime);
      slotDateOnly.setHours(0, 0, 0, 0);

      if (
        !slot.patientId &&
        slotDateOnly.getTime() >= now.getTime() &&
        slotStartTime.getTime() > new Date().getTime()
      ) {
        uniqueDays.add(slotDateOnly.toISOString().split("T")[0]);
      }
    });
    availableDaysForDoctor.value = Array.from(uniqueDays).sort();
  } catch (err) {
    error.value = err.message || "Erro ao carregar horários do médico.";
    console.error("Erro ao carregar horários do médico:", err);
    setTimeout(() => {
      error.value = null;
    }, 4000);
  } finally {
    loading.value = false;
  }
};

const filterAvailableTimeSlotsForDate = (dateString) => {
  const selectedDateObj = new Date(dateString);
  selectedDateObj.setHours(0, 0, 0, 0);

  availableTimeSlotsForSelectedDate.value = doctorSchedules.value
    .filter((slot) => {
      const slotStartTime = new Date(slot.startTime);
      const isFutureSlot = slotStartTime.getTime() > new Date().getTime();
      const isAvailable = !slot.patientId;

      const isSameDay =
        slotStartTime.getFullYear() === selectedDateObj.getFullYear() &&
        slotStartTime.getMonth() === selectedDateObj.getMonth() &&
        slotStartTime.getDate() === selectedDateObj.getDate();

      return isSameDay && isFutureSlot && isAvailable;
    })
    .map((slot) => {
      const startFormatted = new Date(slot.startTime).toLocaleTimeString(
        "pt-BR",
        { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }
      );
      const endFormatted = new Date(slot.endTime).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Sao_Paulo",
      });
      return {
        text: `${startFormatted} - ${endFormatted}`,
        value: slot.id,
      };
    })
    .sort((a, b) => {
      const timeA = a.text.split(" ")[0].split(":").map(Number);
      const timeB = b.text.split(" ")[0].split(":").map(Number);
      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
    });
};

const disableDates = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(dateString);
  checkDate.setHours(0, 0, 0, 0);

  return (
    checkDate.getTime() < today.getTime() ||
    !availableDaysForDoctor.value.includes(dateString)
  );
};

const submitAppointment = async () => {
  error.value = null;
  successMessage.value = null;

  if (!formIsValid.value) {
    error.value = "Por favor, preencha todos os campos obrigatórios.";
    setTimeout(() => {
      error.value = null;
    }, 4000);
    return;
  }

  loading.value = true;
  try {
    const currentUser = await authService.userDetails();
    if (!currentUser || !currentUser.id) {
      throw new Error(
        "Usuário não autenticado ou ID do paciente não encontrado."
      );
    }

    const updateData = {
      patientId: currentUser.id,
    };

    await appointmentService.updatePatientSchedule(
      selectedTimeSlotId.value,
      updateData
    );
    successMessage.value = "Agendamento realizado com sucesso!";

    instance.emit("appointment-success");

    dialog.value = false;
    resetForm();

    setTimeout(() => {
      successMessage.value = null;
    }, 4000);
  } catch (err) {
    error.value = err.message || "Erro ao agendar consulta.";
    console.error("Erro ao agendar consulta:", err);
    setTimeout(() => {
      error.value = null;
    }, 4000);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  selectedDoctor.value = null;
  selectedDate.value = null;
  selectedTimeSlotId.value = null;
  doctors.value = [];
  doctorSchedules.value = [];
  availableDaysForDoctor.value = [];
  availableTimeSlotsForSelectedDate.value = [];
};
</script>

<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="dialog" max-width="600">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          class="text-none font-weight-regular"
          prepend-icon="$calendarPlus"
          text="Novo agendamento"
          variant="tonal"
          v-bind="activatorProps"
        />
      </template>

      <v-card title="Novo agendamento">
        <v-card-text>
          <small class="text-caption text-medium-emphasis"
            >* indica um campo obrigatório</small
          >

          <v-expand-transition>
            <v-alert type="error" v-if="error" class="my-4" closable>
              {{ error }}
            </v-alert>
          </v-expand-transition>

          <v-expand-transition>
            <v-alert type="success" v-if="successMessage" class="my-4" closable>
              {{ successMessage }}
            </v-alert>
          </v-expand-transition>

          <v-form @submit.prevent="submitAppointment">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="selectedDoctor"
                    :items="doctors"
                    label="Médicos*"
                    item-title="title"
                    item-value="value"
                    :loading="loading && !doctors.length"
                    :disabled="loading"
                    :rules="[(v) => !!v || 'Médico é obrigatório']"
                  />
                </v-col>

                <v-col cols="12" class="d-flex justify-center">
                  <v-date-picker
                    v-model="selectedDate"
                    :min="new Date().toISOString().split('T')[0]"
                    :allowed-dates="disableDates"
                    show-adjacent-months
                    title="Data do agendamento*"
                    :loading="loading"
                    :disabled="!selectedDoctor || loading"
                  />
                </v-col>

                <v-col cols="12">
                  <v-select
                    v-model="selectedTimeSlotId"
                    :items="availableTimeSlotsForSelectedDate"
                    label="Horários*"
                    item-title="text"
                    item-value="value"
                    :disabled="
                      !selectedDate ||
                      availableTimeSlotsForSelectedDate.length === 0 ||
                      loading
                    "
                    :loading="loading"
                    no-data-text="Nenhum horário disponível para a data selecionada."
                    :rules="[(v) => !!v || 'Horário é obrigatório']"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn text="Fechar" variant="plain" @click="dialog = false" />
          <v-btn
            type="submit"
            color="primary"
            text="Enviar"
            variant="tonal"
            @click="submitAppointment"
            :disabled="!formIsValid"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
