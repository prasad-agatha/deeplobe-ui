import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { ShimmerThumbnail } from "react-shimmer-effects";
import { Modal, Spinner } from "react-bootstrap";
import moment from "moment";
import UserService from "services/user.service";

const userService = new UserService();
const plan_details = [
  {
    plan_name: "Half yearly",
    plan_period: "Half-Yearly",
    plan_id: "Growth_half_yearly",
    price: "$199",
  },
  {
    plan_name: "Yearly",
    plan_period: "Yearly",
    plan_id: "Growth_yearly",
    price: "$189",
  },
];

const SubscriptionPage = ({ data, mutate, workspaceMutate, profileData, setShow }) => {
  const router: any = useRouter();
  const { goToPlan } = router.query;
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [button_loading, setButton_loading] = useState("");
  const [userPlan, setUserPlan] = useState<any>(data);
  const [period, setPeriod] = useState("Half-Yearly");
  const [subscripion_popup, setSubscripion_popup] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      if (userPlan?.plan.includes("Growth")) {
        const res = await userService.createPortal({});
        window.location.assign(res?.url);
      } else {
        setSubscripion_popup(true);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error(e?.message ? e.message : e);
    }
  };

  const chooseHPlan = async (planPeriod) => {
    try {
      setButton_loading(planPeriod);
      console.log(planPeriod, "planPeriod");
      const res = await userService.createSession({ period: planPeriod });

      window.location.assign(res?.url);
      setButton_loading("");
    } catch (e) {
      setButton_loading("");
      toast.error(e?.message ? e.message : e);
    }
  };

  useEffect(() => {
    const getPlan = async () => {
      setUserPlan(data);
      setPlan(goToPlan ? `${goToPlan}` : data?.plan?.split("-")[0] || "Free");
    };
    if (router && data) getPlan();
  }, [router.asPath, goToPlan, data, profileData]);
  console.log(userPlan);
  return (
    <>
      {!plan ? (
        <div className="row">
          <div className="col-12">
            <div className="rounded card-table p-4">
              <ShimmerThumbnail height={30} width={150} className="mb-0" rounded />
              <hr className="border_line" />
              {[...Array(3)].map((e: any, id: any) => (
                <div key={id} className="subscibe_card cursor-pointer">
                  <div
                    className={`${
                      id === 0 ? "radio-box-input " : "default_card"
                    } hover___ d-flex justify-content-between mt-3 p-3`}
                  >
                    <div className="d-flex align-items-center">
                      <input
                        className="form-check-input"
                        type="radio"
                        readOnly
                        checked={id === 0}
                      />
                      <div className="d-flex flex-column ps-3">
                        <ShimmerThumbnail height={30} width={150} className="mb-0" rounded />
                        <ShimmerThumbnail height={15} width={50} className="mb-0" rounded />
                      </div>
                    </div>
                    <div className="d-flex flex-column align-items-end">
                      <ShimmerThumbnail height={25} width={50} className="mb-0" rounded />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="rounded card-table p-4">
              <h4 className="plan-h mt-1">Choose Your Plan</h4>
              <hr className="border_line" />
              {[
                {
                  name: "Free Plan",
                  planId: "Free",
                  span: "For starters",
                  planType: "",
                  billedAmount: "$0",
                  features: [
                    "1 User",
                    "All Pre-trained Models",
                    "1000 Predictions per month",
                    "10 GB Storage",
                  ],
                  link: "See All Features ->",
                },
                {
                  name: "Growth Plan",
                  planId: "Growth",
                  span: "Billed Half-Yearly/Yearly",
                  planType: "Half-Yealy",
                  billedAmount: "$199",
                  features: [
                    "3 Users",
                    "All Pre-trained Models",
                    "All Custom Models",
                    "10,000 Predictions per month",
                    "1 TB Storage",
                  ],
                  link: "See All Features ->",
                  btn: "Choose Plan",
                },
                {
                  name: "Enterprise Plan",
                  planId: "Enterprise",
                  span: "",
                  planType: "Talk to Sales",
                  billedAmount: "$399",
                  features: [
                    "Unlimited Users",
                    "All Pre-trained Models",
                    "All Custom Models",
                    "Unlimited Predictions per month",
                    "Unlimited Storage",
                  ],
                  link: "See All Features ->",
                  btn: "Talk to Sales",
                },
              ].map((e: any, id: any) => (
                <div key={id} className="subscibe_card cursor-pointer">
                  <div
                    className={`${
                      plan === e.planId ? "radio-box-input " : "default_card"
                    } hover___ d-flex justify-content-between mt-3 p-3`}
                    onClick={() => setPlan(e.planId)}
                  >
                    <div className="d-flex align-items-center">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="plan"
                        readOnly
                        checked={plan === e.planId}
                      />
                      <div className="d-flex flex-column ps-3">
                        <label className="form-check-label plan_head">{e.name}</label>
                        <span className="starters_sub">
                          {e.planId === "Growth" && userPlan?.plan.includes("Growth")
                            ? userPlan?.plan.includes("Growth-plan half yearly")
                              ? "Billed Half-Yearly"
                              : "Billed Yearly"
                            : e.span}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex flex-column align-items-end">
                      <div>
                        <span
                          className={`  ${
                            userPlan?.plan.includes(e.planId)
                              ? "current_plan"
                              : !e.planType
                              ? ""
                              : "free_trail  rounded-pill text-center px-2 py-1"
                          }`}
                        >
                          {userPlan?.plan.includes(e.planId) && (
                            <img src="/green_circle.svg" alt="green_circle" className="me-2" />
                          )}
                          {e.name === "Enterprise Plan"
                            ? e.planType
                            : userPlan?.plan.includes(e.planId)
                            ? "Current plan"
                            : plan === "Growth"
                            ? period
                            : e.planType}
                        </span>
                      </div>
                      <span className="ms-auto">
                        {e.name === "Enterprise Plan" ? (
                          <small className="font-12">Custom plan</small>
                        ) : (
                          <>
                            <b>
                              {e.planId === "Growth" && userPlan?.plan.includes("Growth")
                                ? userPlan?.plan === "Growth-plan half yearly"
                                  ? userPlan?.plan.includes("INR")
                                    ? "₹16,468"
                                    : "$199"
                                  : userPlan?.plan.includes("INR")
                                  ? "₹15,640"
                                  : "$189"
                                : e.planId === "Growth"
                                ? profileData?.stripe_currency === "inr"
                                  ? "₹16,468"
                                  : "$199"
                                : e.planId === "Free" && profileData?.stripe_currency === "inr"
                                ? "₹0"
                                : e.billedAmount}
                            </b>
                            /month
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  {plan === e.planId && (
                    <div className="radio-box-output mt-2">
                      {/* {plan === "Growth" && !userPlan?.plan.includes("Growth") && (
                        <>
                          {["Half-Yearly", "Yearly"].map((e, id) => (
                            <div
                              key={id}
                              className={
                                "d-inline-flex fw-bold font-14 p-2 py-1 mb-3 " +
                                (period === e ? "border-2 border-bottom border-primary" : "")
                              }
                              onClick={() => setPeriod(e)}
                            >
                              {e}
                            </div>
                          ))}
                        </>
                      )} */}

                      <h4 className="plan_head">Features Included</h4>

                      {e.features.map((e, idx: any) => (
                        <div className="d-flex  align-items-center mt-3" key={idx}>
                          <Image src="/tick_.svg" alt="tick-icon" width={20} height={20} />
                          <p className="my-auto ps-2 points__">{e}</p>
                        </div>
                      ))}

                      <div className="mt-3 cursor-pointer">
                        <a
                          className="link___"
                          onClick={() => window.open("https://deeplobe.ai/pricing", "_blank")}
                        >
                          {e.link}
                          {/* <FaArrowRight /> */}
                        </a>
                      </div>

                      <div className="mt-2">
                        <button
                          className={`${plan === "Free" ? "d-none" : ""} btn btn-primary px-3`}
                          onClick={() => {
                            if (plan === "Growth") handleCheckout();
                            else window.open("https://deeplobe.ai/contact-us/", "_blank");
                          }}
                        >
                          {loading && (
                            <Spinner
                              animation="border"
                              className="me-2"
                              style={{ width: "1em", height: "1em" }}
                            />
                          )}
                          {plan === "Growth" && userPlan?.plan.includes("Growth") ? "Renew" : e.btn}
                        </button>
                        {/* {plan === "Growth" && userPlan?.plan.includes("Growth") && (
                          <button
                            className="btn btn-outline-primary ms-3"
                            type="button"
                            onClick={async () => setShow(true)}
                          >
                            Cancel Renewal
                          </button>
                        )} */}
                      </div>
                      {plan === "Growth" && userPlan?.plan.includes("Growth") && (
                        <p className="sub-payment font-14 text-primary mt-3">
                          Subscription expires on{" "}
                          {moment(userPlan?.to_date).format("MMMM Do, YYYY")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Modal
        onHide={() => setSubscripion_popup(false)}
        keyboard={false}
        show={subscripion_popup}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="pb-0" style={{ backgroundColor: "white" }}>
          <Modal.Title className="ps-0 text-primary fw-bold font-inter">Choose Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0 mx-2">
          <div className="d-flex  justify-content-center gap-4 pb-1">
            {plan_details.map((ele) => (
              <>
                <div className="card apicard apicard-bg  border-primary w-100 pb-1">
                  <div className="card-body d-flex flex-column align-items-center">
                    <div>Growth</div>
                    <div className="font-14 fw-bold">{ele.plan_name}</div>

                    <div className="my-3">
                      <span className="fw-bold mt-3">
                        {profileData?.stripe_currency === "inr"
                          ? ele.plan_name === "Half yearly"
                            ? "₹16,468"
                            : "₹15,640"
                          : ele.price}
                      </span>
                      <span className="font-14">/ month</span>
                    </div>
                    <div className="w-100">
                      <button
                        className="btn btn-outline-primary w-100 font-14"
                        onClick={() => {
                          chooseHPlan(ele.plan_period);
                        }}
                      >
                        {button_loading === ele.plan_period && (
                          <Spinner
                            animation="border"
                            className="me-2"
                            style={{ width: "1em", height: "1em" }}
                          />
                        )}
                        Upgrade now
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default SubscriptionPage;
