// **************** Internal ************************

// React internal imports
import React, { FC, useState } from "react";
// Deeplobe layout import
import MainLayout from "layouts/MainLayout";
// Services import
import SupportService from "services/support.services";
//Loader
import Loader from "react-loader-spinner";
// toasts
import { toast } from "react-toastify";

const supportService = new SupportService();
//toast configuration
toast.configure();

const support: FC = () => {
  const [subjectValid, setSubjectValid] = useState(false);
  const [descValid, setDescValid] = useState(false);

  const [requestInput, setRequestInput] = useState({
    subject: "",
    description: "",
    attachedFile: null,
    success: false,
  });
  const raiseSupportRequest = () => {
    setSubjectValid(false);
    setDescValid(false);
    if (
      requestInput.subject.length === 0 ||
      requestInput.description.length === 0
      // ||
      // requestInput.attachedFile === null
    ) {
      // toast.error("Please fill Subject and Description fields");
      if (requestInput.subject.length === 0) {
        setSubjectValid(true);
      }
      if (requestInput.description.length === 0) {
        setDescValid(true);
      }
    } else {
      const formData = new FormData();
      formData.append("subject[]", requestInput.subject);
      formData.append("description[]", requestInput.description);
      formData.append("file[]", requestInput.attachedFile);
      supportService.raiseSupportRequest(formData).then((res) => {
        setRequestInput({
          ...requestInput,
          success: true,
          subject: "",
          description: "",
          attachedFile: null,
        });
      });
    }
  };
  // Html designed code goes here
  return (
    <>
      <MainLayout>
        <div className="mainc container">
          <h3 className=" mb-4 fw-bold ">Support request</h3>
          <p className="font-16 text-muted my-4 font-inter">
            Submit request and we’ll be in touch with you shortly
          </p>
          <div className="bg-white p-4 rounded">
            <div className="my-3 font-inter">
              <p>Subject</p>
              <input
                type="text"
                name=""
                id=""
                value={requestInput.subject}
                className="form-control w-50 font-inter"
                style={{ backgroundColor: "#EDF2F7" }}
                // placeholder="Your request subject for which you are going to raise the ticket"
                onChange={(e) => {
                  setRequestInput({ ...requestInput, subject: e.target.value });
                }}
              />
              {subjectValid ? (
                <small
                  className="d-inline px-2 my-2"
                  style={{
                    backgroundColor: "#FFE0E0",
                    color: "#CD0000",
                    borderRadius: "10px",
                    position: "absolute",
                    height: "10",
                    // margin: "0",
                  }}
                >
                  This field is required
                </small>
              ) : null}
            </div>
            <div className="mt-4">
              <p className="font-inter">Description</p>
              <textarea
                style={{ backgroundColor: "#EDF2F7" }}
                className="form-control w-50 font-inter"
                rows={5}
                name=""
                id=""
                value={requestInput.description}
                // placeholder="Enter the details of your request."
                onChange={(e) => {
                  setRequestInput({ ...requestInput, description: e.target.value });
                }}
              />
              {descValid ? (
                <small
                  className="d-inline px-2 my-2"
                  style={{
                    backgroundColor: "#FFE0E0",
                    color: "#CD0000",
                    borderRadius: "10px",
                    position: "absolute",
                    height: "10",
                    // margin: "0",
                  }}
                >
                  This field is required
                </small>
              ) : null}
            </div>
            <div
              className="d-flex mt-3"
              onClick={() => {
                document.getElementById("selectImage").click();
              }}
              style={{ cursor: "pointer" }}
            >
              <img src="images/attach-icon.svg" alt="attach-icon" className="me-2" />
              <p className="p-0 m-0 mt-2 font-inter">Attach files</p>
              <input
                type="file"
                id="selectImage"
                hidden
                onChange={(e) => {
                  setRequestInput({ ...requestInput, attachedFile: e.target.files[0] });
                }}
              />
              {requestInput.attachedFile !== null ? (
                <p className="p-0 m-0 ms-2">{requestInput.attachedFile.name}</p>
              ) : null}
            </div>
            <button className="btn btn-primary mt-3 font-inter" onClick={raiseSupportRequest}>
              Submit
            </button>
          </div>
          {requestInput.success ? (
            <div className="w-50 mt-4">
              <h4 className="font-inter">Thank you!</h4>
              <p className="font-inter">
                We have received your request. Someone from our team will contact you soon.
              </p>
            </div>
          ) : null}
        </div>
      </MainLayout>
    </>
  );
};
export default support;
