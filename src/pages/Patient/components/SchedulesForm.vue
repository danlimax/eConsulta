<script setup>
import DoctorSelect from "./DoctorSelect.vue";
import SchedulesSelect from "./SchedulesSelect.vue";
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";

const initialState = {
  name: "",
  email: "",
  select: null,
  checkbox: null,
};

const state = reactive({
  ...initialState,
});

const rules = {
  name: { required },
  email: { required, email },
  select: { required },
  items: { required },
  checkbox: { required },
};
const v$ = useVuelidate(rules, state);
function clear() {
  v$.value.$reset();

  for (const [key, value] of Object.entries(initialState)) {
    state[key] = value;
  }
}
</script>

<template>
  <v-form id="patientForm" @submit.prevent>
    <v-layout>
      <v-main>
        <v-container class="pt-8">
          <v-text-field
            label="Nome Completo*"
            persistent-placeholder
          ></v-text-field>
          <DoctorSelect />
          <v-date-input
            label="Data do agendamento*"
            prepend-icon=""
            persistent-placeholder
            disabled
          ></v-date-input>

          <SchedulesSelect />
        </v-container>
      </v-main>
    </v-layout>
  </v-form>
</template>
