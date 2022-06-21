import axiosClient from "./axiosClient";

const userEndPoint = "partner";

const partnerApi = {
  login: (params) => axiosClient.post(`${userEndPoint}/login`, params),
  getAll: () => axiosClient.get(userEndPoint),
  create: (params) => axiosClient.post(userEndPoint, params),
  getOne: (id) => axiosClient.get(`${userEndPoint}/${id}`),
  update: (id, params) => axiosClient.put(`${userEndPoint}/${id}`, params),
  delete: (id) => axiosClient.delete(`${userEndPoint}/${id}`),
  checkToken: () => axiosClient.post("partner/check-token"),
};

export default partnerApi;
