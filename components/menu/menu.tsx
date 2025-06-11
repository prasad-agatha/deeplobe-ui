// react
import React, { useState } from "react";
//next link
import Link from "next/link";
import { Popover, ListGroup, OverlayTrigger, Modal } from "react-bootstrap";
// const modelService = new ModelService();
// toasts
import { toast } from "react-toastify";

import ModelTrainService from "services/model.train.service";
import { isRole, userAccess } from "common_functions/functions";

const trainService = new ModelTrainService();
//toast configuration
toast.configure();

const Menu = (props) => {
  const { row, user, reload, setReload } = props;
  const [showModal, setShowModal] = useState(false);
  const type = row?.model_type
    ?.replace("receipts", "ocr")
    .replace("image_similarity", "similarity")
    .replace("object_detection", "object-detection");
  const redirectUrl = `/create-model/${type}/${row.uuid}`;

  const popover = (
    <Popover id="popover-basic">
      <Popover.Content className="p-0">
        <ListGroup className="border-0">
          {[
            { name: "Test model", img: "/images/settings-small-icon.svg" },
            { name: "Re-Train model", img: "/re-train.svg" },
            { name: "Resume model", img: "/re-train.svg" },
            { name: "Delete", img: "/images/delete-grey-icon.svg" },
          ]
            .filter((e, id) =>
              row.status === "Draft" ? [2, 3].includes(id) : [0, 1, 3].includes(id)
            )
            .filter((e) =>
              (!userAccess(user, "delete_model") && e.name === "Delete") ||
              (!userAccess(user, "test_model") && e.name === "Test model")
                ? false
                : true
            )
            .map((ele: any, id: any) => (
              <ListGroup.Item
                className="d-flex flex-row align-items-center cr-p p-0 popover-item"
                onClick={async () => document.body.click()}
                key={id}
              >
                {["Test model", "Re-Train model", "Resume model"].includes(ele.name) ? (
                  <Link
                    href={
                      redirectUrl +
                      (ele.name === "Test model"
                        ? `?evaluate#top`
                        : ele.name === "Resume model" ||
                          (ele.name === "Re-Train model" && isRole(user, "annotator"))
                        ? "?annotate#top"
                        : "")
                    }
                  >
                    <a className="d-flex py-2 px-3 w-100">
                      <img src={ele.img} alt="i" />
                      <p className="text-muted ps-2 mb-0">
                        {["Re-Train model", "Resume model"].includes(ele.name) &&
                        isRole(user, "annotator")
                          ? "Resume annotation"
                          : ele.name}
                      </p>
                    </a>
                  </Link>
                ) : (
                  <div className="d-flex py-2 px-3 w-100" onClick={() => setShowModal(true)}>
                    <img src={ele.img} alt="i" />
                    <p className="text-muted ps-2 mb-0">{ele.name}</p>
                  </div>
                )}
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Popover.Content>
    </Popover>
  );

  return (
    <>
      <OverlayTrigger rootClose trigger="click" placement="auto-end" overlay={popover} transition>
        <img src="images/ellipsis-icon.svg" style={{ cursor: "pointer" }} />
      </OverlayTrigger>
      <Modal
        onHide={() => setShowModal(false)}
        show={showModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header style={{ backgroundColor: "white" }}>
          <Modal.Title className="text-primary fw-bold font-inter">Confirm action</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0 mx-1">
          <div className="container">
            <div className="mb-4">
              <p className="font-inter">Are you sure? Do you want to delete model?</p>
            </div>
            <div className="d-flex">
              <button
                className="btn btn-primary font-inter"
                onClick={() => {
                  trainService.deleteModel(row.id).then((res) => {
                    toast.success("Deleted Successfully");
                    setShowModal(false);
                    setReload(!reload);
                  });
                }}
              >
                Yes
              </button>
              <button
                className="btn btn-sm ms-3 font-inter border-0"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default Menu;
