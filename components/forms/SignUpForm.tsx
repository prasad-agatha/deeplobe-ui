import React, { FC } from "react";

// // bootstrap
// import { Form, InputGroup, Container, Row, Button, Alert } from "react-bootstrap";
// // formik
// import { useFormik } from "formik";
// // yup
// import * as yup from "yup";
// //service
// import AuthService from "services/auth.service";
// //cookie
// import cookie from "js-cookie";
// import Router from "next/router";

// const authService = new AuthService();

// const loginValidationSchema = yup.object().shape({
//   email: yup.string().email("enter valid email").required("Email Address is Required"),

//   password: yup
//     .string()
//     .matches(
//       /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
//       "Must Contain 8 Characters,One Lowercase, One Number and one special case Character"
//     )
//     .required("Password is required")
//     .max(50, ({ max }) => `Password  length must not exceed ${max} characters`),
//   first_name: yup
//     .string()
//     .required("firstName is required")
//     .max(50, ({ max }) => `firstName  length must not exceed ${max} characters`),
//   last_name: yup
//     .string()
//     .required("lastName is required")
//     .max(50, ({ max }) => `lastName  length must not exceed ${max} characters`),
//   company: yup
//     .string()
//     .required("company is required")
//     .max(50, ({ max }) => `company  length must not exceed ${max} characters`),
//   job_title: yup
//     .string()
//     .required("job title is required")
//     .max(50, ({ max }) => `job title length must not exceed ${max} characters`),
// });

// const SignUpForm: FC = () => {
//   const [showPassword, setShowPassword] = React.useState(true);
//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//       first_name: "",
//       last_name: "",
//       company: "",
//       terms: false,
//       job_title: "sa",
//       auth: "up",
//     },
//     onSubmit: (values) => {
//       authService.logIn(values).then((res) => {
//         authService.authenticateUser(res.token);
//         // cookie.set("user_id", res.user_id);
//         Router.push("/");
//       });
//     },
//     validationSchema: loginValidationSchema,
//   });

//   return (
//     <>
//       <Container>
//         <div className="mt-2">
//           <h3 className="login-head">SIGN UP</h3>
//         </div>

//         <Row>
//           <div className="col">
//             <div className="form-group mb-2">
//               <label className="form-custom-label">FIRST NAME</label>
//               <input
//                 className="form-control custom-input"
//                 type="name"
//                 name="firstName"
//                 onChange={formik.handleChange("first_name")}
//                 value={formik.values.first_name}
//               />
//             </div>
//           </div>
//           <div className="col">
//             <div className="form-group mb-2">
//               <label className="form-custom-label">LAST NAME</label>
//               <input
//                 className="form-control custom-input"
//                 type="name"
//                 name="lastName"
//                 onChange={formik.handleChange("last_name")}
//                 value={formik.values.last_name}
//               />
//             </div>
//           </div>
//         </Row>
//         <Form.Group className="mb-2">
//           <Form.Label className="form-custom-label">EMAIL</Form.Label>
//           <Form.Control
//             type="email"
//             className="custom-input"
//             name="email"
//             onChange={formik.handleChange("email")}
//             value={formik.values.email}
//           />
//         </Form.Group>
//         <Form.Group className="mb-2">
//           <Form.Label className="form-custom-label">PASSWORD</Form.Label>
//           <InputGroup className="custom-pass-input border-0 custom-input">
//             <Form.Control
//               type={showPassword ? "password" : "text"}
//               name="password"
//               onChange={formik.handleChange("password")}
//               value={formik.values.password}
//               autoComplete="new-off"
//               className="border-0 password"
//             />

//             {showPassword ? (
//               <InputGroup.Append>
//                 <img
//                   src="../images/showPassword.svg"
//                   onClick={() => setShowPassword(!showPassword)}
//                 />
//               </InputGroup.Append>
//             ) : (
//               <InputGroup.Append>
//                 <img src="../images/seen.svg" onClick={() => setShowPassword(!showPassword)} />
//               </InputGroup.Append>
//             )}
//           </InputGroup>
//         </Form.Group>
//         <Form.Group className="mb-2">
//           <Form.Label className="form-custom-label">COMPANY</Form.Label>
//           <Form.Control
//             type="text"
//             className="custom-input"
//             name="company"
//             onChange={formik.handleChange("company")}
//             value={formik.values.company}
//           />
//         </Form.Group>
//         <div className="d-flex align-items-start my-2">
//           <input type="checkbox" className="form-check-input  m-0" value="" />

//           <p className="text-info text-center privacy-text my-0 ">
//             By clicking submit you are agreeing to the Terms and Conditions.
//           </p>
//         </div>
//         <Button
//           className="btn btn-block custom-site-btn"
//           onClick={() => {
//             formik.handleSubmit();
//           }}
//         >
//           SIGN UP
//         </Button>

//         <Row>
//           <div className="w-100 text-center m-3">
//             <span>
//               Already have an account?&nbsp;
//               <a href="./login">Sign In</a>
//             </span>
//           </div>
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default SignUpForm;
