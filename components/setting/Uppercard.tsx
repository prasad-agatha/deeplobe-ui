import moment from "moment";
import Link from "next/link";
import { ShimmerThumbnail } from "react-shimmer-effects";

export default function Uppercard(user) {
  return (
    <div className="row g-3">
      {[
        {
          title: "Predictions Usage",
          img: "/apicallsusage.svg",
          text:
            user?.current_workspace_details &&
            `${user?.current_workspace_details?.api_calls}/${user?.current_workspace_details["api-requests"]}`,

          url: "",
          href: `${
            // user?.current_workspace_details?.billing_period === "Billed per 1 month"
            //   ? "Current Month"
            //   : ""
            moment().format("MMMM YYYY")
          }`,
        },
        {
          title: "No. of active Models",
          img: "/noofactivemodels.svg",
          text: `${user?.current_workspace_details?.active_models}`,
          url: "",
          href: ``,
        },
        {
          title: "Current Plan",
          img: "/currentplan.svg",
          text: `${user?.current_workspace_details?.plan.split("-")[0]}`,
          // text: `${user?.current_workspace_details?.plan.replace(/[INR,-](.*)/g, "")}`,
          url: `/settings?tab=subscription&goToPlan=${
            user?.current_workspace_details?.plan?.includes("Free") ? "Growth" : "Enterprise"
          }`,
          href: (
            <>
              {`Upgrade to ${
                user?.current_workspace_details?.plan?.includes("Free") ? "Growth" : "Enterprise"
              }`}
              <b>&#8594;</b>
              {/* <img src="/arrowright.svg" height={13} width={13} className="selected-icon" /> */}
            </>
          ),
          hrefShow: "cursor-pointer",
        },
        {
          title: "Users",
          img: "/userstop.svg",
          text: `${user?.current_workspace_details?.collaborators + 1}`,
          url: "/settings?tab=users",
          href: (
            <>
              {user?.current_workspace_details?.plan.includes("Free") ? (
                ""
              ) : (
                <>
                  {/* {`Invite new member `} */}
                  Invite new member<b>&#8594;</b>
                  {/* <img src="/arrowright.svg" height={13} width={13} className="selected-icon" /> */}
                </>
              )}
            </>
          ),
          hrefShow: "cursor-pointer",
        },
      ].map((ele: any, id: any) => (
        <div className="col-12 col-md-6 col-lg-3" key={id}>
          <div className="card uppercard">
            <div className="card-body d-flex flex-column gap-3  align-items-center">
              <div className="d-flex flex-column justify-content-center align-items-center mt-1">
                <img src={ele.img} width={40} height={40} />
              </div>
              <span className=" text-center align-items-center txt-h">{ele.title}</span>

              {/* <div className="flex flex-column align-items-center ">
                {" "}
                <div className="fw-bold card-text text-center">{ele.text} </div>
                <div className={`primary-color font-12 text-center ${ele.hrefShow}`}>
                  {ele.url ? (
                    <Link href={ele.url}>
                      <a target="_blank">{ele.href}</a>
                    </Link>
                  ) : (
                    <> {ele.href}</>
                  )}
                </div>
              </div> */}
              <div className="flex flex-column align-items-center w-100">
                {" "}
                {user?.current_workspace_details ? (
                  <>
                    <div className="fw-bold card-text text-center">{ele.text} </div>
                    <div className={`primary-color font-12 text-center txt-h ${ele.hrefShow}`}>
                      {ele.url ? (
                        <Link href={ele.url}>
                          <a target="_blank">{ele.href}</a>
                        </Link>
                      ) : (
                        <> {ele.href}</>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {" "}
                    <div className="shm-w1">
                      {" "}
                      <ShimmerThumbnail height={22} className="m-0  shimmer-min-width" rounded />
                    </div>
                    <div className="shm-w2">
                      {" "}
                      <ShimmerThumbnail height={14} className="m-0 shimmer-min-width" rounded />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
