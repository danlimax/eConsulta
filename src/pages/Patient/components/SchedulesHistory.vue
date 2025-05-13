<script setup>
const headers = [
  { title: "Nome", align: "start", sortable: false, key: "name" },
  { title: "Horário", align: "end", key: "schedule" },
  { title: "Data", align: "end", key: "date" },
];

const plants = [
  {
    name: "Fern",
    schedule: "Low",
    date: "20cm",
  },
  {
    name: "Snake Plant",
    schedule: "Low",
    date: "20cm",
  },
  {
    name: "Monstera",
    schedule: "Low",
    date: "20cm",
  },
  {
    name: "Pothos",
    schedule: "Low",
    date: "20cm",
  },
  {
    name: "ZZ Plant",
    schedule: "Low",
    date: "20cm",
  },
  {
    name: "Spider Plant",
    schedule: "Low",
    date: "20cm",
  },
  {
    name: "Air Plant",
    schedule: "Low",
    date: "20cm",
  },
  {
    name: "Peperomia",
    schedule: "Low",
    date: "20cm",
  },
  {
    name: "Aloe Vera",
    schedule: "Low",
    date: "20cm",
  },
  {
    name: "Jade Plant",
    schedule: "Low",
    date: "20cm",
  },
];
</script>
<template>
  <v-data-table
    class="w-50 ma-auto"
    :headers="headers"
    :items="plants"
    density="compact"
    item-key="name"
  ></v-data-table>
</template>
