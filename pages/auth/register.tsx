// **************** Internal ************************

// React internal imports
import React, { FC } from "react";
import Head from "next/head";
// components
import Navigation from "components/navigation/Navigation";
import { SignUpFormNew } from "components/forms";
//Router
import Router from "next/router";
// Custom hook to check user logged in
import useLoginStatus from "lib/hooks/use-login-status";

// ***************** external ************************

// React-bootstrap components import
import { Image } from "react-bootstrap";

const Register: FC = () => {
  // Custom hook methods
  const { user, mutate } = useLoginStatus();

  React.useEffect(() => {
    if (user) {
      Router.push("/");
    }
  }, [user]);
  // Html designed code goes here
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Head>
        <title>{process.env.NEXT_PUBLIC_BRAND}</title>
        <link rel="icon" href={`${process.env.NEXT_PUBLIC_BRAND_FAVICON}`} />
      </Head>
      <Navigation />
      <div className="container-fluid h-100">
        <div className="row h-100 justify-content-center">
          <div className="col-md-6 align-self-center justify-content-center d-flex flex-column">
            <Image
              className="img-fluid image-width-signup p-3"
              style={{ maxHeight: "calc(100vh - 235px)" }}
            />
            <h1 className="menu-color text-center font-inter fw-bold">No-code AI Platform</h1>
            <p className="menu-color text-center font-inter mx-auto" style={{ maxWidth: "460px" }}>
              Create your own custom Computer vision models with this simple drag and drop
              interface.
            </p>
          </div>
          <div className="col-md-6 align-self-center justify-content-center">
            <SignUpFormNew mutate={mutate} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
