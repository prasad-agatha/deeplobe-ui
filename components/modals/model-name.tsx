import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";

function ModelName(props) {
  const { show, setShow, formik, trainModel, error } = props;

  return (
    <div>
      <Modal
        onHide={() => {
          setShow(false);
        }}
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="pb-0">
          <Modal.Title className="ps-0 text-primary fw-bold font-inter">
            Hey There! How do you want us to remember this model
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <Form.Label>Model Name</Form.Label>
            <Form.Control
              value={formik.values.name}
              onChange={formik.handleChange("name")}
              className="border-0 custom-input"
              type="text"
              placeholder="Give a name that is significant for this model"
              autoComplete="new-off"
            />
          </p>
          <p>
            <Form.Label>Model Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={formik.values.description}
              onChange={formik.handleChange("description")}
              type="text"
              placeholder="Give a description that is significant for this model"
              autoComplete="new-off"
            />
          </p>
          <p className="text-center mt-3">
            <Button onClick={() => trainModel()}>Train model</Button>
          </p>
          <p className="text-center mt-3 info-error">{error}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ModelName;
