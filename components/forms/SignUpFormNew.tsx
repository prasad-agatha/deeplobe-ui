import React from "react";
// next
import Router from "next/router";
// bootstrap
import { Form, Container, Modal, Button, Spinner } from "react-bootstrap";
//service
import AuthService from "services/auth.service";
//cookie
import cookie from "js-cookie";
import { GoogleLogin } from "react-google-login";
import useLoginStatus from "lib/hooks/use-login-status";
import { emailValidation } from "common_functions/functions";
// toasts
import { toast } from "react-toastify";
//toast configuration
toast.configure();

//service object initialization
const authService = new AuthService();

function SignUpFormNew(props: any) {
  const [show, setShow] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [inactiveModal, setInactiveModal] = React.useState(false);
  const { user } = useLoginStatus();

  React.useEffect(() => {
    if (user) {
      Router.replace("/");
    }
  }, [user]);

  const onSubmit = () => {
    setLoading(true);
    const is_valid = emailValidation(email);
    is_valid
      ? authService
          .registerWithMagicLink({ email: email })
          .then((res) => {
            setLoading(false);
            setShow(true);
          })
          .catch((err) => {
            setLoading(false);
            toast.error("Something went wrong");
          })
      : toast.error("Enter valid email id");
  };

  const responseGoogle = (response) => {
    authService
      .socialLogin({ token: response.accessToken })
      .then((response) => {
        if (response.user_is_active) {
          if (response.token) {
            cookie.set("accessToken", response.token);
            Router.replace(response.is_new ? "/auth/welcome" : "/dashboard");
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
      <Container>
        <div className="d-flex justify-content-center align-items-center w-100 flex-column">
          <Form.Group className="w-50">
            {/* <img className="mb-4" src="../images/hi-emoji.svg" /> */}
            <h4 className="mb-2 font-inter">Sign up</h4>
            <p className="m-0 text-muted font-inter">Get started for absolutely free.</p>
            <p className="m-0 text-muted font-inter mb-4">No credit card required.</p>
            {/* <Form.Label className="form-custom-label mt-3">Email</Form.Label> */}
            <Form.Control
              placeholder="Email"
              className="custom-input w-100"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            <button
              className="btn btn-primary custom-site-btn w-100 my-4"
              onClick={onSubmit}
              disabled={!email}
            >
              {loading && (
                <Spinner
                  animation="border"
                  className="me-2"
                  style={{ width: "1em", height: "1em" }}
                />
              )}
              Continue
            </button>
            <small className="font-12 my-3">
              *By submitting this form, you agree to the{" "}
              <a
                href={
                  process.env.NEXT_PUBLIC_CLIENT !== "Intellect INFER"
                    ? "https://deeplobe.ai/terms/"
                    : "https://intellectdata.com/terms-and-conditions/"
                }
                target="_blank"
              >
                Terms and conditions
              </a>
              , and{" "}
              <a
                href={
                  process.env.NEXT_PUBLIC_CLIENT !== "Intellect INFER"
                    ? "https://deeplobe.ai/privacy-policy/"
                    : "https://intellectdata.com/privacy-policy/"
                }
                target="_blank"
              >
                Privacy policy
              </a>
              .{/* {process.env.CLIENT === "Intellect INFER" ? "INFER" : "Deeplobe"}. */}
            </small>
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
                  Sign up with Google
                </button>
              )}
            />
            <div className="w-100 text-center m-3">
              <span className="font-14">
                Already have an account?&nbsp;
                <a href="./login" className="text-blue">
                  Sign in
                </a>
              </span>
            </div>
          </Form.Group>
        </div>
        <Modal
          onHide={() => {
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
              <h4>Check your email</h4>
              <small className="mb-0 text-muted">We sent an email to {email}</small>
              <small className="text-muted">Click on the embedded link to sign up.</small>
              <br />
              <div className="modal-footer">
                <small className="text-muted">
                  If you haven’t received an email after a minute.&nbsp;Check your spam folder or{" "}
                  <a
                    href="#"
                    onClick={() => {
                      setShow(false);
                      onSubmit();
                      setLoading(false);
                    }}
                  >
                    Click here to try again
                  </a>
                </small>
              </div>
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
              onClick={() => window.open("https://intellectdata.com/contact-us/")}
              style={{ width: 150, borderRadius: "4px" }}
            >
              Contact us
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default SignUpFormNew;
