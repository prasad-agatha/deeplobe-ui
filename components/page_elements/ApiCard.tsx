import moment from "moment";
import Link from "next/link";
import { ShimmerThumbnail } from "react-shimmer-effects";

export default function ApiCard(statData) {
  return (
    <div className="row g-3">
      {[
        {
          title: "Predictions usage",
          img: "/prediction/usage.svg",
          text: statData?.prediction_count ? `${statData?.prediction_count}` : "---",
          // text: statData && `${20000 - statData[0]?.prediction_count}/20000`,

          url: "",
          href: ``,
        },
        {
          title: "Most predictions by",
          img: "/prediction/prediction.svg",
          text: statData?.most_predicted_model
            ? `${
                statData?.most_predicted_model?.charAt(0).toUpperCase() +
                statData?.most_predicted_model?.slice(1).replace("_", " ").replace("_", " ")
              }`
            : "---",
          url: "",
          href: ``,
        },
        {
          title: "Monthly avg predictions",
          img: "/prediction/avg-prediction.svg",
          // text: `${statData?.monthly_averages?.[0].Average}`,
          text: statData?.monthly_averages?.[0]?.Average
            ? statData?.monthly_averages?.[0]?.Average
            : "---",
          url: ``,
          href: ``,
          hrefShow: "cursor-pointer",
        },
        {
          title: "No. of active models",
          img: "/prediction/active.svg",
          text: statData.active_models?.toString() || "---",
          url: "",
          href: ``,
          hrefShow: "cursor-pointer",
        },
      ].map((ele: any, id: any) => (
        <div className="col-12 col-md-6 col-lg-3" key={id}>
          <div className="card apicard apicard-bg">
            <div className="card-body d-flex flex-column gap-3  align-items-center">
              <div className="d-flex flex-column justify-content-center align-items-center mt-1">
                <img src={ele.img} width={40} height={40} />
              </div>

              <div className="flex flex-column align-items-center w-100 font-12 gap-1">
                <>
                  <span className=" text-center align-items-center  font-10">{ele.title}</span>
                  <div className="fw-bold card-text text-center">{ele.text} </div>
                  {/* <div className={`primary-color font-12 text-center txt-h ${ele.hrefShow}`}>
                    {ele.url ? (
                      <Link href={ele.url}>
                        <a target="_blank">{ele.href}</a>
                      </Link>
                    ) : (
                      <> {ele.href}</>
                    )}
                  </div> */}
                </>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
