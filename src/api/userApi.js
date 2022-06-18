import axiosClient from "./axiosClient";

const userEndPoint = "user";

const useApi = {
  getAll: () => axiosClient.get(userEndPoint),
  create: (params) => axiosClient.post(userEndPoint, params),
  getOne: (id) => axiosClient.get(`${userEndPoint}/${id}`),
  update: (id, params) => axiosClient.put(`${userEndPoint}/${id}`, params),
  vaccinated: (params) =>
    axiosClient.post(`${userEndPoint}/vaccinated`, params),
  delete: (id) => axiosClient.delete(`${userEndPoint}/${id}`),
  getPlaceUser: () => axiosClient.get(`${userEndPoint}/ok/getallplaceanduser`),
};

export default useApi;
