<script setup>
const items = ["10:00", "11:30", "12:00"];
</script>
<template>
  <v-select
    label="Horários"
    :items="items"
    item-title="schedules"
    persistent-placeholder
  ></v-select>
</template>
