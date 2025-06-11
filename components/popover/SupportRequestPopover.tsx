import SupportRequestNotesModal from "@components/modals/SupportRequestNotesModal";
import SupportRequestUpdateModal from "@components/modals/SupportRequestUpdateModal";
import { FC, useState } from "react";

import { ListGroup, Modal, OverlayTrigger, Popover } from "react-bootstrap";
import { toast } from "react-toastify";
import SupportService from "services/support.services";

const supportService = new SupportService();

const SupportRequestPopover = ({ row, mutate }) => {
  const [showModal, setShowModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [notesModal, setNotesModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState("");

  const popover = (
    <Popover id="popover-basic">
      <ListGroup className="border-0">
        {["Update Status", "Add Notes", "Delete"].map((ele: any, id: any) => (
          <ListGroup.Item
            className="d-flex flex-row align-items-center cursor-pointer"
            onClick={() => {
              document.body.click();
              if (ele === "Update Status") setUpdateModal(true);
              else if (ele === "Add Notes") setNotesModal(true);
              else if (ele === "Delete") setDeleteModal(row.id);
              else setShowModal(true);
            }}
            key={id}
          >
            <img
              src={`/admin-images/${ele.split(" ")[0].toLowerCase()}.svg`}
              alt={ele}
              width={18}
              height={18}
            />
            <p className="ps-2 mb-0">{`${ele} `}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Popover>
  );

  return (
    <>
      <OverlayTrigger rootClose trigger="click" placement="auto" overlay={popover} transition>
        <img src="images/ellipsis-icon.svg" alt="action" className="cr-p" />
      </OverlayTrigger>
      <SupportRequestUpdateModal
        updateModal={updateModal}
        setUpdateModal={setUpdateModal}
        row={row}
        mutate={mutate}
      />
      <SupportRequestNotesModal
        notesModal={notesModal}
        setNotesModal={setNotesModal}
        row={row}
        mutate={mutate}
      />
      <Modal
        onHide={() => setDeleteModal("")}
        keyboard={false}
        show={deleteModal ? true : false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header style={{ backgroundColor: "white" }}>
          <Modal.Title className="ps-0 text-primary fw-bold font-inter">Delete Request</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0 mx-1">
          <div>
            <p className="for-start mb-3">Are you sure you want to delete this request?</p>
            <div className="d-flex mt-4">
              <button
                className="btn btn-primary btn-sm font-inter"
                onClick={async () => {
                  await supportService.deleteSupport(deleteModal);
                  mutate();
                  toast.success("Request deleted successfully");
                }}
              >
                Delete
              </button>
              <button
                className="btn btn-sm ms-3 font-inter border-0"
                onClick={() => setDeleteModal("")}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SupportRequestPopover;
