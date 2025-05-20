<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import authService from "@/services/authService";

const router = useRouter();

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  userType: "patient",
});

const loading = ref(false);
const error = ref("");
const success = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const valid = ref(false);

const userTypes = [
  { value: "patient", title: "Paciente", icon: "$account", color: "blue" },
  { value: "doctor", title: "Médico", icon: "$doctor", color: "green" },
];

const nameRules = [
  (v) => !!v || "Nome é obigatório",
  (v) => v.length >= 2 || "O nome deve ter pelo menos 2 caracteres",
];

const emailRules = [
  (v) => !!v || "E-mail é obigatório",
  (v) => /.+@.+\..+/.test(v) || "O e-mail deve ser válido",
];

const passwordRules = [
  (v) => !!v || "Senha é obrigatório",
  (v) => v.length >= 6 || "A senha precisa ter ao menos 6 caracteres",
];

const confirmPasswordRules = [
  (v) => !!v || "Por favor confirme a sua senha",
  (v) => v === form.password || "As senhas informada não combinam",
];

const handleSubmit = async () => {
  if (!valid.value) {
    return;
  }

  error.value = "";
  success.value = "";
  loading.value = true;

  try {
    const userData = {
      name: form.name,
      email: form.email,
      password: form.password,
    };

    if (form.userType === "patient") {
      response = await authService.registerPatient(userData);
    } else {
      response = await authService.registerDoctor(userData);
    }

    success.value = `Conta criada com sucesso! Agora você pode fazer login como ${form.userType}.`;

    Object.keys(form).forEach((key) => {
      if (key !== "userType") form[key] = "";
    });

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (err) {
    error.value = err.message || "Ocorreu um erro durante o registro";
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push("/login");
};
</script>

<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="5" xl="4">
        <v-card class="pa-4" elevation="8" rounded="lg">
          <v-card-title class="text-center pa-0 mb-4">
            <div class="text-h4 text-primary font-weight-bold mb-2">
              eConsulta
            </div>
            <div class="text-subtitle-1 text-medium-emphasis">
              Cadastre sua conta
            </div>
          </v-card-title>

          <v-alert
            v-if="success"
            type="success"
            variant="tonal"
            class="mb-4"
            :text="success"
            closable
            @click:close="success = ''"
          ></v-alert>

          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            class="mb-4"
            :text="error"
            closable
            @click:close="error = ''"
          ></v-alert>

          <v-form v-model="valid" @submit.prevent="handleSubmit">
            <v-card-text class="pa-0">
              <
              <div class="mb-4">
                <v-label class="text-subtitle-2 font-weight-medium mb-2">
                  Cadastre como
                </v-label>
                <v-radio-group
                  v-model="form.userType"
                  inline
                  hide-details
                  :disabled="loading"
                >
                  <v-radio
                    v-for="type in userTypes"
                    :key="type.value"
                    :value="type.value"
                    :color="type.color"
                  >
                    <template v-slot:label>
                      <div class="d-flex align-center">
                        <v-icon
                          :icon="type.icon"
                          :color="type.color"
                          class="me-2"
                        ></v-icon>
                        <span>{{ type.title }}</span>
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>
              </div>

              <v-text-field
                v-model="form.name"
                :rules="nameRules"
                label="Nome completo"
                variant="outlined"
                prepend-inner-icon="$account"
                :disabled="loading"
                required
                class="mb-3"
              ></v-text-field>

              <v-text-field
                v-model="form.email"
                :rules="emailRules"
                label="E-mail"
                type="email"
                variant="outlined"
                prepend-inner-icon="$email"
                :disabled="loading"
                required
                class="mb-3"
              ></v-text-field>

              <v-text-field
                v-model="form.password"
                :rules="passwordRules"
                label="Senha"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                prepend-inner-icon="$lock"
                :append-inner-icon="showPassword ? '$eye' : '$eyeOff'"
                @click:append-inner="showPassword = !showPassword"
                :disabled="loading"
                required
                class="mb-3"
              ></v-text-field>

              <v-text-field
                v-model="form.confirmPassword"
                :rules="confirmPasswordRules"
                label="Confirme sua senha"
                :type="showConfirmPassword ? 'text' : 'password'"
                variant="outlined"
                prepend-inner-icon="$lockCheck"
                :append-inner-icon="showConfirmPassword ? '$eye' : '$eyeOff'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                :disabled="loading"
                required
                class="mb-4"
              ></v-text-field>

              <div class="text-caption text-medium-emphasis mb-4">
                Ao criar uma conta, você concorda com nossos
                <a href="#" class="text-primary text-decoration-none"
                  >Termos de Serviço</a
                >
                and
                <a href="#" class="text-primary text-decoration-none"
                  >Política de Privacidade</a
                >.
              </div>

              <v-btn
                type="submit"
                color="primary"
                variant="flat"
                size="large"
                block
                :loading="loading"
                :disabled="!valid || loading"
                class="mb-4"
              >
                Criar Conta
              </v-btn>

              <div class="text-center">
                <span class="text-body-2 text-medium-emphasis">
                  Já tem uma conta?
                </span>
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  @click="goToLogin"
                  class="text-none ml-1"
                  :disabled="loading"
                >
                  Entrar
                </v-btn>
              </div>
            </v-card-text>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.fill-height {
  min-height: 100vh;
}

.v-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.v-radio-group :deep(.v-selection-control) {
  min-height: auto;
}

.v-radio-group :deep(.v-label) {
  opacity: 1;
  font-weight: 500;
}
</style>
