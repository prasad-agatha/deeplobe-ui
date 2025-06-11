import APIService from "./api.service";

class AiAssitantService extends APIService {
  SearchQuery(data): Promise<any> {
    return (
      // this.post(`https://sample.ai/api/llms`, true, data)
      this.post(`https://llms.deeplobe.ai/api/llms`, true, data)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.log("api error ", error);
          throw error.response.data;
        })
    );
  }
}

export default AiAssitantService;
