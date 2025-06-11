import axios from "axios";
// constants
import { BACKEND_API } from "lib/endpoints";
// service
import UserService from "services/user.service";

axios.defaults.baseURL = `${BACKEND_API}/api`;

(function () {
  const userService = new UserService();
  const token = userService.getAccessToken();
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    axios.defaults.headers.common.Authorization = "";
  }
})();
