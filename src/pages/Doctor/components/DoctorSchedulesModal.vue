<script setup>
import { shallowRef, ref } from "vue";

const dialog = shallowRef(false);

const model = shallowRef(null);

const items = [];

const chips = ref([]);
</script>

<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="dialog" max-width="600">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          class="text-none font-weight-regular"
          prepend-icon="mdi-calendar"
          text="Cadastrar horário"
          variant="tonal"
          v-bind="activatorProps"
        ></v-btn>
        &nbsp;
        <v-btn
          class="text-none font-weight-regular"
          prepend-icon="mdi-calendar"
          text="Atualizar horários"
          variant="tonal"
          v-bind="activatorProps"
        ></v-btn>
      </template>

      <v-card title="Cadastrar novo horário">
        <v-card-text>
          <div class="d-flex flex-column justify-center">
            <v-date-input
              v-model="model"
              label="Selecione dia(s)"
              multiple
            ></v-date-input>

            <v-combobox
              v-model="chips"
              :items="items"
              label="Escreva um ou mais horários"
              prepend-icon="mdi-filter-variant"
              chips
              clearable
              closable-chips
              multiple
            >
              <template v-slot:chip="{ props, item }">
                <v-chip v-bind="props">
                  <strong>{{ item.raw }}</strong
                  >&nbsp;
                </v-chip>
              </template>
            </v-combobox>
          </div>

          <small class="text-caption text-medium-emphasis"
            >*indicates required field</small
          >
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>

          <v-btn
            color="primary"
            text="Save"
            variant="tonal"
            @click="dialog = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
