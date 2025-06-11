import { Modal, Spinner } from "react-bootstrap";

const LeavePageModal = ({ showModal, onClick, onClose, save }: any) => {
  return (
    <Modal
      onHide={onClose}
      keyboard={false}
      show={showModal ? true : false}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header style={{ backgroundColor: "white" }}>
        <Modal.Title className="text-primary fw-bold font-20">
          {showModal === "step" ? "Clear images" : "Do you want to leave"}?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0 mx-2">
        <p className="font-14 mb-3" style={{ lineHeight: "21px" }}>
          {showModal === "step"
            ? "Are you sure you want to clear all images?"
            : "Are you sure? Changes you made may not be saved."}
        </p>
        <div className="d-flex mt-4">
          <button className="btn btn-primary btn-sm" onClick={onClick}>
            {save && <Spinner animation="border" className="me-2 sp-wh" />}
            {showModal === "step" ? "Clear" : ` Leave`}
          </button>
          <button className="btn btn-sm ms-3 border-0" onClick={onClose}>
            {showModal === "step" ? "Close" : "Stay in"}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default LeavePageModal;
