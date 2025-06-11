import React, { useEffect } from "react";
import Loader from "react-loader-spinner";

export default function Landing({ router }) {
  useEffect(() => {
    router.replace("/auth/login");
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
      <Loader
        type="ThreeDots"
        color={process.env.NEXT_PUBLIC_CLIENT === "Intellect INFER" ? "#0074ff" : "#6152D9"}
        height={100}
        width={100}
      />
    </div>
  );
}
