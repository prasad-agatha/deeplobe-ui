import React, { FC, useState } from "react";
import MainLayout from "layouts/MainLayout";
import SupportService from "services/support.services";
//Loader
import Loader from "react-loader-spinner";
// toasts
import { toast } from "react-toastify";

const supportService = new SupportService();
//toast configuration
toast.configure();

const supportForm = () => {
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
    if (requestInput.subject.length === 0 || requestInput.description.length === 0) {
      if (requestInput.subject.length === 0) {
        setSubjectValid(true);
      }
      if (requestInput.description.length === 0) {
        setDescValid(true);
      }
    } else {
      const formData = new FormData();
      formData.append("subject", requestInput.subject);
      formData.append("description", requestInput.description);
      requestInput.attachedFile !== null
        ? formData.append("file", requestInput.attachedFile)
        : null;
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
  return (
    <>
      {/* <MainLayout> */}
      <div className="">
        <div className="pt-5">
          <h3 className=" mb-4 fw-bold font-inter">Support request</h3>
          <div className="bg-white p-4 rounded">
            <div className="my-3 font-inter">
              <p>Subject</p>
              <input
                type="text"
                name=""
                id=""
                value={requestInput.subject}
                className="form-control w-75 font-inter"
                style={{ backgroundColor: "#EDF2F7" }}
                placeholder="Enter the subject of your request"
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
                className="form-control w-75 font-inter"
                rows={5}
                name=""
                id=""
                value={requestInput.description}
                placeholder="Enter the details of your request"
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
                  if (e.target.files.length > 0)
                    setRequestInput({ ...requestInput, attachedFile: e.target.files[0] });
                }}
              />
              <br />
              {requestInput.attachedFile !== null ? (
                <p className="p-0 m-0 ms-2 mt-2 font-inter fw-bold">
                  {requestInput.attachedFile.name}
                </p>
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
      </div>
      {/* </MainLayout> */}
    </>
  );
};
export default supportForm;
