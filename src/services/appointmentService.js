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
      console.error("Failed to list appointments:", error);
      throw error;
    }
  }

  async getSchedulesByDoctorId(doctorId) {
    try {
      const token = this.getToken();
      const response = await fetch(
        `${this.baseURL}/schedule/doctor/apointments/${doctorId}`,
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
        throw new Error(
          error.message || "Failed to fetch doctor's appointments"
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting schedules by doctor ID:", error);
      throw error;
    }
  }

  async getSchedulesByPatientId(patientId) {
    try {
      const token = this.getToken();
      const response = await fetch(
        `${this.baseURL}/schedule/patient/apointments/${patientId}`,
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
        throw new Error(
          error.message || "Failed to fetch patient's appointments"
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting schedules by patient ID:", error);
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
      console.error("Error listing doctors:", error);
      throw error;
    }
  }
  async listPatients() {
    try {
      const token = this.getToken();
      const response = await fetch(`${this.baseURL}/user/patients`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch patients");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error listing patients:", error);
      throw error;
    }
  }
  async createSchedule(schedules) {
    try {
      const token = this.getToken();
      const response = await fetch(`${this.baseURL}/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(schedules),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao criar os horários");
      }

      return await response.json();
    } catch (error) {
      console.error("Create schedule error:", error);
      throw error;
    }
  }

  async updateSchedule(id, data) {
    try {
      const token = this.getToken();
      const response = await fetch(`${this.baseURL}/schedule/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro na requisição");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      throw error;
    }
  }

  async updatePatientSchedule(scheduleId) {
    try {
      const token = this.getToken();
      const response = await fetch(
        `${this.baseURL}/schedule/apointment/${scheduleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Erro ao agendar horário ${scheduleId}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error(`Erro ao agendar horário ${scheduleId}:`, error);
      throw error;
    }
  }
}

export default AppointmentService;
