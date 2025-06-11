import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import MainLayout from "layouts/MainLayout";
import SubService from "services/sub.service";

const subService = new SubService();

const Invitation = () => {
  const router = useRouter();
  const { workspace, token } = router.query;
  const [load, setLoad] = useState(false);

  const acceptInvitaion = async () => {
    try {
      setLoad(true);
      await subService.collaboratorInvitationAccept({ workspace, token });
      setLoad(false);
      router.push("/dashboard");
    } catch (e) {
      setLoad(false);
      toast.error("Error accepting invitation");
    }
  };

  return (
    <>
      <MainLayout>
        <Head>
          <title>Invitation</title>
        </Head>

        <Modal
          keyboard={false}
          show={true}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header className="pb-0" style={{ backgroundColor: "white" }}>
            <Modal.Title className="ps-0 text-primary fw-bold font-inter">
              Collaborator Invitation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-o0 mx-2">
            <p className="font-16 font-inter mb-3">
              Are you sure you want to accept this invitation?
            </p>
            <div className="d-flex mt-4">
              <button className="btn btn-primary btn-sm font-inter" onClick={acceptInvitaion}>
                {load && (
                  <Spinner
                    animation="border"
                    className="me-2"
                    style={{ width: "1rem", height: "1rem" }}
                  />
                )}
                Accept
              </button>
              <button
                className="btn border-0 btn-sm ms-3 font-inter"
                onClick={() => router.push("/dashboard")}
              >
                Cancel
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </MainLayout>
    </>
  );
};

export default Invitation;
