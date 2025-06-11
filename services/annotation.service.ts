// services
import APIService from "services/api.service";

class AnnotationService extends APIService {
  getModelAnnotations(uuid: any, type: any): Promise<any> {
    return this.get(`annotation-details/${uuid}/${type}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data?.msg ? error.response.data.msg : error.response.data;
      });
  }

  createAnnotations(uuid: any, type: any, model_type: any, data: any): Promise<any> {
    return this.post(`/annotation-details/${uuid}/${type}?model_type=${model_type}`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data?.msg ? error.response.data.msg : error.response.data;
      });
  }

  updateAnnotations(uuid: any, type: any, model_type: any, data: any): Promise<any> {
    return this.put(`/annotation-details/${uuid}/${type}?model_type=${model_type}`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  deleteModelAnnotations(uuid: any, type: any): Promise<any> {
    return this.delete(`annotation-details/${uuid}/${type}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data?.msg ? error.response.data.msg : error.response.data;
      });
  }

  ocrTextDetection(data: any): Promise<any> {
    return this.post(`/ocr_text_detection/`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data?.msg ? error.response.data.msg : error.response.data;
      });
  }

  trainModel(uuid: any): Promise<any> {
    return this.post(`/custom-models-training/${uuid}/`, true, {})
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data?.msg ? error.response.data.msg : error.response.data;
      });
  }
  trainingStatus(uuid: any): Promise<any> {
    return this.get(`/custom-models-training/${uuid}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data?.msg ? error.response.data.msg : error.response.data;
      });
  }
}

export default AnnotationService;
