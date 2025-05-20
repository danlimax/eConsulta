<script setup></script>
<template>
  <v-container class="d-flex justify-center align-center py-10" fluid>
    <v-card class="pa-6 elevation-4 text-center" max-width="1000">
      <v-img :width="300" src="/Logo.png" class="mx-auto mb-4" />
      <h1 class="text-h5 font-weight-bold">Bem-vindo ao eConsulta</h1>
      <h2 class="text-subtitle-1 font-weight-bold mb-4">
        App de agendamento médico
      </h2>

      <v-card-text class="text-justify">
        O aplicativo de agendamento médico foi criado para facilitar a vida de
        pacientes e médicos. Com ele, os pacientes podem marcar consultas de
        forma rápida e prática, escolhendo o dia e horário disponíveis de acordo
        com sua preferência. Já os médicos conseguem organizar melhor sua
        agenda, visualizar seus atendimentos e gerenciar suas disponibilidades.
        A plataforma é intuitiva e fácil de usar. Basta fazer o cadastro,
        acessar a área do paciente ou do médico e começar a utilizar. Tudo é
        feito online, sem a necessidade de ligações ou visitas ao consultório
        para marcar uma consulta. Com esse aplicativo, o processo de agendamento
        se torna mais rápido, organizado e eficiente para todos.
      </v-card-text>
      <h2 class="text-subtitle-1 font-weight-bold mb-4">Instruções de uso</h2>
      <v-card-text class="text-justify">
        Ao acessar o aplicativo, cadastre ambas as contas para possibilitar a
        comunicação entre os dois tipos de áreas. Primeiramente, crie os
        horários dos médicos para depois agendar como paciente.
      </v-card-text>
    </v-card>
  </v-container>
</template>
