import axios from "axios";

const API = "http://localhost:5000/api/licenses";

export const bookLicenseAPI = async (data, token) => {
  return axios.post(`${API}/book`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
