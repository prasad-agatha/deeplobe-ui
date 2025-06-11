import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "layouts/MainLayout";
import { Tab, Tabs } from "react-bootstrap";
import UsersDetails from "@components/admins/UsersDetails";
import SupportRequest from "@components/admins/SupportRequest";
import CustomModelRequest from "@components/admins/CustomModelRequest";
import HireAnnotationRequest from "@components/admins/HireAnnotationRequest";

const Admin = () => {
  const [step, setStep] = useState<any>("user");
  const router = useRouter();
  const { tab } = router.query;
  useEffect(() => {
    if (tab) setStep(tab);
  }, [tab]);

  return (
    <>
      <MainLayout>
        <div className="mainc container">
          <div className="mb-2">
            <h5 className="font-24 mb-4 font-weight-bold  font-inter ms-3">Admin</h5>
          </div>
          <div className="w-100 ">
            <Tabs
              id="controlled-tab-example"
              activeKey={step}
              onSelect={(k) => router.push(`/admin?tab=${k}`)}
              className="border-0 color font-18"
            >
              <Tab eventKey="user" title="Users">
                <div className="pt-3">
                  <UsersDetails />
                </div>
              </Tab>

              <Tab eventKey="support_request" title="Support requests">
                {step === "support_request" && (
                  <div className="pt-3">
                    <SupportRequest />
                  </div>
                )}
              </Tab>

              <Tab eventKey="custom_model_request" title="Custom model requests">
                {step === "custom_model_request" && (
                  <div className="pt-3">
                    <CustomModelRequest />
                  </div>
                )}
              </Tab>

              <Tab eventKey="annotation_expert" title="Hire Annotation Expert">
                {step === "annotation_expert" && (
                  <div className="pt-3">
                    <HireAnnotationRequest />
                  </div>
                )}
              </Tab>
            </Tabs>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Admin;
