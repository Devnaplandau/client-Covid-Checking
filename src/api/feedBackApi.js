import axiosClient from "./axiosClient";

const feedBackEndPoint = "feedback";

const partnerApi = {
  getAll: () => axiosClient.get(feedBackEndPoint),
  create: (params) => axiosClient.post(feedBackEndPoint, params),
  delete: (id) => axiosClient.delete(`${feedBackEndPoint}/${id}`),
  update: (id, params) => axiosClient.put(`${feedBackEndPoint}/${id}`, params),
};

export default partnerApi;
