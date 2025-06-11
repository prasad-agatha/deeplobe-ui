import axios, { AxiosPromise } from "axios";
// cookie
import cookie from "js-cookie";

abstract class PreTrainedAPIService {
  //Passing bearer for all api calls
  getAxiosHeaders(): any {
    return {
      "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Credentials": true,
      //   "Access-Control-Allow-Methods": "*",
      //   "Access-Control-Allow-Headers": "*",
      //   "Content-Type": "application/x-www-form-urlencoded",
      "Content-Type": "application/json",
    };
  }

  // Axios post method

  post(url: string, data = {}): AxiosPromise<any> {
    return axios({
      method: "POST",
      url,
      data,
      headers: this.getAxiosHeaders(),
    });
  }
}

export default PreTrainedAPIService;
