import Router, { useRouter } from "next/router";
import React, { FC } from "react";
//service
import AuthService from "services/auth.service";
//Loader
import Loader from "react-loader-spinner";
// toasts
import { toast } from "react-toastify";
//toast configuration
toast.configure();

//service object initialization
const authService = new AuthService();

const dashboard: FC = () => {
  //Router configuration
  const router: any = useRouter();
  // Get Magic id from url params
  const { magic_id } = router.query;

  // Get this component when magic id is undefined
  if (!magic_id) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Loader
          type="ThreeDots"
          color={process.env.NEXT_PUBLIC_CLIENT === "Intellect INFER" ? "#0074ff" : "#6152D9"}
          height={100}
          width={100}
        />
      </div>
    );
  } else {
    // Get this component when magic id is available
    const verifyMagicLink = () => {
      authService
        .verifyMagicCode(magic_id)
        .then((res) => {
          if (res.token) {
            authService.authenticateUser(res.token);
            Router.replace(res.user.is_new ? "/auth/welcome" : "/dashboard");
          } else {
            toast.error(res.msg);
          }
        })
        .catch((error) => {
          // alert("Something went wrong");
          toast.error("Something went wrong");
        });
    };
    React.useEffect(() => {
      verifyMagicLink();
    }, []);
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Loader
          type="ThreeDots"
          color={process.env.NEXT_PUBLIC_CLIENT === "Intellect INFER" ? "#0074ff" : "#6152D9"}
          height={100}
          width={100}
        />
      </div>
    );
  }
};
export default dashboard;
