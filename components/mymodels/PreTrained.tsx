import React, { useState } from "react";
import Router from "next/router";
import moment from "moment";
import DataTable from "react-data-table-component";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ShimmerThumbnail } from "react-shimmer-effects";
import { toast } from "react-toastify";
// Services import
import ModelService from "services/model.service";

const modelService = new ModelService();

toast.configure();

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

const PreTrained = ({ step }) => {
  // Logger data storage
  const [loggerData, setLoggerData] = useState([
    { col: 1 },
    { col: 1 },
    { col: 1 },
    { col: 1 },
    { col: 1 },
  ]);
  // Pre-trained statistics data loader manipulation
  const [statsLoading, setStatsLoading] = useState(true);

  React.useEffect(() => {
    const getModels = async () => {
      try {
        setStatsLoading(true);
        const resp = await modelService.getApiLogger();
        const preTrainedModels = [
          "pre_sentimental_analysis",
          "pre_image_similarity",
          "pre_facial_detection",
          "pre_demographic_recognition",
          "pre_facial_expression",
          "pre_pose_detection",
          "pre_text_moderation",
          "pre_people_vehicle_detection",
          "pre_wound_detection",
        ];
        const preTrainedModelStats = resp.list.filter((log) => {
          if (preTrainedModels.includes(log.model_type)) {
            return log;
          }
        });
        const formattedData = preTrainedModelStats.map((log, index) => {
          return {
            id: index + 1,
            modelType: log.model_type,
            count: log.model_type_count,
            created: moment(log.created).format("DD/MM/YYYY"),
          };
        });
        setLoggerData(formattedData);
        setStatsLoading(false);
      } catch (e: any) {
        toast.error("Something went wrong");
      }
    };
    if (step === "pre-trained") getModels();
  }, [step]);

  // Loggers columns for data table are decided here
  const loggerColumns: any = [
    {
      name: "Id",
      cell: (row: any) => {
        return (
          <div className="d-flex">
            <p className="text-truncate mb-0" style={{ width: "150px" }}>
              {row.id}
            </p>
          </div>
        );
      },
    },

    {
      name: "Model type",
      cell: (row: any) => {
        return (
          <div className="d-flex">
            <p className="text-truncate mb-0">
              {(() => {
                switch (row.modelType) {
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
                }
              })()}
            </p>
          </div>
        );
      },
    },
    {
      name: "Counter",
      center: true,
      cell: (row: any) => {
        return (
          <div className="d-flex">
            {row.count === 0 ? (
              0
            ) : (
              <p
                className="text-truncate mb-0 cursor-pointer text-blue"
                onClick={() => {
                  Router.push({
                    pathname: "my-models/logs",
                    query: { modelID: "", modelName: row.modelType },
                  });
                }}
              >
                <u>{row.count}</u>
              </p>
            )}
          </div>
        );
      },
    },

    {
      name: "Created on",
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
  const customColumns = () => {
    return loggerColumns.map((ele: any) => {
      return {
        ...ele,
        cell: () => (
          <div className="w-100">
            <ShimmerThumbnail height={15} className="mb-0 stm" rounded />
          </div>
        ),
      };
    });
  };
  // Html designed code goes here
  return (
    <>
      <div className="">
        <DataTable
          columns={statsLoading ? customColumns() : loggerColumns}
          data={loggerData}
          pagination
          responsive
          fixedHeader={true}
          noHeader
          persistTableHead
          customStyles={customStyles}
          // selectableRows
          noDataComponent={
            <div className="my-5 align-items-center">
              <div className="container text-center my-5">
                {/* <img src="../images/create-api.svg" /> */}
                <h5 className="fw-bold font-inter">You haven’t built a model yet!</h5>
                <small className="mt-3 mb-0 font-inter" style={{ color: "#808191" }}>
                  Create your first model. Let’s begin by uploading your dataset. You can go
                </small>
                <br />
                <small className="font-inter" style={{ color: "#808191" }}>
                  through our API documentation for further guidance.
                </small>
              </div>
              <div className="text-center">
                <button
                  className="model-btn font-inter"
                  onClick={() => {
                    Router.push("pre-trained-models");
                  }}
                >
                  Create pre trained model
                </button>
              </div>
            </div>
          }
        />
      </div>
    </>
  );
};

export default PreTrained;
