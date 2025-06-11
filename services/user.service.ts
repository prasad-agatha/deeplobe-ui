import APIService from "./api.service";
// cookie
import cookie from "js-cookie";

//TODO: Add url in endpoints
class UserService extends APIService {
  // Getting access token from cookie
  getAccessToken(): string | undefined {
    return cookie.get("accessToken");
  }

  // Getting refresh token from cookie
  getRefreshToken(): string | undefined {
    return cookie.get("refreshToken");
  }
  getUserDetails(url: any = "user-details/"): Promise<any> {
    return this.get(url)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
  updateUserDetails(data): Promise<any> {
    return this.put(`user-details/`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data?.msg ? error.response.data.msg : error.response.data;
      });
  }

  getAllUserDetails(url: any = "all-users/"): Promise<any> {
    return this.get(url)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  generateApiKey(data: any): Promise<any> {
    return this.post(`api-keys/`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  donutChatstatistics(data: {}, time_period: any, start_data: any, end_date: any): Promise<any> {
    return this.post(
      `circular_chart_api_statistics_by_time_period/?time_period:${time_period},start_date:${start_data},end_date:${end_date}`,
      true,
      data
    )
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  deleteApiKey(id: any): Promise<any> {
    return this.delete(`/users/api-keys/${id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }

  deleteUser(): Promise<any> {
    return this.delete(`/user-details/`)
      .then((res) => {
        cookie.remove("accessToken");
        cookie.remove("refreshToken");
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  getUserApiKeys(): Promise<any> {
    return this.get("/api-keys/")
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  getStaticData(): Promise<any> {
    return this.get("/api_statistics/")
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }

  isAdmin(url: any = "admin/"): Promise<any> {
    return this.get(url)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  getCountrySearch(search: any): Promise<any> {
    return this.get(`country/?name=${search}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }

  getStateSearch(country: any, search: any): Promise<any> {
    return this.get(`state/?country=${country}&name=${search}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  updatePermissions(data): Promise<any> {
    return this.put(`modelpermissions/`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  createSession(data): Promise<any> {
    return this.post("/create-session/", true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data?.msg ? error.response.data.msg : error.response.data;
      });
  }

  createPortal(data): Promise<any> {
    return this.post("/create-portal-session/", true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data?.msg ? error.response.data.msg : error.response.data;
      });
  }
}

export default UserService;
