// endpoints
import { LOGIN, RESET_PASSWORD } from "lib/endpoints";
// services
import APIService from "services/api.service";
// next
import Router from "next/router";

class UuidStatusService extends APIService {
  getUuidStatus(uuid: any): Promise<any> {
    return this.get(`/uuid-status/${uuid}`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
}

export default UuidStatusService;
