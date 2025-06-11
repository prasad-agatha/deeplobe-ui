import APIService from "./api.service";

class FrameService extends APIService {
  frames_count(data): Promise<any> {
    return this.post(`frames-count/`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  convertToFrames(data): Promise<any> {
    return this.post(`frames/`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
}

export default FrameService;
