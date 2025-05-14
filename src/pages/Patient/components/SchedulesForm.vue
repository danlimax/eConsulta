<script setup>
import DoctorSelect from "./DoctorSelect.vue";
import SchedulesSelect from "./SchedulesSelect.vue";
</script>

<template>
  <v-form v-model="valid">
    <v-layout>
      <v-main>
        <v-container class="pt-8">
          <v-text-field
            label="Nome Completo"
            model-value="John Leider"
            persistent-placeholder
          ></v-text-field>

          <v-date-input
            label="Data do agendamento"
            prepend-icon=""
            persistent-placeholder
          ></v-date-input>

          <DoctorSelect />
          <SchedulesSelect />
        </v-container>
      </v-main>
    </v-layout>
  </v-form>
</template>
