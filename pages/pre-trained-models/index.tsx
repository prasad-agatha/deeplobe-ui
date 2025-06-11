import React, { FC, useState } from "react";
import MainLayout from "layouts/MainLayout";
import { preTrainedModels } from "common_functions/common_cards";

import Router from "next/router";

// bootstrap
import { Image, Tab, Tabs } from "react-bootstrap";
import Link from "next/link";

const preTrainedModel: FC = () => {
  const [key, setKey] = useState("all");

  return (
    <>
      <MainLayout>
        <div className="mainc container">
          <h3 className="mb-4">Pre-trained models</h3>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k: any) => setKey(k)}
            className="my-2 pre-tab font-12 font-inter font-weight-400"
          >
            {[
              { label: "All", key: "all" },
              { label: "Computer Vision", key: "computer-vision" },
              { label: "Text Analytics", key: "text-analysis" },
              { label: "OCR", key: "ocr" },
            ].map((e: any, id: any) => (
              <Tab eventKey={e.key} title={e.label} className="" key={id}>
                <div className="card-deck row gx-2">
                  {preTrainedModels
                    .filter((item) => item.tabs.includes(e.key))
                    .map((item, index) => {
                      return (
                        <div className="col-md-4 mb-3" key={index}>
                          <div className="card border-0 mx-2 bg-white h-100">
                            <Image
                              src={
                                process.env.NEXT_PUBLIC_CLIENT === "Intellect INFER"
                                  ? item.infer_icon
                                  : item.icon
                              }
                              className="p-2 m-2 py-0"
                            />

                            <div className="bg-white px-3 mt-2 text-center p-0 card-body">
                              <h6 className="card-title font-600">{item.name}</h6>
                              <p className="font-14 card-text line-height-16">{item.text}</p>
                            </div>

                            <div className="p-3 card-footer border-0 bg-white">
                              <Link href={item.path}>
                                <a className="">
                                  <button className="btn pre-model-btn model-buttons w-100">
                                    Try now
                                  </button>
                                </a>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Tab>
            ))}
          </Tabs>
        </div>
      </MainLayout>
    </>
  );
};
export default preTrainedModel;
