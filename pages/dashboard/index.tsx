// **************** Internal ************************

// React internal imports
import React, { useEffect } from "react";

// components

import MainLayout from "layouts/MainLayout";
import { dashboardCards } from "common_functions/common_cards";

// ***************** external ************************

// toasts
import { toast } from "react-toastify";
import Uppercard from "@components/setting/Uppercard";
import Link from "next/link";
import Invitation from "@components/page_elements/Invitations";

toast.configure();

const dashboard = ({ user, mutate, router }: any) => {
  return (
    <>
      <MainLayout>
        <div className="mainc container">
          <div className="ps-3">
            <Invitation {...{ router, mutate }} />
            <Uppercard {...user} />
            <h4 className="mb-4 pre-model-header mt-4">What do you want to do today?</h4>
            <div className="g-4 row">
              {dashboardCards.map((item, index) => {
                // Display card code
                return (
                  <div className="col-lg-6 " key={index}>
                    <div className="card" key={index}>
                      <div className="d-flex h-100">
                        <div className="col-8">
                          <div
                            className={`d-flex flex-column bg-light-blue p-3 ${
                              index !== 2 ? "mr-2" : "mr-0"
                            } card border border-0`}
                            style={{ minHeight: 270 }}
                          >
                            <h5 className="mb-2 fw-bold font-inter card-title">{item.name}</h5>
                            <p className="mb-3 font-inter card-text">{item.text}</p>
                            {item.path.includes("https:") ? (
                              <a className="mt-3 mr-auto mt-auto" href={item.path} target="_blank">
                                <button className="btn dashboard-btn fw-bold w-100 cursor-pointer text-center arrow-icon-btn">
                                  {item.button_text}
                                  <img className="arrow-icon" height={20} width={20} />
                                </button>
                              </a>
                            ) : (
                              <Link href={item.path}>
                                <a className="mt-3 mr-auto mt-auto">
                                  <button className="btn dashboard-btn fw-bold w-100 cursor-pointer text-center arrow-icon-btn">
                                    {item.button_text}
                                    <img className="arrow-icon" height={20} width={20} />
                                  </button>
                                </a>
                              </Link>
                            )}
                          </div>
                        </div>
                        <div className="col-4 p-0">
                          <img
                            src={
                              process.env.NEXT_PUBLIC_CLIENT === "Intellect INFER"
                                ? item.infer_icon
                                : item.icon
                            }
                            className="card-img"
                            style={{ objectFit: "cover", width: "100%", height: "100%" }}
                            alt="..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};
export default dashboard;
