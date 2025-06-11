// endpoints
import { LOGIN, RESET_PASSWORD } from "lib/endpoints";
// services
import APIService from "services/api.service";
// next
import Router from "next/router";

class ModelService extends APIService {
  download(uuid): Promise<any> {
    return this.get(`download-model/${uuid}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  getallModels(data: any): Promise<any> {
    return this.get(`allmodels/?search=${data}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
  getapiKeyModels(): Promise<any> {
    return this.get(`api_key_models`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
  getMyModels(): Promise<any> {
    return this.get("custom-models/")
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  deleteModel(uuid): Promise<any> {
    return this.delete(`model-details/${uuid}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  getApiLogger(): Promise<any> {
    return this.get(`/api-logger/`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  getApiLoggerDetails(modelType): Promise<any> {
    return this.get(`/api-logger-view/${modelType}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  getCustomModelApiLoggerDetails(modelId): Promise<any> {
    return this.get(`/api-logger-details/${modelId}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
}

export default ModelService;
