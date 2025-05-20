<script setup>
import { onMounted, ref, watch } from "vue";
import { useAuth } from "./composables/useAuth";

const drawer = ref(false);
const group = ref(null);

watch(group, () => {
  drawer.value = false;
});

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
    <v-app>
      <v-app-bar class="bg-teal-darken-4 pl-2 pr-2 pl-md-8 pr-md-8">
        <v-app-bar-nav-icon
          variant="text"
          class="d-md-none"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
        <v-img
          :max-width="64"
          src="/Logo2.svg"
          alt="Logo da empresa eConsulta."
        />
        <v-toolbar-title>eConsulta</v-toolbar-title>

        <div class="d-none d-md-flex p">
          <v-list-item
            class="text-white"
            to="/"
            link
            title="Home"
          ></v-list-item>
          <v-list-item
            class="text-white"
            to="/patient"
            link
            title="Pacientes"
          ></v-list-item>

          <v-list-item
            class="text-white"
            to="/doctor"
            link
            title="Médicos"
          ></v-list-item>
        </div>
      </v-app-bar>
      <v-navigation-drawer
        class="d-md-none"
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'left' : undefined"
        temporary
      >
        <v-list-item to="/" link title="Home"></v-list-item>
        <v-list-item to="/patient" link title="Pacientes"></v-list-item>
        <v-list-item to="/doctor" link title="Médicos"></v-list-item>
      </v-navigation-drawer>
      <v-main class="pt-16">
        <RouterView />
      </v-main>
    </v-app>
  </div>
</template>
