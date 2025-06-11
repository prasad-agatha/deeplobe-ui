// endpoints
import { LOGIN, RESET_PASSWORD } from "lib/endpoints";
// services
import APIService from "services/api.service";
// next
import Router from "next/router";

class GlobalService extends APIService {
  contact(data = {}): Promise<any> {
    return this.post("/contact-us/", false, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  checkName(name: string): Promise<any> {
    return this.get(`/check-name/${name}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
}

export default GlobalService;
