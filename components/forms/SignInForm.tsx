import React, { useState } from "react";
import { Form, Button, Modal, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import cookie from "js-cookie";
import { GoogleLogin } from "react-google-login";
import { toast } from "react-toastify";
import Router from "next/router";

import AuthService from "services/auth.service";
import { emailValidation } from "common_functions/functions";
toast.configure();

//service object initialization
const authService = new AuthService();

function SignInForm({ mutate }: any) {
  const [show, setShow] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [inactiveModal, setInactiveModal] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const formik: any = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: (values) => {
      if (loading) return;
      setLoading(true);
      const is_valid = emailValidation(values.email);
      if (is_valid) {
        authService
          .sendMagicLink({ email: values.email })
          .then((res) => {
            if (!(res.data.msg == "User is inactive please contact to admin")) {
              setEmail(values.email);
              setShow(true);
            } else {
              setInactiveModal(!inactiveModal);
            }
            setLoading(false);
          })
          .catch((error) => {
            // toast.error(error.email);
            toast.error("User does not exist");
            setLoading(false);
          });
      } else {
        setLoading(false);
        toast.error("Enter valid email id");
      }
    },
  });

  const responseGoogle = (response) => {
    authService
      .socialLogin({ token: response.accessToken })
      .then((response) => {
        if (response.user_is_active) {
          if (response.token) {
            cookie.set("accessToken", response.token);
            Router.replace(response.is_new ? "/auth/welcome" : "/dashboard");
            mutate(response);
          } else {
            toast.error(response.msg);
          }
        } else {
          setInactiveModal(!inactiveModal);
        }
      })
      .catch();
  };

  return (
    <>
      <>
        {process.env.NEXT_PUBLIC_CLIENT === "Intellect INFER" ? (
          <div className="signin-div">
            <h2 className="py-3 signin-text font-inter">Start for free</h2>
            <Form.Group className="p-5 pb-4 w-100">
              {/* <img className="mb-4" src="../images/hi-emoji.svg" /> */}
              <h3 className="font-inter text-white">Sign in</h3>
              <p className="m-0 text-muted font-inter text-white">Welcome back</p>
              <br />
              {/* <Form.Label className="form-custom-label mt-3">Email</Form.Label> */}
              <input
                value={formik.values.email}
                onChange={formik.handleChange("email")}
                placeholder="Email"
                type="email"
                className="custom-input w-100"
              />

              <Button
                className="btn btn-block custom-site-btn w-100 my-4 font-14"
                onClick={() => {
                  formik.handleSubmit();
                }}
                disabled={!(formik.isValid && formik.dirty)}
              >
                {loading && (
                  <Spinner
                    animation="border"
                    className="me-2"
                    style={{ width: "1em", height: "1em" }}
                  />
                )}
                Submit
              </Button>
              <div className="d-flex justify-content-between align-items-center w-100">
                <div className="border-1 border-grey w-100 border"></div>
                <h4 className="mx-2 m-0  text-white font-14">or</h4>
                <div className="border-1 border-grey w-100 border"></div>
              </div>
              <GoogleLogin
                clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENTID}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
                render={(renderProps) => (
                  <button
                    className="btn btn-outline-light shadow-sm w-100 font-14 my-3"
                    onClick={renderProps.onClick}
                    style={{ borderRadius: "6px" }}
                  >
                    <img className="mx-2 p-2" src="../images/google.svg" />
                    Sign in with Google
                  </button>
                )}
              />
              <div className="text-center mt-2">
                <span className="font-14 text-white">
                  Don't have an account?&nbsp;
                  <a href="./register" className="text-blue">
                    Sign up
                  </a>
                </span>
              </div>
              {process.env.NEXT_PUBLIC_CLIENT === "Intellect INFER" ? (
                <div className="text-center mt-2">
                  <h5 className="font-14 text-white">Two-week free trial</h5>
                  <span className="font-14 text-white">(No credit card information required)</span>
                </div>
              ) : (
                ""
              )}
            </Form.Group>
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center w-100 flex-column">
            <Form.Group className="w-50">
              {/* <img className="mb-4" src="../images/hi-emoji.svg" /> */}
              <h4 className="mb-3 font-inter">Sign in</h4>
              <p className="m-0 text-muted font-inter">Welcome back</p>
              <br />
              {/* <Form.Label className="form-custom-label mt-3">Email</Form.Label> */}
              <input
                value={formik.values.email}
                onChange={formik.handleChange("email")}
                placeholder="Email"
                type="email"
                className="custom-input w-100"
              />

              <Button
                className="btn btn-block custom-site-btn w-100 my-4"
                onClick={() => {
                  formik.handleSubmit();
                }}
                disabled={!(formik.isValid && formik.dirty)}
              >
                {loading && (
                  <Spinner
                    animation="border"
                    className="me-2"
                    style={{ width: "1em", height: "1em" }}
                  />
                )}
                Submit
              </Button>
              <div className="d-flex justify-content-between align-items-center my-3 w-100">
                <div className="border-1 border-grey w-100 border"></div>
                <h6 className="mx-2 m-0 font-10 text-secondary">or</h6>
                <div className="border-1 border-grey w-100 border"></div>
              </div>
              <GoogleLogin
                clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENTID}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
                render={(renderProps) => (
                  <button
                    className="btn btn-outline-light text-dark shadow-sm w-100 font-14 my-3"
                    onClick={renderProps.onClick}
                    style={{ borderRadius: "6px" }}
                  >
                    <img className="mx-2 p-2" src="../images/google.svg" />
                    Sign in with Google
                  </button>
                )}
              />
              <div className="text-center mt-2">
                <span className="font-14">
                  Don't have an account?&nbsp;
                  <a href="./register" className="text-blue">
                    Sign up
                  </a>
                </span>
              </div>
              {process.env.NEXT_PUBLIC_CLIENT === "Intellect INFER" ? (
                <div className="text-center mt-0">
                  <span className="font-14" style={{ color: "#FF0000" }}>
                    Free two-week trial
                  </span>
                </div>
              ) : (
                ""
              )}
            </Form.Group>
          </div>
        )}
        <Modal
          onHide={() => {
            setEmail("");
            setShow(false);
          }}
          show={show}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            <div className="d-flex flex-column align-items-center justify-content-center">
              <img src="../../images/mail-icon.svg" alt="mail-icon" className="my-4" />
              <h2>Check your email</h2>
              <small className="mb-0 text-muted">We sent an email to {email}</small>
              <small className="text-muted">Click on the embedded link to sign in.</small>
              <hr />
              <small className="text-muted">
                If you haven’t received an email after a minute.&nbsp;{" "}
                <span
                  className="text-blue font-14"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    formik.handleSubmit();
                    setShow(false);
                  }}
                >
                  Click here to try again
                </span>
              </small>
            </div>
          </Modal.Body>
        </Modal>

        {/* Account inactive modal */}
        <Modal
          show={inactiveModal}
          onHide={() => {
            setInactiveModal(false);
          }}
          keyboard={false}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body className="mb-0 mt-1">
            <div className="d-flex flex-column align-items-center justify-content-center">
              <h4 className="mt-4"> Your free trail has ended</h4>
              <p className="d-flex justify-content-center mt-1 mb-0 align-items-center">
                Unfortunately, your 15 days free trail has
              </p>
              <p className="d-flex mb-0 justify-content-center align-items-center">
                now expired. To continue using the
              </p>
              <p className="d-flex justify-content-center align-items-center">
                platform, contact us.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0 mb-3 d-flex justify-content-center align-items-center">
            <button
              className="btn ms-3 bg-white"
              onClick={() => {
                setInactiveModal(false);
              }}
            >
              Cancel
            </button>
            <Button
              variant="primary"
              className="text-white"
              onClick={() =>
                window.open(
                  `https://${
                    process.env.NEXT_PUBLIC_CLIENT === "Intellect INFER"
                      ? "intellectdata"
                      : "app.deeplobe"
                  }.com/contact-us/`
                )
              }
              style={{ width: 150, borderRadius: "4px" }}
            >
              Contact us
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
}

export default SignInForm;
