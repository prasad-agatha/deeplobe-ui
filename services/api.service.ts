import axios, { AxiosPromise } from "axios";
// cookie
import cookie from "js-cookie";

abstract class APIService {
  //Passing bearer for all api calls
  getAxiosHeaders(): any {
    return {
      Authorization: `Bearer ${cookie.get("accessToken")}`,
      "Content-Type": "application/json",
    };
  }

  getMultiPartHeader(): any {
    return {
      Authorization: `Bearer ${cookie.get("accessToken")}`,
      "Content-Type": "multipart/form-data",
    };
  }

  // Setting access token in a cookie
  setAccessToken(token: string): void {
    cookie.set("accessToken", token);
  }

  // Setting refresh token in a cookie
  setRefreshToken(token: string): void {
    cookie.set("refreshToken", token);
  }

  purgeAuth(): void {
    cookie.remove("accessToken");
    cookie.remove("refreshToken");
  }

  get(url: string): AxiosPromise<any> {
    return axios({ method: "GET", url, headers: this.getAxiosHeaders() });
  }

  getWithoutHeaders(url: string): AxiosPromise<any> {
    return axios({ method: "GET", url });
  }

  post(url: string, auth, data = {}): AxiosPromise<any> {
    return axios({
      method: "POST",
      url,
      data,
      headers: auth ? this.getAxiosHeaders() : null,
    });
  }
  postWithMultiPartHeaders(url: string, data = {}): AxiosPromise<any> {
    return axios({
      method: "POST",
      url,
      data,
      headers: {
        Authorization: `Bearer ${cookie.get("accessToken")}`,
        "Content-Type": "multipart/form-data",
      },
    });
  }

  postWithoutHeaders(url: string, auth, data = {}): AxiosPromise<any> {
    console.log("data", {
      method: "POST",
      url,
      data,
      headers: {},
    });
    return axios({
      method: "POST",
      url,
      data,
      headers: {},
    });
  }

  put(url: string, data = {}): AxiosPromise<any> {
    return axios({
      method: "PUT",
      url,
      data,
      headers: this.getAxiosHeaders(),
    });
  }

  delete(url: string): AxiosPromise<any> {
    return axios({
      method: "DELETE",
      url,
      headers: this.getAxiosHeaders(),
    });
  }
}

export default APIService;
