import { Modal, Spinner } from "react-bootstrap";

const DeleteImage = ({ load, show, setShow, deleteImage }: any) => {
  return (
    <Modal
      onHide={() => setShow("")}
      keyboard={false}
      show={show ? true : false}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="" style={{ backgroundColor: "white" }}>
        <Modal.Title className="text-primary fw-bold font-20">Delete Image</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0 mx-2">
        <p className="font-14 mb-3" style={{ lineHeight: "21px" }}>
          Are you sure you want to delete this image?
        </p>

        <div className="d-flex mt-4">
          <button className="btn btn-primary btn-sm" onClick={deleteImage}>
            {load && <Spinner animation="border" className="me-2 sp-wh" />}
            {` Delete`}
          </button>
          <button className="btn btn-sm ms-3 border-0" onClick={() => setShow("")}>
            Cancel
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default DeleteImage;
