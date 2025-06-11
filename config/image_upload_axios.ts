import axios from "axios";
import { ConcurrencyManager } from "axios-concurrency";
import { BACKEND_API } from "lib/endpoints";
import UserService from "services/user.service";

let imageUploadAxios = axios.create({
  baseURL: `${BACKEND_API}/api`,
});

// a concurrency parameter of 1 makes all api requests secuential
const MAX_CONCURRENT_REQUESTS = 20;

// init your manager.
const imageUploadAxiosManager = ConcurrencyManager(imageUploadAxios, MAX_CONCURRENT_REQUESTS);

(function () {
  const userService = new UserService();
  const token = userService.getAccessToken();
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    axios.defaults.headers.common.Authorization = "";
  }
})();

export { imageUploadAxios, imageUploadAxiosManager };
