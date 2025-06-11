import React from "react";
import { Modal, Form } from "react-bootstrap";

function Labelling(props) {
  const { show, setShow, setActiveTab, reTrain, setType } = props;
  const [step, setStep] = React.useState("Annotate");
  const [typ, setTyp] = React.useState("append");

  return (
    <div>
      <Modal
        onHide={() => setShow(false)}
        keyboard={false}
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="" style={{ backgroundColor: "white" }}>
          <Modal.Title className="text-primary fw-bold font-inter">
            How do you want to proceed?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0 mx-3 my-2">
          <Form.Group controlId="formBasicCheckbox" className="mb-3">
            <Form.Check
              checked={step === "Annotate"}
              onChange={(e: any) => {
                if (e.target.checked) {
                  setStep("Annotate");
                } else {
                  setStep("Upload");
                }
              }}
              type="radio"
              label="Annotate data using annotation tool"
            />
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox1" className="my-3">
            <Form.Check
              checked={step === "Upload"}
              onChange={(e: any) => {
                if (e.target.checked) {
                  setStep("Upload");
                } else {
                  setStep("Annotate");
                }
              }}
              type="radio"
              label="Upload annotated data in COCO format"
            />
          </Form.Group>

          {reTrain && (
            <>
              {" "}
              <hr />
              <Form.Group controlId="formBasicCheckbox3" className="mb-3">
                <Form.Check
                  checked={typ === "append"}
                  onChange={(e: any) => {
                    if (e.target.checked) setTyp("append");
                    else setTyp("replace");
                  }}
                  type="radio"
                  label="Append to previous data"
                />
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox4" className="my-3">
                <Form.Check
                  checked={typ === "replace"}
                  onChange={(e: any) => {
                    if (e.target.checked) setTyp("replace");
                    else setTyp("append");
                  }}
                  type="radio"
                  label="Replace and continue with new data"
                />
              </Form.Group>
            </>
          )}

          <div className="d-flex">
            <button
              className="btn btn-primary btn-sm font-inter"
              onClick={() => {
                setShow(false);
                document.getElementById("test_scroll")?.scrollIntoView();
                setType(typ);
                if (step !== "Annotate") setActiveTab("Annotated_File");
              }}
            >
              Continue
            </button>
            <button className="btn  btn-sm ms-3 font-inter border-0" onClick={() => setShow(false)}>
              Cancel
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Labelling;
