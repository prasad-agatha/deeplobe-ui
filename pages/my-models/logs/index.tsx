// **************** Internal ************************

// React internal imports
import React, { FC } from "react";
import Router, { useRouter } from "next/router";
// Components
import MainLayout from "layouts/MainLayout";

// ***************** external ************************

import DataTable from "react-data-table-component";

// Services import

import UserService from "services/user.service";
//Loader
import Loader from "react-loader-spinner";
// toasts
import { toast } from "react-toastify";
import ModelService from "services/model.service";
import useLoginStatus from "@lib/hooks/use-login-status";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
const modelService = new ModelService();

const userService = new UserService();
//toast configuration
toast.configure();
//  Internally, customStyles will deep merges your customStyles with the default styling.

//  Internally, customStyles will deep merges your customStyles with the default styling.
const customStyles = {
  rows: {
    style: {
      fontSize: "14px", // override the row height
    },
  },
  headCells: {
    style: {
      fontSize: "14px", // override the cell padding for head cells
      fontWeight: "bold",
      backgroundColor: "#F7FAFC",
    },
  },
};

const apiLogger: FC = () => {
  // Router configuration
  const router: any = useRouter();
  const { user: profileData } = useLoginStatus();
  const [reload, setReload] = React.useState(false);
  // Loader manipulation
  const [loggerloading, setLoggerLoading] = React.useState(false);
  // Log details state
  const [logDetails, setLogDetails] = React.useState([]);

  // Logger details columns for data table are decided here

  const logDetailsColumns: any = [
    {
      name: "Id",
      width: "20%",
      // selector: (row) => row.name,
      cell: (row: any) => {
        return (
          <div className="d-flex">
            <p className="text-truncate mb-0">{row.id}</p>
          </div>
        );
      },
    },

    {
      name: "Model type",
      width: "30%",
      cell: (row: any) => {
        return (
          <div className="d-flex">
            <p className="text-truncate mb-0">
              {(() => {
                switch (row.model_type) {
                  case "pre_sentimental_analysis":
                    return "Pre-trained sentimental analysis";
                  case "pre_text_moderation":
                    return "Pre-trained text moderation";
                  case "pre_wound_detection":
                    return "Wound detection";
                  case "pre_people_vehicle_detection":
                    return "People and vehicle detection";
                  case "pre_pose_detection":
                    return "Pose detection";
                  case "pre_facial_expression":
                    return "Facial expression";
                  case "pre_demographic_recognition":
                    return "Demographic recognition";
                  case "pre_facial_detection":
                    return "Facial detection";
                  case "pre_image_similarity":
                    return "Image similarity";
                  case "custom_classification":
                    return "Image Classification";
                  case "custom_segmentation":
                    return "Segmentation";
                  case "custom_image_similarity":
                    return "Image similarity";
                  case "custom_tagging":
                    return "Tagging";
                  case "custom_instance":
                    return "Instance";
                  case "custom_ocr":
                    return "OCR";
                }
              })()}
            </p>
          </div>
        );
      },
    },
    {
      name: "Input",
      width: "30%",
      center: true,
      cell: (row: any) => {
        return (
          <div className="d-flex w-100">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-engine">{JSON.stringify(row.data)}</Tooltip>}
            >
              <p className="text-truncate mb-0 me-1">{JSON.stringify(row.data)}</p>
            </OverlayTrigger>
          </div>
        );
      },
    },
    {
      name: "Created on",
      width: "20%",
      center: true,
      cell: (row: any) => {
        return (
          <>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-engine">{row.created}</Tooltip>}
            >
              <p className="text-truncate mb-0"> {row.created}</p>
            </OverlayTrigger>
          </>
        );
      },
    },
  ];
  React.useEffect(() => {
    if (router?.query?.modelID === "") {
      getLoggerDetails(router?.query?.modelName);
    } else if (router?.query?.modelID) {
      getCustomModelLoggerDetails(router?.query?.modelID);
    }
  }, [router, reload]);

  React.useEffect(() => {
    setReload(!reload);
  }, [profileData]);

  const getLoggerDetails = (modelType) => {
    setLoggerLoading(true);
    modelService
      .getApiLoggerDetails(modelType)
      .then((res) => {
        setLogDetails(res);
        setLoggerLoading(false);
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };

  const getCustomModelLoggerDetails = (modelId) => {
    setLoggerLoading(true);
    modelService
      .getCustomModelApiLoggerDetails(modelId)
      .then((res) => {
        setLogDetails(res);
        setLoggerLoading(false);
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };
  // Html designed code goes here
  return (
    <>
      <MainLayout>
        <div className="container">
          <div className="pt-5">
            <p
              className="text-primary"
              onClick={() => {
                Router.push("/my-models");
              }}
              style={{ cursor: "pointer" }}
            >
              &#60; Back to my models
            </p>
            <h3 className="mb-4">Logs</h3>
            {loggerloading || typeof logDetails === "undefined" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Loader
                  type="ThreeDots"
                  color={
                    process.env.NEXT_PUBLIC_CLIENT === "Intellect INFER" ? "#0074ff" : "#6152D9"
                  }
                  height={100}
                  width={100}
                />
              </div>
            ) : (
              <DataTable
                columns={logDetailsColumns}
                data={logDetails}
                pagination
                responsive
                fixedHeader={true}
                noHeader
                persistTableHead
                customStyles={customStyles}
                // selectableRows
                noDataComponent={
                  <div className="my-5 align-items-center">
                    <p>No data</p>
                  </div>
                }
              />
            )}
          </div>
        </div>
      </MainLayout>
    </>
  );
};
export default apiLogger;
