import APIService from "./api.service";

class ModelTrainService extends APIService {
  trainModel(data): Promise<any> {
    return this.post(`aimodels/`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data?.msg ? error.response.data.msg : error.response.data;
      });
  }

  retrainModel(id, data): Promise<any> {
    return this.post(`aimodels/${id}/retraining/`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }

  retrainAnnotationModel(id, data): Promise<any> {
    return this.post(`aimodels/${id}/retraining/annotation/`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }

  saveOCRModel(data): Promise<any> {
    return this.post(`ocr/save/aimodel/`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }

  getModelDetails(modelUUId: any): Promise<any> {
    return this.get(`custom-models/${modelUUId}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data?.msg ? error.response.data.msg : error.response.data;
      });
  }

  getOCRModelDetails(modelId: any): Promise<any> {
    return this.get(`ocr/aimodel/${modelId}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }

  predictModel(modelId: any, data): Promise<any> {
    return this.post(`aimodels/${modelId}/prediction`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  uploadAsset(data): Promise<any> {
    return this.post(`assets/`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  resizeImage(data, id): Promise<any> {
    return this.put(`/assets/${id}/resize/`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  createModelImages(modelId, data): Promise<any> {
    return this.post(`ai-models/${modelId}`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }

  deleteModel(modelId): Promise<any> {
    return this.delete(`aimodels/${modelId}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }

  autoAnnotateDetails(data): Promise<any> {
    return this.post(`autoannotate/`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
}

export default ModelTrainService;
