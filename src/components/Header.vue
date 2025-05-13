<script setup>
import { ref, watch } from "vue";

const drawer = ref(false);
const group = ref(null);

watch(group, () => {
  drawer.value = false;
});
</script>

<template>
  <v-card position="fixed" style="z-index: 10">
    <v-layout>
      <v-app-bar color="primary">
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>

        <v-toolbar-title>eConsulta</v-toolbar-title>

        <v-btn icon="mdi-dots-vertical" variant="text">LOG</v-btn>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'left' : undefined"
        temporary
      >
        <RouterLink to="/"
          ><v-list-item link title="Home"></v-list-item
        ></RouterLink>
        <RouterLink to="/patient">
          <v-list-item link title="Pacientes"></v-list-item
        ></RouterLink>
        <RouterLink to="/doctor">
          <v-list-item link title="Médicos"></v-list-item
        ></RouterLink>
      </v-navigation-drawer>
    </v-layout>
  </v-card>
</template>
