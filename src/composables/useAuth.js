import { ref, computed } from "vue";
import authService from "@/services/authService";

const user = ref(null);
const loading = ref(false);
const error = ref(null);

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value);
  const isPatient = computed(() => user.value?.userType === "paciente");
  const isDoctor = computed(() => user.value?.userType === "medico");

  const loadUser = async () => {
    if (!authService.isAuthenticated()) {
      user.value = null;
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const userData = await authService.userDetails();
      user.value = userData;
    } catch (err) {
      error.value = err.message;
      user.value = null;

      authService.logout();
    } finally {
      loading.value = false;
    }
  };

  const login = async (credentials) => {
    try {
      await authService.login(credentials);
      await loadUser();
      return user.value;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    user.value = null;
    error.value = null;
  };

  return {
    user: user,
    loading: loading,
    error: error,

    isAuthenticated,
    isPatient,
    isDoctor,

    loadUser,
    login,
    logout,
  };
}
