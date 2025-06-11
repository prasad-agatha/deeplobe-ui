import React, { FC, useState } from "react";

import SupportService from "services/support.services";
import UserService from "services/user.service";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
//Loader
import Loader from "react-loader-spinner";
// toasts
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
const userService = new UserService();
//toast configuration
toast.configure();

const supportService = new SupportService();

const support = (props) => {
  const { title } = props;
  const [requestInput, setRequestInput] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    company: "",
    role: "",
    industry: "",
    model: "",
    message: "",
    success: false,
  }) as any;

  const [fullNameValid, setFullNameValid] = useState(false);
  const [contactNumberValid, setContactNumberValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [companyValid, setCompanyValid] = useState(false);
  const [roleValid, setRoleValid] = useState(false);
  const [modelValid, setModelValid] = useState(false);
  const [messageValid, setMessageValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const contactSales = () => {
    setModelValid(false);
    setMessageValid(false);
    if (
      requestInput.model.length === 0 ||
      requestInput.model === "Select model" ||
      requestInput.message.length === 0
    ) {
      if (requestInput.model.length === 0 || requestInput.model === "Select model") {
        setModelValid(true);
      }
      if (requestInput.message.length === 0) {
        setMessageValid(true);
      }
    } else {
      setLoading(true);
      supportService
        .contactSales({
          name: requestInput.fullName,
          contact_number: requestInput.contactNumber,
          description: requestInput.message,
          hearing: requestInput.model,
          email: requestInput.email,
          role: requestInput.role,
          company: requestInput.company,
          title: title,
        })
        .then((res) => {
          setRequestInput({
            ...requestInput,
            success: true,
            model: "",
            message: "",
          });
        });
      setLoading(false);
    }
  };

  React.useEffect(() => {
    userService
      .getUserDetails()
      .then((res) => {
        setRequestInput({
          ...requestInput,
          fullName: res.username,
          contactNumber: res.contact_number,
          email: res.email,
          company: res.company,
          role: res.role,
          industry: res.industry,
        });
      })
      .catch((err) => {
        toast.error(err);
      });
  }, []);

  const onHandleTelephoneChange = (e) => {
    let telephone = e.target.value;
    const re = /^[0-9\b]+$/;
    // if (!Number(telephone)) {
    //   return;
    // }
    if (e.target.value === "" || re.test(e.target.value)) {
      setRequestInput({ ...requestInput, contactNumber: telephone.trim() });
    }
  };

  return (
    <>
      {/* <MainLayout> */}
      <div className="">
        <div className="pt-5">
          <h3 className=" mb-4 fw-bold font-inter">{title}</h3>
          {/* <p className="font-18 text-muted my-4 font-inter">
            Let us know how we can help and we'll be in touch with you shortly.
          </p> */}
          <div className="bg-white p-4 py-2 rounded">
            <div className="my-2 font-inter">
              <p className="font-16 my-2 p-0 font-inter mt-4">How can we help?</p>
              <select
                className="form-select font-inter w-75"
                id="inputGroupSelect03"
                style={{ backgroundColor: "#EDF2F7" }}
                value={requestInput.model}
                onChange={(e) => {
                  setRequestInput({ ...requestInput, model: e.target.value });
                }}
                required
              >
                <option value="" hidden>
                  Select model
                </option>
                <option value="Image classification">Image classification</option>
                <option value="Object detection">Object detection</option>
                <option value="Image similarity">Image similarity</option>
                <option value="Image segmentation">Image segmentation</option>
                <option value="OCR">OCR</option>
                <option value="Others">Others</option>
              </select>
              {modelValid ? (
                <small
                  className="d-inline px-2 my-2"
                  style={{
                    backgroundColor: "#FFE0E0",
                    color: "#CD0000",
                    borderRadius: "10px",
                    position: "absolute",
                    height: "10",
                  }}
                >
                  This field is required
                </small>
              ) : null}
            </div>
            <div className="mt-4">
              <p className="font-inter">Message</p>
              <textarea
                style={{ backgroundColor: "#EDF2F7" }}
                className="form-control w-75 font-inter"
                rows={5}
                name=""
                id=""
                value={requestInput.message}
                placeholder="Enter the details of your request"
                onChange={(e) => {
                  setRequestInput({ ...requestInput, message: e.target.value });
                }}
              />
              {messageValid ? (
                <small
                  className="d-inline px-2 my-2"
                  style={{
                    backgroundColor: "#FFE0E0",
                    color: "#CD0000",
                    borderRadius: "10px",
                    position: "absolute",
                    height: "10",
                  }}
                >
                  This field is required
                </small>
              ) : null}
            </div>

            <button className="btn btn-primary mt-4 font-inter" onClick={contactSales}>
              {loading && (
                <Spinner
                  animation="border"
                  className="me-2"
                  style={{ width: "1em", height: "1em" }}
                />
              )}
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
export default support;
