<script setup>
import { onMounted } from "vue";
import Header from "./components/Header.vue";
import { useAuth } from ".composables/useAuth";

const { loadUser, loading } = useAuth();

onMounted(async () => {
  await loadUser();
});
</script>

<template>
  <div
    v-if="loading"
    class="d-flex justify-center align-center"
    style="height: 100vh"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    ></v-progress-circular>
  </div>

  <div v-else>
    <Header></Header>
    <RouterView />
  </div>
</template>
