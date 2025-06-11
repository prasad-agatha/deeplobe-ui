import React, { useState } from "react";
import Router from "next/router";
import DataTable from "react-data-table-component";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ShimmerThumbnail } from "react-shimmer-effects";
import { toast } from "react-toastify";
import moment from "moment";

import Menu from "components/menu/menu";
import { copyToClipBoard } from "common_functions/functions";
import ModelService from "services/model.service";

toast.configure();
const modelService = new ModelService();

const customStyles = {
  rows: { style: { fontSize: "14px" } },
  headCells: { style: { fontSize: "14px", fontWeight: "bold", backgroundColor: "#F7FAFC" } },
};

const myModels = ({ step, user }) => {
  // Custom models data storage
  const [data, setData] = useState([{ col: 1 }, { col: 1 }, { col: 1 }, { col: 1 }, { col: 1 }]);
  // Reload manipulations
  const [reload, setReload] = useState(false);
  // My models data loader manipulation
  const [myModelsLoading, setMyModelsLoading] = useState(true);

  React.useEffect(() => {
    const getModels = async () => {
      try {
        const resp = await modelService.getMyModels();
        const formattedData = resp.map((api) => {
          const { id, uuid, name, model_type, extra, stats_count, status, created } = api;
          return { id, uuid, name, model_type, extra, stats_count, status, created };
        });
        setData(formattedData);
        setMyModelsLoading(false);
      } catch (e: any) {
        toast.error("Something went wrong");
      }
    };
    if (step === "custom") getModels();
  }, [step, reload, user]);

  const getModelType = (row) => {
    switch (row.model_type) {
      case "classification":
        return "Image classification";
      case "object_detection":
        return "Object detection";
      case "segmentation":
        return "Semantic segmentation";
      case "instance":
        return "Instance segmentation";
      case "image_similarity":
        return "Image similarity";
      case "ocr":
        return "OCR";
    }
  };
  // my models columns for data table are decided here
  const columns = [
    {
      name: "Model name",
      width: "12%",
      cell: (row: any) => {
        return (
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="tooltip-engine">{row.name}</Tooltip>}
          >
            <p className="text-truncate mb-0">{row.name}</p>
          </OverlayTrigger>
        );
      },
    },
    {
      name: "API",
      cell: (row: any) => {
        return (
          <>
            {row?.status === "Live" && (
              <div className="d-flex w-100">
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-engine">
                      {`${process.env.NEXT_PUBLIC_API_SERVER}/api/aimodels/${row.id}/prediction`}
                      {/* {process.env.NEXT_PUBLIC_API_SERVER}/api/aimodels/{row.id}/prediction */}
                    </Tooltip>
                  }
                >
                  <p className="text-truncate mb-0 me-1">
                    {`${process.env.NEXT_PUBLIC_API_SERVER}/api/aimodels/${row.id}/prediction`}
                    {/* {process.env.NEXT_PUBLIC_API_SERVER}/api/aimodels/{row.id}/prediction */}
                  </p>
                </OverlayTrigger>
                <img
                  src="/images/copy-icon.svg"
                  alt="copy-icon"
                  className="ms-auto pointer"
                  onClick={() => {
                    copyToClipBoard(
                      `${process.env.NEXT_PUBLIC_API_SERVER}/api/aimodels/${row.id}/prediction`
                    );
                    // alert("Copied!");
                    toast.success("Copied!");
                  }}
                />
              </div>
            )}
          </>
        );
      },
    },
    {
      name: "Model type",
      minWidth: "min(12%,190px)",
      maxWidth: "max(12%,190px)",
      cell: (row: any) => {
        return (
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="tooltip-engine">{getModelType(row)}</Tooltip>}
          >
            <p className="text-truncate mb-0">{getModelType(row)}</p>
          </OverlayTrigger>
        );
      },
    },
    {
      name: "Score",
      width: "10%",
      cell: (row: any) => {
        return (
          <p className="mb-0">
            {row.extra
              ? row.model_type === "classification"
                ? `${(row.extra * 100).toFixed(2)}%`
                : row.model_type === "ocr"
                ? `${(row.extra.result.accuracy * 100).toFixed(2)}%`
                : row.model_type === "segmentation"
                ? `${(row.extra[0]["Mean IOU:"] * 100).toFixed(2)}%`
                : row.model_type === "object_detection"
                ? `${(row.extra[0].test_iou * 100).toFixed(2)}%`
                : row.model_type === "instance"
                ? `${(row.extra[0].map * 100).toFixed(2)}%`
                : "-"
              : ""}
          </p>
        );
      },
    },
    {
      name: "Created on",
      width: "12%",
      cell: (row: any) => {
        const dt = new Date(row.created).toString().slice(4, 15);
        return (
          <>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-engine">{dt}</Tooltip>}
            >
              <p className="text-truncate mb-0"> {row.created.slice(0, 10)}</p>
            </OverlayTrigger>
          </>
        );
      },
    },
    {
      name: "Counter",
      center: true,
      width: "10%",
      cell: (row: any) => {
        return (
          <>
            {row.stats_count === 0 ? (
              0
            ) : (
              <p
                className="text-truncate mb-0 cursor-pointer text-blue"
                onClick={() => {
                  Router.push({
                    pathname: "my-models/logs",
                    query: { modelID: `${row.id}`, modelName: row.model_type },
                  });
                }}
              >
                <u>{row.stats_count}</u>
              </p>
            )}
          </>
        );
      },
    },
    {
      name: "Status",
      center: true,
      width: "10%",
      cell: (row: any) => row?.status,
    },
    {
      name: "Actions",
      center: true,
      width: "10%",
      cell: (row: any) => <Menu {...{ row, user, reload, setReload }} />,
    },
  ];

  const customColumns = () => {
    return columns.map((ele: any) => {
      return {
        ...ele,
        cell: () => (
          <div className="w-100">
            <ShimmerThumbnail
              height={15}
              className={"mb-0" + (ele.name === "Actions" ? " stm" : "")}
              rounded
            />
          </div>
        ),
      };
    });
  };

  // Html designed code goes here
  return (
    <DataTable
      data={data}
      columns={myModelsLoading ? customColumns() : columns}
      pagination
      responsive
      fixedHeader
      persistTableHead
      customStyles={customStyles}
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
                Router.push("create-model");
              }}
            >
              Custom model
            </button>
          </div>
        </div>
      }
    />
  );
};
export default myModels;
