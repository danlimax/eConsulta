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
        body: JSON.stringify(data), // Os dados devem ser enviados no corpo da requisição, stringificados para JSON
      });

      // Verificar se a requisição foi bem-sucedida (status 2xx)
      if (!response.ok) {
        const errorData = await response.json(); // Tenta ler a mensagem de erro do servidor
        throw new Error(errorData.message || "Erro na requisição"); // Lança um erro com a mensagem do servidor ou uma genérica
      }

      return await response.json(); // Retorna os dados da resposta em formato JSON
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      throw error;
    }
  }
}

export default AppointmentService;
