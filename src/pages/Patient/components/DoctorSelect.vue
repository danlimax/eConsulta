<script setup>
import { ref, onMounted } from "vue";
import AppointmentService from "../../../services/appointmentService";

const items = ref([]);

const loadDoctors = async () => {
  const service = new AppointmentService();
  try {
    const data = await service.listDoctors();
    items.value = data.map((doctor) => ({
      id: doctor.id,
      name: doctor.name,
      department: doctor.role || "Especialidade desconhecida",
    }));
  } catch (error) {
    console.error("Failed to load doctors", error);
  }
};

onMounted(loadDoctors);
</script>

<template>
  <v-select
    label="Médicos*"
    :items="items"
    item-title="name"
    persistent-placeholder
  >
    <template v-slot:item="{ props: itemProps, item }">
      <v-list-item
        v-bind="itemProps"
        :subtitle="item.raw.department"
        required
      ></v-list-item>
    </template>
  </v-select>
</template>
