<script setup>
const items = ["10:00", "11:30", "12:00"];
</script>
<template>
  <v-select
    label="Horários"
    :items="items"
    item-title="schedules"
    variant="outlined"
    persistent-placeholder
  ></v-select>
</template>
