<script setup>
import { ref, onMounted, watch, computed } from "vue";
import AppointmentService from "@/services/appointmentService";
import AuthService from "@/services/authService";

const dialogCreate = ref(false);
const selectedDates = ref([]);
const timeSlots = ref([{ startTime: "", endTime: "" }]);
const doctorId = ref(null);
const appointmentService = new AppointmentService();

const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("success");

const emit = defineEmits(["scheduleCreated"]);

const showSnackbar = (message, color = "success") => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

const formIsValid = computed(() => {
  if (selectedDates.value.length === 0 || timeSlots.value.length === 0) {
    return false;
  }

  return timeSlots.value.every((slot) => slot.startTime && slot.endTime);
});

onMounted(async () => {
  try {
    const user = await AuthService.userDetails();
    doctorId.value = user.id;
  } catch (error) {
    console.error("Erro ao buscar detalhes do usuário:", error);
    showSnackbar("Não foi possível obter os dados do médico.", "error");
  }
});

const buildSchedulePayload = () => {
  const payload = [];

  selectedDates.value.forEach((date) => {
    const dateStr = new Date(date).toISOString().split("T")[0];

    timeSlots.value.forEach((slot) => {
      if (slot.startTime && slot.endTime) {
        const start = new Date(`${dateStr}T${slot.startTime}:00`);
        const end = new Date(`${dateStr}T${slot.endTime}:00`);

        payload.push({
          doctorId: doctorId.value,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        });
      }
    });
  });

  return payload;
};

const resetForm = () => {
  selectedDates.value = [];
  timeSlots.value = [{ startTime: "", endTime: "" }];
};

watch(dialogCreate, (val) => {
  if (!val) resetForm();
});

const submitSchedule = async () => {
  if (!formIsValid.value) {
    showSnackbar("Preencha todos os campos obrigatórios.", "error");
    return;
  }

  const payload = buildSchedulePayload();

  try {
    await appointmentService.createSchedule(payload);
    showSnackbar("Horários criados com sucesso!");
    dialogCreate.value = false;
    resetForm();

    emit("scheduleCreated");
  } catch (error) {
    console.error(error);
    showSnackbar("Erro ao criar os horários", "error");
  }
};
</script>

<template>
  <div class="pa-4 text-center">
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="4000">
      {{ snackbarMessage }}
    </v-snackbar>

    <v-dialog v-model="dialogCreate" max-width="600">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          class="text-none font-weight-regular"
          prepend-icon="$calendarPlus"
          text="Cadastrar horário"
          variant="tonal"
          v-bind="activatorProps"
        ></v-btn>
      </template>

      <v-card title="Cadastrar novos horários">
        <v-card-text>
          <div class="d-flex flex-column justify-center gap-4">
            <div class="d-flex justify-center">
              <v-date-picker
                v-model="selectedDates"
                multiple
                show-adjacent-months
                title="Selecione as datas *"
                :min="new Date().toISOString().split('T')[0]"
              ></v-date-picker>
            </div>

            <v-chip-group column class="ma-2">
              <v-chip
                v-for="(date, index) in selectedDates"
                :key="index"
                closable
                @click:close="selectedDates.splice(index, 1)"
              >
                {{
                  new Date(date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                }}
              </v-chip>
            </v-chip-group>

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
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="slot.endTime"
                    label="Horário de fim *"
                    type="time"
                    density="compact"
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
          <v-btn text="Fechar" variant="plain" @click="dialogCreate = false" />
          <v-btn
            color="primary"
            text="Enviar"
            variant="tonal"
            @click="submitSchedule"
            :disabled="!formIsValid"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
/* Your existing styles */
</style>
