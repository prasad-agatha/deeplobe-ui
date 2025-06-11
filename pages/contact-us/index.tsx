// **************** Internal ************************

// React internal imports
import React, { FC, useState } from "react";
// Deeplobe layout import
import MainLayout from "layouts/MainLayout";
// toasts
import { toast } from "react-toastify";
//toast configuration
toast.configure();
import { useRouter } from "next/router";
// Components
import ContactusForm from "components/forms/ContactusForm";
import SupportForm from "components/forms/SupportForm";

const support: FC = (props) => {
  const { query } = useRouter();
  const [supportType, setSupportType] = useState("support") as any;

  React.useEffect(() => {
    if (query.name) {
      setSupportType(query.name);
    } else {
      setSupportType("support");
    }
  }, [query]);
  // Html designed code goes here
  return (
    <>
      <MainLayout>
        <div className="mainc container">
          <div className="row d-flex justify-content-between">
            <div className="card-group">
              <div className="col-md-4">
                <div className="card p-3 h-100">
                  <div className="card-body">
                    <div className="form-check mx-2">
                      <input
                        className="form-check-input mr-2"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        checked={supportType === "support" ? true : false}
                        onChange={() => {
                          setSupportType("support");
                        }}
                      />
                      <h5 className="card-title fw-bold">Support request</h5>
                      <p className="card-text">
                        Fill in the form with your request details below and we'll get in touch with
                        you shortly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3 mx-3 h-100">
                  <div className="card-body">
                    <div className="form-check mx-2">
                      <input
                        className="form-check-input mr-2"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        checked={supportType === "custom-model" ? true : false}
                        onChange={() => {
                          setSupportType("custom-model");
                        }}
                      />
                      <h5 className="card-title font-inter fw-bold">Custom model request</h5>
                      <p className="card-text">
                        Let us know how we can help for your unique AI use case and we'll get in
                        touch with you shortly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3 h-100">
                  <div className="card-body">
                    <div className="form-check mx-2">
                      <input
                        className="form-check-input mr-2"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        checked={supportType === "api" ? true : false}
                        onChange={() => {
                          setSupportType("api");
                        }}
                      />
                      <h5 className="card-title font-inter fw-bold">Hire Annotation Expert</h5>
                      <p className="card-text">
                        Get professional annotation expert help to get your annotation tasks in
                        quick time with high quality.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            {(() => {
              switch (supportType) {
                case "custom-model":
                  return <ContactusForm title={"Custom model request"} />;
                case "support":
                  return <SupportForm />;
                case "api":
                  return <ContactusForm title={"Hire Annotation Expert"} />;
                default:
                  return null;
              }
            })()}
          </div>
        </div>
      </MainLayout>
    </>
  );
};
export default support;
