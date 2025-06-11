import { useFormik } from "formik";
import { FC, useState, useEffect } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import SupportService from "services/support.services";

const supportService = new SupportService();

const SupportRequestNotesModal = ({ setNotesModal, notesModal, row, mutate }) => {
  const { values, handleSubmit, handleCancel, handleChange }: any = useFormik({
    initialValues: {
      notes: row.notes ? row.notes : "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      supportService
        .updateSupportNotesModal({ notes: values.notes }, row.id)
        .then(() => {
          mutate();
          toast.success("Changes done successfully");
          setNotesModal(false);
        })
        .catch((error) => {
          toast.error(error);
        });
    },
  });

  return (
    <Modal
      size="sm"
      show={notesModal}
      onHide={() => setNotesModal(false)}
      // backdrop="static"
      keyboard={false}
      animation={false}
      centered
    >
      <Modal.Header className="border-bottom-0" style={{ backgroundColor: "white" }}>
        <Modal.Title className="ps-0 text-primary fw-bold font-inter">Add Notes</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pt-0">
        <div className="d-flex flex-column">
          <Form.Label className="form-custom-label my-2">Full Name</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            autoComplete="off"
            placeholder="Full name"
            className="font-14 my-1"
            value={row.name || ""}
          />
          <Form.Label className="form-custom-label my-2">Email</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            autoComplete="off"
            placeholder="Email"
            className="font-14 my-1"
            value={row.email || ""}
          />{" "}
          <Form.Label className="form-custom-label my-2">Add Notes</Form.Label>
          <Form.Control
            name="notes"
            type="text"
            as="textarea"
            placeholder="Notes"
            className="font-14 my-1"
            onChange={handleChange}
            value={values.notes || ""}
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="border-top-0 justify-content-end py-1 mb-2 px-4">
        <button
          className="btn  btn-sm ms-3 font-inter border-0"
          onClick={() => setNotesModal(false)}
        >
          Cancel
        </button>
        <button
          className="btn btn-sm btn-primary py-2 px-4 font-inter font-14"
          onClick={handleSubmit}
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
};
export default SupportRequestNotesModal;
