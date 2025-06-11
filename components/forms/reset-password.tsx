import React from "react";
//next
import Router, { useRouter } from "next/router";
import Link from "next/link";
//bootstrap
import { Form, InputGroup, Container, Button } from "react-bootstrap";
//formik
import { useFormik } from "formik";
//service
import AuthService from "services/auth.service";
//cookie
import useLoginStatus from "lib/hooks/use-login-status";
// toasts
import { toast } from "react-toastify";
//toast configuration
toast.configure();

//service object initialization
const authService = new AuthService();

function ResetPassword(props: any) {
  const [showPassword, setShowPassword] = React.useState(true);
  const [disable, setDisable] = React.useState(true);
  const [uuid, setUuid] = React.useState("");
  const [showResetResponse, setShowResetResponse] = React.useState(false);

  const { user, mutate } = useLoginStatus();

  const router: any = useRouter();

  React.useEffect(() => {
    setUuid(router?.query.uuid);
  }, [router]);

  React.useEffect(() => {
    if (user) {
      Router.replace("/");
    }
  }, [user]);

  const formik :any= useFormik({
    initialValues: {
      token: "",
      password1: "",
      password2: "",
    },
    onSubmit: (values) => {
      values.token = uuid;

      authService
        .resetPassword(values)
        .then((res) => {
          setShowResetResponse(true);
        })
        .catch((err) => {
          // window.alert(err);
          toast.error(err);
        });
    },
  });

  React.useEffect(() => {
    if (formik.values.password1 && formik.values.password2) {
      setDisable(false);
    }
  }, [formik.values]);

  return (
    <>
      <Container>
        <div className="mt-2">
          <h3 className="login-head">Reset Your Password</h3>
        </div>
        <Form>
          <Form.Group>
            <Form.Label className="form-custom-label">New Password</Form.Label>
            <Form.Control
              value={formik.values.password1}
              onChange={formik.handleChange("password1")}
              type="password"
              className="custom-input"
            />
          </Form.Group>
          <Form.Group className="mb-1">
            <Form.Label className="form-custom-label">Confirm your new Password</Form.Label>
            <InputGroup>
              <div className="custom-pass-input">
                <Form.Control
                  value={formik.values.password2}
                  onChange={formik.handleChange("password2")}
                  className="border-0 custom-input"
                  type={showPassword ? "password" : "text"}
                  placeholder="Password"
                  // onChange={handleChange("password")}
                  autoComplete="new-off"
                />

                {showPassword ? (
                  <InputGroup.Append>
                    <img
                      src="../images/unseen.svg"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputGroup.Append>
                ) : (
                  <InputGroup.Append>
                    <img src="../images/seen.svg" onClick={() => setShowPassword(!showPassword)} />
                  </InputGroup.Append>
                )}
              </div>
            </InputGroup>
          </Form.Group>

          <Button
            disabled={disable}
            className="btn btn-block custom-site-btn mt-3"
            onClick={() => {
              formik.handleSubmit();
            }}
          >
            RESET
          </Button>
        </Form>
        {showResetResponse ? (
          <p className="mt-2">
            Password Changed Succesfully <Link href="/auth/login">Sign in to continue</Link>
          </p>
        ) : (
          ""
        )}
      </Container>
    </>
  );
}

export default ResetPassword;
