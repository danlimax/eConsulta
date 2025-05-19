<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { login } = useAuth();

// Form state
const form = reactive({
  email: "",
  password: "",
});

// UI state
const loading = ref(false);
const error = ref("");
const showPassword = ref(false);
const valid = ref(false);

// Form validation rules
const emailRules = [
  (v) => !!v || "Por favor digite um e-mail",
  (v) => /.+@.+\..+/.test(v) || "O e-mail deve ser válido",
];

const passwordRules = [
  (v) => !!v || "A senha é obrigatória",
  (v) => v.length >= 6 || "A senha deve ter pelo menos 6 caracteres",
];

const handleSubmit = async () => {
  // Check if form is valid
  if (!valid.value) {
    return;
  }

  error.value = "";
  loading.value = true;

  try {
    const userData = await login({
      email: form.email,
      password: form.password,
    });

    // Handle successful login
    console.log("Login successful:", userData);

    // Redirect to dashboard or home page
    router.push("/");
  } catch (err) {
    error.value = err.message || "Ocorreu um erro durante o login";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4" xl="3">
        <v-card class="pa-4" elevation="8" rounded="lg">
          <!-- Header -->
          <v-card-title class="text-center pa-0 mb-4">
            <div class="text-h4 text-primary font-weight-bold mb-2">
              eConsulta
            </div>
            <div class="text-subtitle-1 text-medium-emphasis">
              Entre na sua conta
            </div>
          </v-card-title>

          <!-- Error Alert -->
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            class="mb-4"
            :text="error"
            closable
            @click:close="error = ''"
          ></v-alert>

          <!-- Login Form -->
          <v-form v-model="valid" @submit.prevent="handleSubmit">
            <v-card-text class="pa-0">
              <!-- Email Field -->
              <v-text-field
                v-model="form.email"
                :rules="emailRules"
                label="E-mail"
                type="email"
                variant="outlined"
                prepend-inner-icon="mdi-email"
                :disabled="loading"
                required
                class="mb-3"
              ></v-text-field>

              <!-- Password Field -->
              <v-text-field
                v-model="form.password"
                :rules="passwordRules"
                label="Senha"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                :disabled="loading"
                required
                class="mb-3"
              ></v-text-field>

              <div class="d-flex justify-space-between align-center mb-4">
                <v-checkbox
                  label="Lembrar-me"
                  density="compact"
                  hide-details
                  :disabled="loading"
                ></v-checkbox>
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  href="#"
                  class="text-none"
                >
                  Esqueçeu sua senha?
                </v-btn>
              </div>

              <!-- Submit Button -->
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
                Entrar
              </v-btn>

              <!-- Sign Up Link -->
              <div class="text-center">
                <span class="text-body-2 text-medium-emphasis">
                  Ainda não tem uma conta?
                </span>
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  href="/register"
                  class="text-none ml-1"
                >
                  Cadastrar
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
</style>
