import APIService from "./api.service";

class SubService extends APIService {
  getSession(): Promise<any> {
    return this.get(`chargebeesession/`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  users(): Promise<any> {
    return this.get(`workspace/users/`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  cancleRenewal(data = {}): Promise<any> {
    return this.post("chargebeesubscriptioncancellation/", true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  collaboratorInvitation(data = {}): Promise<any> {
    return this.post("collaborator-invitation/", true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  collaboratorInvitationAccept(data = {}): Promise<any> {
    return this.post("collaborator-invitation-confirmation/", true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  getCollaboratorInvitation(): Promise<any> {
    return this.get("collaborator-invitation/")
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  updateCollaboratorInvitation(id: any, data = {}): Promise<any> {
    return this.put(`collaborator-invitation/${id}/`, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  removeCollaborator(id: any): Promise<any> {
    return this.delete(`collaborator-invitation/${id}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  deleteCollaboratorRequest(token: any): Promise<any> {
    return this.delete(`collaborator-invitation-confirmation/?token=${token}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  deleteCollaborators(): Promise<any> {
    return this.delete(`workspace-collaborators-deletion/`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  personalWorkspace(): Promise<any> {
    return this.get(`personalworkspace/`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  Apicount(): Promise<any> {
    return this.get(`apicount/`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  stripeInvoices(): Promise<any> {
    return this.get(`stripe_invoice_list/`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }

  chargebeeInvoicePDF(data = {}): Promise<any> {
    return this.post(`chargebeeinvoicepdfgenerator/`, true, data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
}

export default SubService;
