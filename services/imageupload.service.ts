import { AxiosPromise } from "axios";
import { imageUploadAxios } from "config/image_upload_axios";
// cookie
import cookie from "js-cookie";

class ImageBatchAPIService {
  //Passing bearer for all api calls
  getAxiosHeaders(): any {
    return {
      Authorization: `Bearer ${cookie.get("accessToken")}`,
      "Content-Type": "application/json",
    };
  }

  createModelImagesResize(modelId, data): Promise<any> {
    return this.post(`assets/resize/${modelId}`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  uploadImages(data): Promise<any> {
    return this.post(`annotations-update/`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
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

  post(url: string, auth, data = {}): AxiosPromise<any> {
    return imageUploadAxios({
      method: "POST",
      url,
      data,
      headers: auth ? this.getAxiosHeaders() : null,
    });
  }
}

export default ImageBatchAPIService;
