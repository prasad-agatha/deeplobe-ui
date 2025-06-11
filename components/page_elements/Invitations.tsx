import React, { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import SubService from "services/sub.service";
import { getLabelName } from "common_functions/functions";

const subService = new SubService();

const Invitation = ({ router, mutate }) => {
  const [deleteModal, setDeleteModal] = useState(null);
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState<any>(null);
  const [rload, setRLoad] = useState(false);
  const [data, setData] = useState([]);
  const [render, setRender] = useState(false);

  useEffect(() => {
    const getInvitations = async () => {
      try {
        const res = await subService.getCollaboratorInvitation();
        setData(res);
      } catch (e) {
        toast.error(e);
      }
    };
    getInvitations();
  }, [render]);

  useEffect(() => {
    if (router.query?.workspace && router.query?.token) {
      const invite = data.find(
        (e) =>
          e.workspace.toString() === router.query?.workspace &&
          e.subscription === router.query?.token
      );
      if (invite)
        setShow({ workspace: router.query?.workspace, subscription: router.query?.token });
    }
  }, [data, router.query]);

  const acceptInvitaion = async ({ workspace, subscription }: any) => {
    if (!load) {
      try {
        setLoad(true);
        await subService.collaboratorInvitationAccept({ workspace, token: subscription });
        setRender(!render);
      } catch (e) {
        toast.error(e);
      } finally {
        mutate();
        setLoad(false);
        setShow(null);
      }
    }
  };

  return (
    <div className="my-3">
      {(data || [])
        .filter((el: any, id: any) => id < 3)
        .map((e: any, id: any) => (
          <div className="card flex-row p-2 pe-4 align-items-center relative" key={id}>
            <img
              src="/iclose.svg"
              alt="/iclose"
              className="cursor-pointer iclose"
              height={18}
              width={18}
              onClick={() => {
                setData(data.filter((el: any) => el.id !== e.id));
              }}
            />
            <img src="/info-i.svg" alt="/info" className="pe-2" />
            <span>
              {getLabelName(e.invitee.username)} invites you to{" "}
              {e.role === "collaborator" ? "collaborate" : "annotate"} in his work space
            </span>

            <button
              className="btn border-primary txt-primary ms-auto font-12 text-nowrap"
              onClick={() => acceptInvitaion(e)}
            >
              {load && <Spinner animation="border" className="me-2 sp-wh" />}
              <img src="/check.svg" alt="/check" width={12} className="me-2" />
              Accept
            </button>
            <button
              className="btn btn-sm ms-3 font-12 text-danger border-0"
              onClick={() => setDeleteModal(e)}
            >
              Reject
            </button>
          </div>
        ))}

      <Modal
        onHide={() => setDeleteModal(null)}
        keyboard={false}
        show={deleteModal ? true : false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header style={{ backgroundColor: "white" }}>
          <Modal.Title className="ps-0 text-primary fw-bold font-inter">
            Reject Invitation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0 mx-1">
          <div className="mx-1">
            <p className="for-start mb-3">Are you sure you want to reject this invitation?</p>
            <div className="d-flex mt-4">
              <button
                className="btn btn-primary btn-sm font-inter"
                onClick={async () => {
                  if (!rload) {
                    setRLoad(true);
                    try {
                      await subService.deleteCollaboratorRequest(deleteModal.subscription);
                      setRender(!render);
                      toast.success("Invitation rejected successfully");
                      setDeleteModal(null);
                      setRLoad(false);
                    } catch (e) {
                      toast.error(e);
                      setRLoad(false);
                    }
                  }
                }}
              >
                {rload && <Spinner animation="border" className="me-2  sp-wh" />}
                Reject
              </button>
              <button
                className="btn btn-sm ms-3 font-inter border-0"
                onClick={() => setDeleteModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        keyboard={false}
        show={show ? true : false}
        onHide={() => {
          setShow(null);
          router.replace("/dashboard");
        }}
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
            <button
              className="btn btn-primary btn-sm font-inter"
              onClick={() => acceptInvitaion(show)}
            >
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
              className="btn border-0 btn-sm ms-3"
              onClick={() => {
                setShow(null);
                router.replace("/dashboard");
              }}
            >
              Cancel
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default Invitation;
