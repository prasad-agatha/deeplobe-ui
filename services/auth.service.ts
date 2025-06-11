// endpoints
import { BACKEND_API, LOGIN, RESET_PASSWORD } from "lib/endpoints";
// services
import APIService from "services/api.service";
// next
import Router from "next/router";

class AuthService extends APIService {
  logIn(data = {}): Promise<any> {
    return this.post("/email-auth/", false, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }

  authenticateUser(accessToken: string): void {
    this.setAccessToken(accessToken);
    // Router.replace("/dashboard");
  }

  logOut(): void {
    this.purgeAuth();
  }

  forgotPassword(data: any): Promise<any> {
    return this.post("/forgot-password/", false, data)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  resetPassword(data: any): Promise<any> {
    return this.post("/password-confirm/", false, data)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  socialLogin(data = {}): Promise<any> {
    return this.post("gmail-auth/", false, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  sendMagicLink(data = {}): Promise<any> {
    return this.post("magiclink/", false, data)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  registerWithMagicLink(data = {}): Promise<any> {
    return fetch(`${BACKEND_API}/api/magiclinkregister/`, {
      method: "POST",
      headers: { Authorization: "", "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })

      .then((res) => {
        return res;
      })
      .catch((error) => {
        throw error;
      });
    // return this.postWithoutHeaders("magiclinkregister/", false, data)
    //   .then((res) => {
    //     return res;
    //   })
    //   .catch((error) => {
    //     throw error;
    //   });
  }

  verifyMagicCode(data = {}): Promise<any> {
    return this.getWithoutHeaders(`verifymagiclink/?token=${data}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      });
  }
}

export default AuthService;
