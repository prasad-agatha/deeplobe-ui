// services
import APIService from "services/api.service";

class CustomModelService extends APIService {
  getModels(): Promise<any> {
    return this.get(`/custom-models/`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
  createModel(data): Promise<any> {
    return this.post(`/custom-models/`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
  getModel(uuid): Promise<any> {
    return this.get(`custom-models/${uuid}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
  updateModel(data, uuid): Promise<any> {
    return this.put(`/custom-models/${uuid}/`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
}

export default CustomModelService;
