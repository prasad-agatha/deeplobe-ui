import { useFormik } from "formik";
import { FC, useState, useEffect } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import SupportService from "services/support.services";

const supportService = new SupportService();
const CustomUpdateModal = ({ updateModal, setUpdateModal, row, mutate }) => {
  const { values, handleSubmit, handleCancel, handleChange }: any = useFormik({
    initialValues: {
      status: row.status ? row.status : "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      supportService
        .updateCustomModal({ status: values.status.toLowerCase() }, row.id)
        .then(() => {
          mutate();
          toast.success("Changes done successfully");
          setUpdateModal(false);
        })
        .catch((error) => {
          toast.error(error);
        });
    },
  });

  const status = [
    "New",
    "Closed",
    "Contacted",
    "Resolved",
    "Active",
    "Open",
    // "In Progress",
    // "Awaiting Results",
    "Assigned",
    "UnContacted",
  ];

  return (
    <Modal
      size="sm"
      show={updateModal}
      onHide={() => setUpdateModal(false)}
      // backdrop="static"
      keyboard={false}
      animation={false}
      centered
    >
      <Modal.Header
        className="border-bottom-0"
        style={{ backgroundColor: "white", color: "black" }}
      >
        <Modal.Title className="ps-0 text-primary fw-bold font-inter">Update Status</Modal.Title>
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
          <Form.Label className="form-custom-label my-2">Status</Form.Label>
          <select
            className="form-select font-inter w-100 my-1"
            id="inputGroupSelect02"
            required
            name="status"
            value={values.status}
            onChange={handleChange}
          >
            <option value="" className="text-muted" disabled hidden selected>
              Select Status
            </option>
            {status.map((item, index) => (
              <option key={index} value={item.toLowerCase()}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-top-0 justify-content-end py-1 mb-2 px-4">
        <button
          className="btn  btn-sm ms-3 font-inter border-0"
          onClick={() => setUpdateModal(false)}
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
export default CustomUpdateModal;
