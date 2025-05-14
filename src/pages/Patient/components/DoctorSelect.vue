<script setup>
const items = [
  {
    name: "John",
    department: "Ortopedista",
  },
  {
    name: "Jane",
    department: "Endocrinologista",
  },
  {
    name: "Joe",
    department: "Clínico",
  },
  {
    name: "Janet",
    department: "Pediatra",
  },
  {
    name: "Jake",
    department: "Urologista",
  },
  {
    name: "Jack Fallen",
    department: "Geriatria",
  },
];
</script>
<template>
  <v-select
    label="Médicos"
    :items="items"
    item-title="name"
    persistent-placeholder
  >
    <template v-slot:item="{ props: itemProps, item }">
      <v-list-item
        v-bind="itemProps"
        :subtitle="item.raw.department"
      ></v-list-item>
    </template>
  </v-select>
</template>
