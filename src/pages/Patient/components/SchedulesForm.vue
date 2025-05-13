<script setup>
import DoctorSelect from "./DoctorSelect.vue";
import SchedulesSelect from "./SchedulesSelect.vue";
</script>

<template>
  <v-form class="ma-auto w-50" v-model="valid">
    <v-layout>
      <v-main>
        <v-container class="pt-8">
          <v-text-field
            label="Nome Completo"
            model-value="John Leider"
            variant="outlined"
            persistent-placeholder
          ></v-text-field>

          <v-date-input
            label="Data do agendamento"
            prepend-icon=""
            variant="outlined"
            persistent-placeholder
          ></v-date-input>

          <DoctorSelect />
          <SchedulesSelect />
        </v-container>
      </v-main>
    </v-layout>

    <v-btn color="#4603c0">Enviar</v-btn>
  </v-form>
</template>
