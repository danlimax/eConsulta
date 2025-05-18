<script setup>
import { getHello } from "../../api/api.js";
import { ref } from "vue";

const greeting = ref("");

async function fetchData() {
  try {
    const response = await getHello();
    greeting.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

fetchData();
</script>
<template>
  <h1>{{ greeting }}</h1>
</template>
