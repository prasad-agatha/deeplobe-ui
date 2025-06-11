// services
import APIService from "services/api.service";

class SupportService extends APIService {
  raiseSupportRequest(data): Promise<any> {
    return this.post("/support/", true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  contactSales(data): Promise<any> {
    return this.post("/contact-us/", true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }

  SupportRequestList(): Promise<any> {
    return this.get(`support/`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  updateSupportModal(data, id): Promise<any> {
    return this.put(`support_ticket/${id}`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  updateSupportNotesModal(data, id): Promise<any> {
    return this.put(`support/${id}`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  deleteSupport(id): Promise<any> {
    return this.delete(`support/${id}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  customModalRequestList(): Promise<any> {
    return this.get(`contact-us/`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
  updateCustomModal(data, id): Promise<any> {
    return this.put(`contact-us/${id}`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  deleteCustom(id): Promise<any> {
    return this.delete(`contact-us/${id}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  annotationHireRequestList(): Promise<any> {
    return this.get(`annotation-hire-expert/`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
  updateHireRequest(data, id): Promise<any> {
    return this.put(`annotation-hire-expert/${id}`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        // throw error.response.data;
      });
  }
  deleteHire(id): Promise<any> {
    return this.delete(`annotation-hire-expert/${id}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
}

export default SupportService;
