import APIService from "./apiService";

class AppointmentService extends APIService {
  async list() {
    try {
      const token = this.getToken();
      const response = await fetch(
        `${this.baseURL}/schedule/patient/apointments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch appointments");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async listDoctors() {
    try {
      const token = this.getToken();
      const response = await fetch(`${this.baseURL}/user/doctors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch doctors");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
}

export default AppointmentService;
