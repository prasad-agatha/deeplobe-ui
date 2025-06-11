// **************** Internal ************************

// React internal imports
import React, { useEffect } from "react";
import Head from "next/head";
// components
import Navigation from "components/navigation/Navigation";
import { WelcomeForm } from "components/forms";
import Router from "next/router";

const Welcome = ({ user }) => {
  useEffect(() => {
    if (user && !user?.is_new) Router.push("/dashboard");
  }, [user]);

  return (
    <div style={{ height: "100vh" }}>
      <Head>
        <title>{process.env.NEXT_PUBLIC_BRAND}</title>
        <link rel="icon" href={`${process.env.NEXT_PUBLIC_BRAND_FAVICON}`} />
      </Head>
      <Navigation />

      <div className="container-fluid h-100">
        <div className="container-fluid h-100">
          <div className="row h-100 justify-content-center">
            <div className="col-md-6 align-self-center justify-content-center d-flex flex-column">
              <div className="align-self-center justify-content-center d-flex ">
                <img
                  className="img-fluid"
                  style={{ maxHeight: "calc(100vh - 255px)" }}
                  // src="../images/welcome-image.png"
                  src={
                    process.env.NEXT_PUBLIC_CLIENT === "Intellect INFER"
                      ? "../infer-images/welcome-cover.png"
                      : "../images/welcome-image.png"
                  }
                />
              </div>

              <h1 className="menu-color text-center font-inter fw-bold">Build better and faster</h1>
              <p
                className="menu-color text-center font-inter mx-auto"
                style={{ maxWidth: "460px" }}
              >
                Train high-quality custom Deep Learning models with minimal effort and data science
                expertise
              </p>
            </div>
            <div className="col-md-6 align-self-center justify-content-center">
              <WelcomeForm user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Welcome;
