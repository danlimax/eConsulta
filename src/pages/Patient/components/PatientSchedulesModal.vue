<script setup>
import { shallowRef, ref } from "vue";
import SchedulingForm from "./SchedulesForm.vue";

const dialog = shallowRef(false);

const model = shallowRef(null);

const items = [];

const chips = ref([]);
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
        ></v-btn>
      </template>

      <v-card title="Novo agendamento">
        <v-card-text>
          <SchedulingForm />

          <small class="text-caption text-medium-emphasis"
            >* indica um campo obrigatório</small
          >
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Fechar" variant="plain" @click="dialog = false"></v-btn>

          <v-btn
            type="submit"
            color="primary"
            text="Enviar"
            variant="tonal"
            form="patientForm"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
