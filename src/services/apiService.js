const API_BASE_URL = "http://localhost:5211/api";

class APIService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  logout() {
    localStorage.removeItem("authToken");
  }

  getToken() {
    return localStorage.getItem("authToken");
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default APIService;
