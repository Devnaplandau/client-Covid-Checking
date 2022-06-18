import axiosClient from "./axiosClient";

const placeEndpoint = "place";

const placeApi = {
  create: (params) => axiosClient.post(placeEndpoint, params),
  getAll: () => axiosClient.get(placeEndpoint),
  getOne: (id) => axiosClient.get(`${placeEndpoint}/${id}`),
  delete: (id) => axiosClient.delete(`${placeEndpoint}/${id}`),
  // update: (params) => axiosClient.put(placeEndpoint, params),
  update: (id, params) => axiosClient.put(`${placeEndpoint}/${id}`, params),
};

export default placeApi;
