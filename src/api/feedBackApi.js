import axiosClient from "./axiosClient";

const userEndPoint = "feedback";

const partnerApi = {
  getAll: () => axiosClient.get(userEndPoint),
  create: (params) => axiosClient.post(userEndPoint, params),
  delete: (id) => axiosClient.delete(`${userEndPoint}/${id}`),
};

export default partnerApi;
