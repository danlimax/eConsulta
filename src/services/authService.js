import APIService from "./apiService";

class AuthService extends APIService {
  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async registerPatient(userData) {
    try {
      const response = await fetch(`${this.baseURL}/user/patient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Patient registration error:", error);
      throw error;
    }
  }

  async registerDoctor(userData) {
    try {
      const response = await fetch(`${this.baseURL}/user/doctor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Doctor registration error:", error);
      throw error;
    }
  }

  async userDetails() {
    try {
      const token = this.getToken();
      const response = await fetch(`${this.baseURL}/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch user details");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("User details error:", error);
      throw error;
    }
  }
}

export default new AuthService();
