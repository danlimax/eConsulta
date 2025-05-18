import { ref, computed } from "vue";
import authService from "@/services/authService";

// Global state - will be shared across all components
const user = ref(null);
const loading = ref(false);
const error = ref(null);

export function useAuth() {
  // Computed properties
  const isAuthenticated = computed(() => !!user.value);
  const isPatient = computed(() => user.value?.userType === "Patient");
  const isDoctor = computed(() => user.value?.userType === "Doctor");

  // Load user details
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
      // If token is invalid, clear it
      authService.logout();
    } finally {
      loading.value = false;
    }
  };

  // Login wrapper that loads user after successful login
  const login = async (credentials) => {
    try {
      await authService.login(credentials);
      await loadUser();
      return user.value;
    } catch (err) {
      throw err;
    }
  };

  // Logout wrapper that clears user state
  const logout = () => {
    authService.logout();
    user.value = null;
    error.value = null;
  };

  return {
    // State
    user: user,
    loading: loading,
    error: error,

    // Computed
    isAuthenticated,
    isPatient,
    isDoctor,

    // Methods
    loadUser,
    login,
    logout,
  };
}
