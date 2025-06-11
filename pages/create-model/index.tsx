import React, { FC, useState } from "react";
import Router from "next/router";
import Link from "next/link";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

import { createModelCards } from "common_functions/common_cards";
import MainLayout from "layouts/MainLayout";
import CustomModelService from "services/custom-model.service";
import { isRole, userAccess } from "common_functions/functions";

const customModelService = new CustomModelService();

const CreateModel: FC = ({ user }: any) => {
  const [show, setShow] = useState(false);
  const [selectedModel, setSelectedModel] = useState({} as any);
  const [modelName, setModelName] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const createModel = async () => {
    if (!loading) {
      let model_type = selectedModel.path.replace("create-model/", "");
      model_type = model_type
        .replace("similarity", "image_similarity")
        .replace("object-detection", "object_detection");
      const payload = { name: modelName, description, model_type };
      setLoading(true);
      try {
        const res = await customModelService.createModel(payload);
        setLoading(false);
        Router.push(`/${selectedModel.path}/${res.uuid}#new`);
      } catch (e: any) {
        toast.error(e?.msg ? e.msg : JSON.stringify(e));
        setLoading(false);
      }
    }
  };

  const getAccess = (item: any) => {
    return user?.model_permissions[0][item.permission] && userAccess(user, "create_model");
  };

  const toolTip = (item: any, children: any) => {
    return !getAccess(item) ? (
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="button-tooltip">You dont have access to {item.name}</Tooltip>}
      >
        {children}
      </OverlayTrigger>
    ) : (
      // <Link href="/pre-trained-models">{children}</Link>
      <>{children}</>
    );
  };

  React.useEffect(() => {
    if (user) {
      if (!user?.current_workspace_details["custom-models"]) {
        setShowModal(true);
      } else setShowModal(false);
    }
  }, [user]);

  const cards = (
    <div className="pt-5">
      <h3 className="mb-4 pre-model-header">Custom model</h3>
      <div className="card-deck row gx-2">
        {createModelCards.map((item, index) => {
          return (
            <div className="col-md-4 mb-3" key={index}>
              <div className="card border-0 mx-2 mb-3 bg-white h-100">
                <img
                  src={
                    process.env.NEXT_PUBLIC_CLIENT === "Intellect INFER"
                      ? item.infer_icon
                      : item.infer_icon
                  }
                  className="p-2 m-2 py-0"
                />

                <div className="bg-white px-3 text-center p-0 card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text mb-0">{item.text}</p>
                </div>

                <div className="p-2 pb-3 card-footer border-0 bg-white text-center">
                  {getAccess(item) ? (
                    <button
                      className=" fw-bold model-btn"
                      onClick={() => {
                        setShow(true);
                        setSelectedModel(item);
                      }}
                      style={{ borderRadius: "6px" }}
                    >
                      Create now
                    </button>
                  ) : (
                    <>
                      {" "}
                      {toolTip(
                        item,
                        <button className=" fw-bold btn" style={{ borderRadius: "6px" }}>
                          Create now
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div className="col-md-4 d-flex">
          <div className="card border-0 mx-2 mb-3 bg-white text-center">
            <div className="bg-white h-100 p-3  card-body  d-flex flex-column align-items-center bg-primary justify-content-center">
              <h5 className="mt-5 card-title fw-bold">Looking for a custom model?</h5>
              <p className="card-text">
                We can help you with a custom model for your specific use case.
              </p>
            </div>

            <div
              className="p-3  mt-auto mx-auto card-footer border-0 bg-white text-center"
              // style={{ height: "200px" }}
            >
              <Link href={`/contact-us/?name=custom-model`}>
                <a>
                  <button className="model-btn fw-bold" style={{ borderRadius: "6px" }}>
                    Contact now
                  </button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const restrictModel = (
    <div className="restict-block p-5 pb-4 w-100" style={{ height: "calc(100% - 20px)" }}>
      <div className="card p-5 w-100" style={{ maxWidth: "576px" }}>
        <div className="d-flex justify-content-center">
          <img src="lock.svg" alt="lock-icon" />
        </div>
        <div>
          <p className="font-24 font-weight-600 lh-36 my-3 text-center">
            You are now on Free Plan!
          </p>
          <p className="font-14 font-weight-400 lh-22  my-3 text-center txt-b">
            Custom models are only available for Growth plan
            <br /> customers. Upgrade now to access to all premium
            <br /> features and as well as priority support.
          </p>
          <div className="d-flex flex-column mt-4">
            <button
              className="btn btn-primary btn-sm m-auto py-2 px-3"
              onClick={() => {
                setLoading(true);
                Router.push("/settings?tab=subscription&goToPlan=Growth");
              }}
            >
              {loading && (
                <Spinner
                  animation="border"
                  className="me-2"
                  style={{ width: "1em", height: "1em" }}
                />
              )}
              Upgrade to Growth Plan
            </button>
            <p
              className="nav-text-blue bold text-center my-2 cursor-pointer"
              onClick={() => window.open("https://deeplobe.ai/pricing", "_blank")}
            >
              Learn more about premium features
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MainLayout>
        {showModal ? (
          <div className="container h-100" style={{ overflow: "hidden" }}>
            <div
              className="restict-block p-5 pb-4 w-100 bg-black"
              style={{ height: "100%", opacity: "0.5" }}
            ></div>
            {restrictModel}
            {cards}
          </div>
        ) : (
          <div className="container">{cards}</div>
        )}

        <Modal
          onHide={() => {
            setShow(false);
            setSelectedModel({});
            setModelName("");
          }}
          show={show}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          animation={false}
          centered
        >
          {" "}
          <Modal.Header style={{ backgroundColor: "white" }}>
            <Modal.Title className="text-primary fw-bold">{selectedModel.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-0 mx-2">
            <div className="d-flex flex-column align-items-start justify-content-start p-2">
              <div className="mb-4 w-100">
                <h6 className="fw-bold">Model name</h6>
                <Form.Control
                  type="text"
                  id="model"
                  className="form-control w-100"
                  onChange={(e) => {
                    setModelName(e.target.value);
                  }}
                  autoFocus
                />
                <h6 className="fw-bold mt-2">Description</h6>
                <textarea
                  rows={2}
                  className="form-control w-100"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </div>
              <div className="d-flex">
                <button
                  className="btn btn-lg btn-primary  p-2"
                  onClick={createModel}
                  disabled={!modelName}
                  style={{ fontSize: "1em", width: "100%", borderRadius: "5px" }}
                >
                  {loading && (
                    <Spinner
                      animation="border"
                      className="me-2"
                      style={{ width: "1em", height: "1em" }}
                    />
                  )}
                  {` Create now`}
                </button>
                <button
                  className="btn  btn-sm ms-3 border-0"
                  onClick={() => {
                    setShow(false);
                    setSelectedModel({});
                    setModelName("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* <Modal
          keyboard={false}
          show={showModal}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          backdrop="static"
          centered
          className="restrict"
        >
          <Modal.Body>
            <div>
              <div className="d-flex justify-content-center">
                <img src="lock.svg" alt="lock-icon" />
              </div>
              <div>
                <p className="font-24 font-weight-600 my-3 text-center">
                  You are now on Free Plan!
                </p>
                <p className="font-14 font-weight-400 my-3 text-center txt-b">
                  Custom models are only available for Growth plan
                  <br /> customers. Upgrade now to access to all premium
                  <br /> features and as well as priority support.
                </p>
                <div className="d-flex flex-column mt-4">
                  <button
                    className="btn btn-primary btn-sm m-auto py-2 px-3"
                    onClick={() => {
                      Router.push("/settings?tab=subscription");
                    }}
                  >
                    Upgrade to Growth Plan
                  </button>
                  <p
                    className="nav-text-blue bold text-center my-2 cursor-pointer"
                    onClick={() => window.open("https://deeplobe.ai/pricing", "_blank")}
                  >
                    Learn more about premium features
                  </p>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal> */}
      </MainLayout>
    </>
  );
};
export default CreateModel;
