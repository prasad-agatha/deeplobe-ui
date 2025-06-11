import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Tab, Tabs } from "react-bootstrap";
import MainLayout from "layouts/MainLayout";
import PreTrained from "@components/mymodels/PreTrained";
import Custom from "@components/mymodels/Custom";
import { isRole } from "common_functions/functions";

const Mymodels = ({ user }) => {
  const [step, setStep] = useState<any>("custom");
  const router = useRouter();
  const { tab } = router.query;
  useEffect(() => {
    if (tab === "pre-trained" || tab === "custom") setStep(tab);
  }, [tab]);

  useEffect(() => {
    if (user?.current_workspace_details?.plan === process.env.NEXT_PUBLIC_FREE_PLAN)
      setStep("pre-trained");
  }, [user]);

  return (
    <>
      <MainLayout>
        <div className="mainc container">
          <div className="">
            <h5 className="font-24 mb-4 font-weight-bold  font-inter ms-3">Models</h5>
          </div>
          <div className="w-100 ">
            <Tabs
              id="controlled-tab-example"
              activeKey={step}
              onSelect={(k) => router.push(`/my-models?tab=${k}`)}
              className="border-0 color font-18"
            >
              {user?.current_workspace_details?.plan !== process.env.NEXT_PUBLIC_FREE_PLAN && (
                <Tab eventKey="custom" title="Custom">
                  <Custom {...{ step, user }} />
                </Tab>
              )}
              {!isRole(user, "annotator") && (
                <Tab eventKey="pre-trained" title="Pre-Trained">
                  <PreTrained {...{ step }} />
                </Tab>
              )}
            </Tabs>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Mymodels;
