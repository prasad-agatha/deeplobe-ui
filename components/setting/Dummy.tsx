import React, { useState } from "react";
//next
import Router from "next/router";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { Modal, Spinner } from "react-bootstrap";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import moment from "moment";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import PhoneInput from "react-phone-input-2";
import { ShimmerThumbnail, ShimmerCircularImage } from "react-shimmer-effects";

import "react-phone-input-2/lib/style.css";
import TickIcon from "public/TickIcon.svg";

// Services import
import UserService from "services/user.service";

const userService = new UserService();
//toast configuration
toast.configure();

// function isValidPostalCode(postalCode, countryCode) {
//   if (!postalCode || !countryCode) return true;
//   let postalCodeRegex;
//   switch (countryCode) {
//     case "United States":
//       postalCodeRegex = /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/;
//       break;
//     case "CA":
//       postalCodeRegex = /^([A-Z][0-9][A-Z])\s*([0-9][A-Z][0-9])$/;
//       break;
//     default:
//       postalCodeRegex = /^[1-9]{1}[0-9]{5}$/;
//   }

//   return postalCodeRegex.test(postalCode);
// }

const Dummy = ({ data, loginStatus, profileData, mutate, setShow }) => {
  const { handleChange, handleSubmit, setFieldValue, values, resetForm, touched, errors }: any =
    useFormik({
      initialValues: {
        full_name: profileData?.username ? profileData.username : "",
        contact_number:
          profileData?.contact_number && profileData?.contact_number !== "null"
            ? profileData.contact_number
            : "",
        email: profileData?.email ? profileData.email : "",
        company: profileData?.company && profileData?.company !== "null" ? profileData.company : "",
        role: profileData?.role ? profileData.role : "",
        country: profileData?.country ? profileData.country : "",
        address: profileData?.address ? profileData.address : "",
        state: profileData?.state ? profileData.state : "",
        industry: profileData?.industry ? profileData.industry : "",
        postal_code: profileData?.postal_code ? profileData.postal_code : "",
        GSTIN: profileData?.GSTIN ? profileData.GSTIN : "",
        avatar: profileData?.profile_pic ? profileData.profile_pic : "",
        isEditable: false,
        show: false,
      },
      // validationSchema: Yup.object({
      //   contact_number: Yup.string().matches(phoneRegExp, "Phone number is not valid"),
      // }),
      enableReinitialize: true,
      onSubmit: (values) => {
        console.log("here");
        // if (isValidPostalCode(values.postal_code, values.country)) {
        // setFieldValue("show", false);
        const formData = new FormData();
        formData.append("full_name", values.full_name);
        formData.append("role", values.role);
        formData.append("country", values.country);
        formData.append("state", values.state);
        formData.append("company", values.company);
        formData.append("contact_number", values.contact_number);
        formData.append("industry", values.industry);
        formData.append("postal_code", values.postal_code);
        formData.append("GSTIN", values.GSTIN);
        formData.append("address", values.address);
        typeof values.avatar !== "string" ? formData.append("profile_pic", values.avatar) : null;
        userService
          .updateUserDetails(formData)
          .then(() => {
            mutate();
            toast.success("Changes done successfully");
          })
          .catch((error) => {
            toast.error(error);
          })
          .finally(() => {
            setLoading(false);
            setFieldValue("show", false);
          });
        // } else {
        //   setFieldValue("show", false);
        //   toast.error("Invalid Postal ZIP Code");
        // }
      },
    });

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const hiddenFileInput = React.useRef(null);

  const handleEdit = () => {
    setFieldValue("isEditable", true);
  };
  const roles = [
    "Customer service manager",
    "CXO/General manager",
    "Data scientist",
    "Developer/Software engineer/Analyst",
    "IT manager",
    "Marketing/PR manager",
    "Operations manager",
    "Sales manager",
    "Student/Personal interest",
    "Others",
  ];

  const industry = [
    "Information Technology",
    "Pharma",
    "Education",
    "Healthcare",
    "Retail",
    "Manufacturing",
    "Gaming",
    "Others",
  ];
  const handleImageClick = () => {
    if (values.isEditable) hiddenFileInput.current.click();
  };

  const handleImageChange = (event) => {
    if (event.target.files.length > 0) setFieldValue("avatar", event.target.files[0]);
  };

  const handleSave = () => {
    setFieldValue("show", true);
  };

  const handleClose = () => {
    setFieldValue("show", false);
  };

  const handleCancel = () => {
    setFieldValue("show", false);
    resetForm();
    setFieldValue("isEditable", false);
  };

  const handleMobile = (tel) => {
    setFieldValue("contact_number", tel);
  };

  const handleSubmission = () => {
    if (loading) return;
    setLoading(true);
    handleSubmit();
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await userService.createPortal({});
      window.location.assign(res?.url);

      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error(e?.message ? e.message : e);
    }
  };
  // Html designed code goes here
  return (
    <>
      {!values.email || !data ? (
        <div className="">
          <div className="bg-white p-4 rounded">
            <div className="d-flex justify-content-between p-1">
              <div>
                <ShimmerThumbnail height={30} width={50} rounded />
                <ShimmerCircularImage size={70} />
              </div>
              <div>
                <ShimmerThumbnail height={30} width={50} rounded />
              </div>
            </div>
            <hr className="my-4" />
            <ShimmerThumbnail height={30} width={50} rounded />
            <div className="row">
              {[...Array(2)].map((e: any, idx: any) => (
                <div className="col-md-6" key={idx}>
                  {[...Array(idx === 0 ? 6 : 5)].map((e: any, id: any) => (
                    <div key={id}>
                      <ShimmerThumbnail
                        height={20}
                        width={50}
                        className={"mb-0 " + (id === 0 ? "mt-2" : "")}
                        rounded
                      />
                      <ShimmerThumbnail height={34} rounded />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <hr className="border-line" />
            <div className="row card-container-bg p-3 mx-auto my-4">
              {[...Array(3)].map((e: any, id: any) => (
                <div key={id}>
                  {id === 1 ? (
                    <div className="vr col-md-2 m-auto border-line vertical-rule d-none d-md-inline">
                      <hr style={{ height: "100px" }} />
                    </div>
                  ) : (
                    <div className="col-md-5 d-flex flex-column">
                      <ShimmerThumbnail height={30} width={75} rounded />
                      <ShimmerThumbnail height={30} className="mb-2" rounded />
                      <ShimmerThumbnail height={30} className="mb-2" rounded />
                      <div className="mt-auto">
                        <ShimmerThumbnail height={30} width={75} className="mb-0" rounded />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <hr className="border-line-dark" />
            <div className="d-flex justify-content-between align-items-center content flex-wrap pt-2">
              <ShimmerThumbnail height={30} width={100} className="mb-0" rounded />
              <ShimmerThumbnail height={30} width={100} className="mb-0" rounded />
            </div>
            <ShimmerThumbnail height={20} className="mb-0 w-75" rounded />

            <hr className="border-line" />
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className="">
              <div className="bg-white p-4 rounded">
                <div className="d-flex justify-content-between p-1">
                  <div>
                    <h4 className="font-weight-600 txt-header font-22 mb-3">Avatar</h4>

                    <img
                      src={
                        values.avatar
                          ? typeof values.avatar === "string"
                            ? values.avatar
                            : URL.createObjectURL(values.avatar)
                          : "/images/newAvatar.svg"
                      }
                      alt="User-picture"
                      style={{ width: 70, height: 70 }}
                      className="rounded-circle"
                    />
                    <div className="overlay">
                      <img
                        onClick={handleImageClick}
                        src="/images/edit-icon-blue.svg"
                        alt="delete-icon"
                        style={{
                          marginTop: "-60px",
                          color: "#6152D9",
                          marginLeft: "54px",
                          cursor: "pointer",
                        }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        ref={hiddenFileInput}
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                  <div>
                    {!values.isEditable ? (
                      <button
                        className="btn btn-primary px-4 font-inter"
                        type="button"
                        onClick={handleEdit}
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary px-4 font-inter"
                        type="button"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
                <hr className="my-4" />
                <h4 className="font-18 font-inter">Profile</h4>
                <div className="row">
                  <div className="col-md-6">
                    <p className="font-16 my-2 p-0 font-inter">Full name</p>
                    <input
                      type="text"
                      name="full_name"
                      id=""
                      className="dis form-control font-inter image-placeholder mb-4"
                      value={values.full_name}
                      placeholder="Full Name"
                      onChange={handleChange}
                      disabled={!values.isEditable}
                    />

                    <p className="font-16 my-2 p-0 font-inter">Email id</p>
                    <input
                      type="text"
                      name="email"
                      id=""
                      className="dis form-control font-inter image-placeholder mb-4"
                      style={{ backgroundColor: "#F1F1F1" }}
                      value={values.email}
                      onChange={handleChange}
                      disabled={!values.isEditable}
                      readOnly
                    />
                    <p className="font-16 my-2 p-0 font-inter">Role</p>
                    <select
                      className="dis form-select font-inter mb-4"
                      id="inputGroupSelect02"
                      value={values.role}
                      onChange={handleChange}
                      disabled={!values.isEditable}
                      required
                      name="role"
                    >
                      <option value="" className="text-muted" disabled hidden>
                        Select your role
                      </option>
                      {roles.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    <p className="font-16 my-2 p-0 font-inter">Address</p>
                    <input
                      type="text"
                      name="address"
                      id=""
                      className="dis form-control font-inter image-placeholder mb-4"
                      value={values.address}
                      placeholder="Enter Address"
                      onChange={handleChange}
                      disabled={!values.isEditable}
                    />
                    <p className="font-16 my-2 p-0 font-inter ">Country</p>

                    <CountryDropdown
                      classes="font-inter form-select image-placeholder mb-4"
                      defaultOptionLabel="Select country"
                      valueType="short"
                      value={values.country}
                      onChange={(event: any) => {
                        // console.log(event);
                        setFieldValue("state", "");
                        setFieldValue("country", event);
                      }}
                      disabled={!values.isEditable}
                    />

                    <p className="font-16 my-2 p-0 font-inter ">GSTIN or VAT</p>
                    <input
                      type="text"
                      name="GSTIN"
                      id=""
                      className="dis form-control font-inter image-placeholder mb-4"
                      placeholder="Enter here"
                      value={values.GSTIN}
                      onChange={handleChange}
                      disabled={!values.isEditable}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="font-16 mt-2 p-0 font-inter my-2">Contact</label>
                    <PhoneInput
                      country={"us"}
                      inputClass="form-control font-inter image-placeholder mb-4"
                      inputStyle={{
                        backgroundColor: !values.isEditable ? "#f2f2f2" : "",
                        width: "100%",
                      }}
                      value={values.contact_number}
                      onChange={handleMobile}
                      disabled={!values.isEditable}
                      placeholder="Enter your mobile number"
                    />

                    <p className="text-danger">{errors?.contact_number || ""}</p>

                    <p className="font-16 my-2 p-0 font-inter mt-4">Company name</p>
                    <input
                      type="text"
                      name="company"
                      id=""
                      className="dis form-control font-inter image-placeholder mb-4"
                      style={{ marginTop: "10px" }}
                      value={values.company}
                      onChange={handleChange}
                      placeholder="Your company name"
                      disabled={!values.isEditable}
                    />

                    <p className="font-16 my-2 p-0 font-inter ">Industry</p>
                    <select
                      className="dis form-select font-inter image-placeholder mb-4"
                      id="inputGroupSelect03"
                      name="industry"
                      onChange={handleChange}
                      required
                      placeholder="Select your Industry"
                      disabled={!values.isEditable}
                      value={values.industry}
                    >
                      <option value="" className="text-muted" disabled hidden>
                        Select your industry
                      </option>
                      {industry.map((item, index) => {
                        return (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        );
                      })}
                    </select>

                    <p className="font-16 my-2 p-0 font-inter">Postal ZIP Code</p>
                    <input
                      type="number"
                      name="postal_code"
                      id=""
                      className="dis form-control font-inter image-placeholder mb-4"
                      placeholder="Enter Postal Code"
                      value={values.postal_code}
                      onChange={(e) => {
                        // if (Number(e.target.value) > 0)
                        setFieldValue("postal_code", e.target.value);
                      }}
                      disabled={!values.isEditable}
                    />

                    <p className="font-16 my-2 p-0 font-inter ">State</p>

                    <RegionDropdown
                      classes="font-inter form-select image-placeholder mb-4"
                      blankOptionLabel="Select State"
                      defaultOptionLabel="Select State"
                      country={values.country}
                      countryValueType="short"
                      valueType="short"
                      value={values.state}
                      onChange={(event: any) => {
                        setFieldValue("state", event);
                      }}
                      disabled={!values.isEditable}
                    />
                  </div>
                </div>
                <hr className="border-line" />
                <div className="row card-container-bg p-3 mx-auto my-4">
                  <div className="col-md-5 d-flex flex-column">
                    <h1 className="plan-h mb-0">{data?.plan?.split("-")[0]} plan</h1>
                    <span className="for-start mt-1">
                      Billed {data?.plan.split(" ")?.[1]} {data?.plan.split(" ")?.[2]}
                    </span>

                    <div className="mt-3">
                      <span className="sub-text-end">
                        {data["api-requests"] - data?.api_calls}/{data["api-requests"]} per month
                        Predictions left
                      </span>
                      <ProgressBar
                        variant="progress"
                        now={Number(((data?.api_calls / data["api-requests"]) * 100).toFixed(1))}
                      />
                    </div>
                    {data?.plan !== process.env.NEXT_PUBLIC_FREE_PLAN && (
                      <>
                        <p className="font-inter font-weight-400 sub-payment font-14 ">
                          Next payment due on {moment(data?.to_date).format("MMMM Do, YYYY")}
                        </p>{" "}
                        <div className="mt-auto">
                          <button
                            className="btn btn-outline-primary"
                            type="button"
                            onClick={handleCheckout}
                          >
                            {loading && (
                              <Spinner
                                animation="border"
                                className="me-2"
                                style={{ width: "1em", height: "1em" }}
                              />
                            )}
                            Renew
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="vr col-md-2 m-auto border-line vertical-rule d-none d-md-inline">
                    <hr style={{ height: "100px" }} />
                  </div>

                  <div className="col-md-5 pt-3 pt-md-0 ps-md-3 mx-auto d-flex flex-column">
                    <h1 className="plan-h ">
                      Upgrade to{" "}
                      {data?.plan === process.env.NEXT_PUBLIC_FREE_PLAN ? "Growth" : "Enterprise"}{" "}
                      Plan
                    </h1>
                    <div className="d-flex justify-content-between py-4">
                      <div className="d-flex flex-column justify-content-between">
                        <div className="d-flex align-items-center">
                          <span style={{ minWidth: "15px", minHeight: "15px" }}>
                            <Image alt="tick-icon" src={TickIcon} className="w-100" />
                          </span>
                          <span className="ps-2">
                            {data?.plan === process.env.NEXT_PUBLIC_FREE_PLAN ? 3 : "Unlimited"}{" "}
                            Users
                          </span>
                        </div>
                        <div className="d-flex  align-items-center pt-2">
                          <span style={{ minWidth: "15px", minHeight: "15px" }}>
                            <Image alt="tick-icon" src={TickIcon} className="w-100" />
                          </span>
                          <span className="ps-2">All Custom Models</span>
                        </div>
                      </div>
                      <div className="d-flex flex-column justify-content-between ">
                        <div className="d-flex align-items-center">
                          <span style={{ minWidth: "15px", minHeight: "15px" }}>
                            <Image alt="tick-icon" src={TickIcon} className="w-100" />
                          </span>
                          <span className="ps-2">
                            {data?.plan === process.env.NEXT_PUBLIC_FREE_PLAN ? "1TB" : "Unlimited"}{" "}
                            Storage
                          </span>
                        </div>
                        <div className="d-flex  align-items-center pt-2">
                          <span style={{ minWidth: "15px", minHeight: "15px" }}>
                            <Image alt="tick-icon" src={TickIcon} className="w-100" />
                          </span>
                          <span className="ps-2">All Pre-trained Models</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <Link
                        href={`/settings?tab=subscription&goToPlan=${
                          data?.plan === process.env.NEXT_PUBLIC_FREE_PLAN ? "Growth" : "Enterprise"
                        }`}
                      >
                        <a>
                          <button type="button" className="btn btn-primary px-4">
                            Upgrade
                          </button>
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
                <hr className="border-line-dark" />
                <div className="d-flex justify-content-between align-items-center content flex-wrap">
                  <div className="pt-2">
                    <h4 className="plan-h">Delete Account</h4>
                    <p className="for-start">
                      By deleting your account, you will loose all your data.
                    </p>
                  </div>

                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={() => setShowModal(true)}
                  >
                    Delete
                  </button>
                </div>
                <hr className="border-line" />
              </div>
            </div>
            <Modal
              onHide={() => setShowModal(false)}
              keyboard={false}
              show={showModal}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header style={{ backgroundColor: "white" }}>
                <Modal.Title className="ps-0 text-primary fw-bold font-inter">
                  Delete Account
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="pt-0 mx-2">
                <p className="for-start mb-3">
                  Are you sure you want to delete your account? By deleting your account, you will
                  loose all your data.
                </p>
                <div className="d-flex mt-4">
                  <button
                    className="btn btn-primary btn-sm font-inter"
                    onClick={async () => {
                      try {
                        setLoading(true);
                        await userService.deleteUser();
                        window.location.reload();
                        setLoading(false);
                        toast.success("Account deleted successfully");
                      } catch (e) {
                        setLoading(false);
                        toast.error(e);
                      }
                    }}
                  >
                    {loading && (
                      <Spinner
                        animation="border"
                        className="me-2"
                        style={{ width: "1em", height: "1em" }}
                      />
                    )}
                    Delete
                  </button>
                  <button
                    className="btn border-0 btn-sm ms-3 font-inter"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Modal.Body>
            </Modal>
            <Modal
              onHide={handleClose}
              show={values.show}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Body>
                <div className="container">
                  <div className="my-2">
                    <h4 className="font-20 font-inter">Confirm action</h4>
                  </div>
                  <hr />
                  <div className="mb-4">
                    <p className="font-inter">Do you want to save the changes?</p>
                  </div>
                  <div className="d-flex">
                    <button
                      className="btn btn-primary btn-sm font-inter"
                      type="submit"
                      onClick={handleSubmission}
                    >
                      {loading && (
                        <Spinner
                          animation="border"
                          className="me-2"
                          style={{ width: "1em", height: "1em" }}
                        />
                      )}
                      Yes
                    </button>
                    <button
                      className="btn btn-sm ms-3 border-0"
                      onClick={handleCancel}
                      type="button"
                    >
                      No
                    </button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </form>
        </>
      )}
    </>
  );
};
export default Dummy;
