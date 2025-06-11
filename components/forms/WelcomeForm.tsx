import React, { useEffect, useState } from "react";
import Router from "next/router";
import { Form, Container, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-toastify";

import UserService from "services/user.service";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import MultiSelectDropdown from "@components/page_elements/multiSelectDropdown";

const userService = new UserService();
const models = [
  {
    label: "Object detection",
    value: "OBJECT_DETECTION",
  },
  {
    label: "Semantic segmentation",
    value: "SEMANTIC_SEGMENTATION",
  },
  {
    label: "Instance segmentation",
    value: "INSTANCE_SEGMENTATION",
  },
  {
    label: "OCR",
    value: "OCR",
  },
  {
    label: "Image similarity",
    value: "IMAGE_SIMILARITY",
  },
  {
    label: "Image classification",
    value: "IMAGE_CLASSIFICATION",
  },

  {
    label: "PII data extractor",
    value: "PRE_PII_DATA_EXTRACTOR",
  },
  {
    label: "Auto-table extractor",
    value: "PRE_TABLE_EXTRACTOR",
  },
  {
    label: "Sentiment analysis model",
    value: "PRE_SENTIMENT_ANALYSIS",
  },
  {
    label: "Facial detection model",
    value: "PRE_FACIAL_DETECTION",
  },
  {
    label: "Demographic recognition model",
    value: "PRE_DEMOGRAPHIC_RECOGNITION",
  },
  {
    label: "Facial expression recognition",
    value: "PRE_FACIAL_EXPRESSION_RECOGNITION",
  },
  {
    label: "Pose detection model",
    value: "PRE_POSE_DETECTION",
  },
  {
    label: "Text moderation model",
    value: "PRE_TEXT_MODERATION",
  },
  {
    label: "People and vehicle detection",
    value: "PRE_PEOPLE_AND_VEHICLE_DETECTION",
  },
  {
    label: "Wound detection",
    value: "PRE_WOUND_DETECTION",
  },

  {
    label: "Others",
    value: "OTHERS",
  },
];

function WelcomeForm({ user }) {
  console.log(user);
  const options = () =>
    models.map((e, id) => {
      return {
        id: id,
        label: (
          <div className="w-100">
            <div className="w-100 flex-between flex-nowrap">
              <h6 className="text-truncate w-100 font-14 m-0">{e.label}</h6>
            </div>
          </div>
        ),
        value: e.value,
      };
    });
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { handleChange, handleSubmit, setFieldValue, values }: any = useFormik({
    initialValues: {
      full_name: user?.username || "",
      company: "",
      company_size: user?.company_size || "",
      country: user?.country ? user.country : "IN",
      state: user?.state ? user.state : "TG",
      role: user?.role || "",
      email: user?.bussiness_email || "",
      interestedIn: user?.intrestedIn || "",
      isEditable: false,
      industry: user?.industry || "",
    },
    enableReinitialize: true,

    onSubmit: (values) => {
      if (values.interestedIn.length === 0 || !values.country || !values.state)
        toast.error("Please fill mandatory fields");
      else {
        values.interestedIn = values.interestedIn
          .map((ele) => {
            if (ele.value !== "*") {
              return ele.value;
            }
          })
          .filter((notUndefined) => notUndefined !== undefined);
        const payload = {
          username: values.full_name,
          company: values.company,
          country: values.country,
          state: values.state,
          company_size: values.company_size,
          industry: values.industry,
          role: values.role,
          bussiness_email: values.email,
          interestedIn: values.interestedIn,
          is_new: false,
        };
        console.log("elseeee kln", values.interestedIn.length, values.interestedIn);
        userService
          .updateUserDetails(payload)
          .then(() => {
            console.log(payload, "payload kln");
            Router.push("/dashboard");
          })
          .catch((error) => {
            toast.error(error);
          });
      }
    },
  });

  return (
    <>
      <Container>
        <div className="d-flex flex-column mr-3 h-100 align-items-start justify-content-center signin-form">
          <h2>
            Welcome to{" "}
            {process.env.NEXT_PUBLIC_CLIENT === "Intellect INFER" ? "Intellect² INFER" : "Deeplobe"}
            !
          </h2>
          <small className="text-muted my-2">Please tell us a little more about you.</small>
          <form onSubmit={handleSubmit} style={{ maxWidth: "435px" }}>
            <div className="">
              <Form.Group className="w-100">
                <small className="font-inter fw-bold" style={{ fontSize: "15px" }}>
                  What do you want us to call you?
                </small>
                <Form.Control
                  name="full_name"
                  placeholder="First name and Last name"
                  className="border-0 w-100"
                  style={{ backgroundColor: "#EDF2F7", height: "40px", borderRadius: "5px" }}
                  value={values.full_name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="w-100 my-3">
                <small className="font-inter fw-bold" style={{ fontSize: "15px" }}>
                  What is your organisation name?
                </small>
                <Form.Control
                  name="company"
                  placeholder="Enter name"
                  className="border-0 w-100"
                  style={{ backgroundColor: "#EDF2F7", height: "40px", borderRadius: "5px" }}
                  value={values.company}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="w-100 my-3">
                <small className="font-inter fw-bold" style={{ fontSize: "15px" }}>
                  What is your role?
                </small>
                <select
                  className="border-0 w-100 font-inter text-muted"
                  name="role"
                  id="inputGroupSelect02"
                  style={{
                    backgroundColor: "#EDF2F7",
                    height: "40px",
                    borderRadius: "5px",
                    textIndent: "5px",
                  }}
                  value={values.role}
                  onChange={handleChange}
                >
                  <option value="" className="text-muted" disabled selected hidden>
                    Select your role
                  </option>
                  <option value="Customer service manager">Customer service manager</option>
                  <option value="CXO/General manager">CXO/General manager</option>
                  <option value="Data scientist">Data scientist</option>
                  <option value="Developer/Software engineer/Analyst">
                    Developer/Software engineer/Analyst
                  </option>
                  <option value="IT manager">IT manager</option>
                  <option value="Marketing/PR manager">Marketing/PR manager</option>
                  <option value="Operations manager">Operations manager</option>
                  <option value="Sales manager">Sales manager</option>
                  <option value="Student/Personal interest">Student/Personal interest</option>
                  <option value="Others">Others</option>
                </select>
              </Form.Group>

              <Form.Group className="w-100 my-3">
                <small className="font-inter fw-bold" style={{ fontSize: "15px" }}>
                  What is your location? <span className="text-danger">*</span>
                </small>
                <div className="d-flex gap-3">
                  <CountryDropdown
                    classes="form-select country-select"
                    defaultOptionLabel="Select country"
                    valueType="short"
                    value={values.country}
                    onChange={(event: any) => setFieldValue("country", event)}
                  />
                  <RegionDropdown
                    classes="form-select country-select"
                    blankOptionLabel="Select State"
                    defaultOptionLabel="Select State"
                    country={values.country}
                    countryValueType="short"
                    valueType="short"
                    value={values.state}
                    onChange={(event: any) => setFieldValue("state", event)}
                  />
                </div>
              </Form.Group>

              <Form.Group className="w-100 my-3">
                <small className="font-inter fw-bold" style={{ fontSize: "15px" }}>
                  Industry and Company size?
                </small>
                <div className="d-flex gap-3">
                  <select
                    className="border-0 w-100 font-inter text-muted"
                    name="industry"
                    style={{
                      backgroundColor: "#EDF2F7",
                      height: "40px",
                      borderRadius: "5px",
                      textIndent: "5px",
                    }}
                    value={values.industry}
                    onChange={handleChange}
                  >
                    <option value="" className="text-muted" disabled selected hidden>
                      Select your Industry
                    </option>
                    <option value="Accounting">Accounting</option>
                    <option value="Advertising">Advertising</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Banking">Banking</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Chemicals">Chemicals</option>
                    <option value="Communications">Communications</option>
                    <option value="Construction">Construction</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Consumer Goods">Consumer Goods</option>
                    <option value="Education">Education</option>
                    <option value="Energy">Energy</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Environmental Services">Environmental Services</option>
                    <option value="Finance">Finance</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Government">Government</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Legal Services">Legal Services</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Media">Media</option>
                    <option value="Nonprofit">Nonprofit</option>
                    <option value="Pharmaceutical">Pharmaceutical</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Retail">Retail</option>
                    <option value="Technology">Technology</option>
                    <option value="Telecommunications">Telecommunications</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Other (if none of the above fit)">
                      Other (if none of the above fit)
                    </option>
                  </select>
                  <select
                    className="border-0 w-100 font-inter text-muted"
                    name="company_size"
                    style={{
                      backgroundColor: "#EDF2F7",
                      height: "40px",
                      borderRadius: "5px",
                      textIndent: "5px",
                    }}
                    value={values.company_size}
                    onChange={handleChange}
                  >
                    <option value="" className="text-muted" disabled selected hidden>
                      Company size
                    </option>
                    <option value="1-5">01 - 10</option>
                    <option value="5-10">11 - 50</option>
                    <option value="10-20">51 - 200</option>
                    <option value="20-50">201 - 500</option>
                    <option value="50-100">501 - 1000</option>
                    <option value="100-500">1001 - 5000</option>
                    <option value="100-500">5001 - 10,000</option>
                    <option value="100-500">10,000 +</option>
                  </select>
                </div>
              </Form.Group>

              <Form.Group className="w-100">
                <small className="font-inter fw-bold mb-2" style={{ fontSize: "15px" }}>
                  What are you interested in? <span className="text-danger">*</span>
                </small>

                <MultiSelectDropdown
                  {...{ selectedOptions, setSelectedOptions, setFieldValue, values }}
                  options={options()}
                  from="INTERESTED IN"
                />
              </Form.Group>
              <button
                className="btn btn-primary text-white my-2 w-100"
                type="submit"
                style={{ borderRadius: "7px" }}
              >
                Get started
              </button>
            </div>
          </form>
        </div>
      </Container>
    </>
  );
}

export default WelcomeForm;
