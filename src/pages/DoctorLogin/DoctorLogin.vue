<script setup></script>
<template>
  <v-form>
    <v-responsive class="mx-auto" max-width="344">
      <v-text-field
        hide-details="auto"
        label="E-mail"
        placeholder="Digite seu e-mail"
        type="email"
      ></v-text-field>
    </v-responsive>
    <v-responsive class="mx-auto" max-width="344">
      <v-text-field
        placeholder="Digite sua senha"
        label="Senha"
        type="password"
      ></v-text-field>
    </v-responsive>
    <v-btn type="submit" prepend-icon="$vuetify" variant="tonal"> Logar </v-btn>
  </v-form>
</template>
