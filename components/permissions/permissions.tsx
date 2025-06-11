import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import UserService from "services/user.service";
// toasts
import { toast } from "react-toastify";
//toast configuration
toast.configure();

const userService = new UserService();
export default function Permissions(props) {
  const { row, reload, setReload } = props;
  const per = row.model_permissions.length > 0 ? row.model_permissions[0] : {};
  let INITIAL_VALUES = {};
  row.email.split("@")[1] !== "soulpageit.com" && "intellectdata.com"
    ? (INITIAL_VALUES = {
        pretrained: false,
        image_classification: false,
        image_similarity: false,
        semantic_segmentation: false,
        instance_segmentation: false,
        optical_character_recognition: false,
        image_tagging: false,
      })
    : (INITIAL_VALUES = {
        pretrained: true,
        image_classification: true,
        image_similarity: true,
        semantic_segmentation: true,
        instance_segmentation: true,
        optical_character_recognition: true,
        image_tagging: true,
      });
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ ...INITIAL_VALUES, ...per });

  // Modal handlers
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //  Form Submission handler
  const handleSubmit = () => {
    const {
      pretrained,
      image_classification,
      image_similarity,
      semantic_segmentation,
      instance_segmentation,
      optical_character_recognition,
      image_tagging,
    } = data;
    const payload = {
      email: row.email,
      model_permissions: [
        {
          pretrained,
          image_classification,
          image_similarity,
          semantic_segmentation,
          instance_segmentation,
          optical_character_recognition,
          image_tagging,
        },
      ],
    };
    userService
      .updatePermissions(payload)
      .then((res) => {
        toast.success("Permissions Updated");
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    setData({ ...data });
  }, [props]);

  // Form Data
  const handleChange = (name) => (e) => {
    setData({ ...data, [name]: e.target.checked });
  };
  return (
    <>
      <button
        className="btn btn-primary font-inter"
        style={{ fontSize: "12px" }}
        onClick={handleShow}
      >
        Edit Permissions
      </button>

      <Modal show={show} centered onHide={handleClose}>
        <Modal.Header className="pb-0" style={{ backgroundColor: "white" }}>
          <Modal.Title className="ps-0 text-primary fw-bold font-inter">
            Model Permissions
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="pb-3">{row.email}</h6>
          <Form>
            <Form.Group className="mb-3 d-flex">
              <Form.Check
                type="switch"
                id="custom-switch"
                label={`Pretrained Models`}
                checked={data.pretrained || false}
                onChange={handleChange("pretrained")}
              />
            </Form.Group>
            <Form.Group className="mb-3 d-flex">
              <Form.Check
                type="switch"
                id="custom-switch1"
                label={`Image Classification`}
                checked={data.image_classification || false}
                onChange={handleChange("image_classification")}
              />
            </Form.Group>
            <Form.Group className="mb-3 d-flex">
              <Form.Check
                type="switch"
                id="custom-switch2"
                label="Image Similarity"
                checked={data.image_similarity || false}
                onChange={handleChange("image_similarity")}
              />
            </Form.Group>
            <Form.Group className="mb-3 d-flex">
              <Form.Check
                type="switch"
                id="custom-switch3"
                label="Semantic Segmentation"
                checked={data.semantic_segmentation || false}
                onChange={handleChange("semantic_segmentation")}
              />
            </Form.Group>
            <Form.Group className="mb-3 d-flex">
              <Form.Check
                type="switch"
                id="custom-switch4"
                label="Instance Segmentation"
                checked={data.instance_segmentation || false}
                onChange={handleChange("instance_segmentation")}
              />
            </Form.Group>
            <Form.Group className="mb-3 d-flex">
              <Form.Check
                type="switch"
                id="custom-switch5"
                label="Optical character recognition"
                checked={data.optical_character_recognition || false}
                onChange={handleChange("optical_character_recognition")}
              />
            </Form.Group>
            <Form.Group className="mb-3 d-flex">
              <Form.Check
                type="switch"
                id="custom-switch6"
                label="Image Tagging"
                checked={data.image_tagging || false}
                onChange={handleChange("image_tagging")}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleSubmit();
              handleClose();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
