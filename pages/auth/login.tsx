// **************** Internal ************************

// React internal imports
import React, { FC } from "react";
import Head from "next/head";
// components
import Navigation from "components/navigation/Navigation";
import { SignInForm } from "components/forms";

// ***************** external ************************

// React-bootstrap components import
import { Image } from "react-bootstrap";

const Login: FC = ({ Router, user, mutate }: any) => {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Head>
        <title>{process.env.NEXT_PUBLIC_BRAND}</title>
        <link rel="icon" href={`${process.env.NEXT_PUBLIC_BRAND_FAVICON}`} />
      </Head>
      <Navigation />
      {process.env.NEXT_PUBLIC_CLIENT !== "Intellect INFER" ? (
        <div className="container-fluid h-100">
          <div className="row h-100 justify-content-center">
            <div className="col-md-6 align-self-center justify-content-center d-flex flex-column">
              <Image
                className="img-fluid image-width-hero p-3"
                style={{ maxHeight: "calc(100vh - 235px)" }}
              />
              <h1 className="menu-color text-center font-inter fw-bold">
                No data science team?
                <br />
                Don't worry.
              </h1>
              <p
                className="menu-color text-center font-inter mx-auto"
                style={{ maxWidth: "460px" }}
              >
                We are here to make it easy for you to build & use AI models to power your business
                solution
              </p>
            </div>
            <div className="col-md-6 align-self-center justify-content-center">
              <SignInForm mutate={mutate} />
            </div>
          </div>
        </div>
      ) : (
        <div className="signin-bg d-flex pe-5" style={{ flex: 1 }}>
          <div className="d-flex flex-column text-white d-none d-md-block" style={{ flex: 1 }}>
            <Image className="img-fluid mt-5 image-signin-hero" />
            <div className="pt-5" style={{ position: "relative" }}>
              <Image className="img-fluid mt-5 image-width-hero" />
              <h3 className="img-text text-nowrap">
                No need for a data science team with
                <span style={{ color: "#FF0000" }}> INFER</span> AutoML
              </h3>
            </div>
          </div>
          <SignInForm {...{ Router, user, mutate }} />
        </div>
      )}
    </div>
  );
};
export default Login;
