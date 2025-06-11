// **************** Internal ************************

// React internal imports
import React, { FC, useEffect, useState } from "react";
// Deeplobe layout import
import MainLayout from "layouts/MainLayout";
import { copyToClipBoard } from "common_functions/functions";
//external
import DataTable from "react-data-table-component";
import { Modal, Card, Spinner } from "react-bootstrap";
import UserService from "services/user.service";
import { ShimmerThumbnail } from "react-shimmer-effects";
// toasts
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ApiCard from "@components/page_elements/ApiCard";
import moment from "moment";
import CircularChart from "@components/circular_chart";
import LineChart from "@components/lineChart";
import ChartService from "services/charts.service";
import ModelService from "services/model.service";
import { preTrainedModelsData } from "common_functions/common_cards";
import Select from "react-select";
import CustomDateRangePicker from "@components/dataPickers/reactDatePicker";
import MultiSelectDropdown from "@components/page_elements/multiSelectDropdown";
import subDays from "date-fns/subDays";
const modelService = new ModelService();
const chartService = new ChartService();

const userService = new UserService();
//toast configuration
toast.configure();

const customStyles = {
  rows: {
    style: {
      fontSize: "12px",
      minHeight: "35px", // override the row height
    },
  },
  headCells: {
    style: {
      fontSize: "14px", // override the cell padding for head cells
      fontWeight: "bold",
      backgroundColor: "#F7FAFC",
    },
  },
  cells: {
    style: {
      padding: "4px 8px",
      alignSelf: "center",
      display: "-webkit-box",
      "-webkit-line-clamp": "3",
      "-webkit-box-orient": "vertical",
      overflow: "hidden",
      div: {
        display: "-webkit-box",
        "-webkit-line-clamp": "3",
        "-webkit-box-orient": "vertical",
        overflow: "hidden",
      },
    },
  },
};

const api: FC = () => {
  const [data, setData] = useState([{ col: 1 }, { col: 1 }, { col: 1 }, { col: 1 }, { col: 1 }]);
  const [data1, setData1] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [statData, setStatData] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [key, setKey] = useState("");
  const [reload, setReload] = useState(false);
  const [load, setLoad] = useState(false);
  const [appName, setAppName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [shouldBeDeletedId, setShouldBeDeletedId] = useState(0);
  const [selected_days, setSelected_days] = useState("CUSTOM");
  const [apikeyModeldata, setApikeyModeldata] = useState([]);
  const [apiKeyFor, SetApiKeyFor] = useState(true); //true means pretrained, false means custom

  // const [apikeyModeldata, setApikeyModeldata] = useState(preTrainedModelsData);
  const [ccSelectedModels, setCcSelectedModels] = useState([]); // circular chart selected models
  const [apiLogsSelectedModels, setApiLogsSelectedModels] = useState([]); // api logs selected models
  const [lcModelOptions, setLcModelOptions] = useState([]);
  const [apikeyModelName, setApikeyModelName]: any = useState();

  const [api_logs_data, setApi_logs_data] = useState([]);

  const [toDate, setToDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(subDays(new Date(), 6));
  const [apilogsToDate, setApilogsToDate] = useState(new Date());
  const [apilogsFromDate, setApilogsFromDate] = useState(subDays(new Date(), 6));
  const [apiKeysModelsLength, setApiKeysModelsLength] = useState(0);

  React.useEffect(() => {
    setLoading(true);
    const getApiData = async () => {
      const r = await modelService
        .getapiKeyModels()
        .then((model_response) => {
          const temp_data = model_response.list.map((ele) => {
            setApiKeysModelsLength(model_response.list.length);
            return {
              label: ele.model_name ? ele.model_name : ele.model_type,
              value: ele.model_id ? ele.model_id : ele.model_type,
            };
          });
          setApikeyModeldata(temp_data);
          // const temp1 = [...temp_data, ...preTrainedModelsData];
          const temp1 = [...temp_data];
          temp1.map((ele, id) => {
            return {
              id: id,
              label: (
                <div className="w-100">
                  <div className="w-100 flex-between flex-nowrap">
                    <h6 className="text-truncate w-100 font-14 m-0">{ele.label}</h6>
                  </div>
                </div>
              ),
              value: ele.value,
            };
          });

          setLcModelOptions(temp1);
          setCcSelectedModels(temp1);
          setApiLogsSelectedModels(temp1);

          userService.getUserApiKeys().then((response) => {
            const formattedData = response.map((api, index) => {
              return {
                id: api.id,
                app_name: api.application_name,
                key: api.key,
                status: api.active === true ? "Active" : "Inactive",
                expiryDate: api.expire_date,
                created_on: api.created,
                last_modified_on: api.updated,
                model_name: api.pretrained_model
                  ? api.pretrained_model
                  : model_response.filter((ele) => ele.id === parseInt(api.aimodel))[0].name,
                // model_name: Number.isInteger(parseInt(api.aimodel))
                //   ? model_response.filter((ele) => ele.id == api.aimodel)[0].name
                //   : api.aimodel,
              };
            });
            setData(formattedData);
            setLoading(false);
          });
        })
        .catch((error) => {});
    };
    getApiData();
  }, [reload]);
  const groupedOptionsPretrained = [
    {
      label: "Pre trained models",
      options: preTrainedModelsData,
    },
  ];
  const groupedOptionsCustom = [
    {
      label: "Custom models",
      options: apikeyModeldata,
    },
  ];

  React.useEffect(() => {
    userService
      .getStaticData()
      .then((res) => {
        setStatData(res);
      })
      .catch((e) => toast(e));
  }, []);

  React.useEffect(() => {
    setLogsLoading(true);

    let Smonth: any = new Date(apilogsFromDate).getMonth();
    parseInt(Smonth);
    Smonth = Smonth + 1;
    let Emonth: any = new Date(apilogsToDate).getMonth();
    parseInt(Emonth);
    Emonth = Emonth + 1;

    const fd =
      new Date(apilogsFromDate).getFullYear() +
      "-" +
      Smonth +
      "-" +
      new Date(apilogsFromDate).getDate();
    const td =
      new Date(apilogsToDate).getFullYear() +
      "-" +
      Emonth +
      "-" +
      new Date(apilogsToDate).getDate();
    const selcted_models = apiLogsSelectedModels.map((ele) => {
      return ele.value;
    });

    const data = {
      time_period: selected_days,
      start_date: fd,
      end_date: td,
      models: selcted_models.length === apiKeysModelsLength ? ["ALL"] : selcted_models,
    };

    chartService
      .metric_logs(data)
      .then((res) => {
        setApi_logs_data(res.results);
        setLogsLoading(false);
      })
      .catch((e) => {
        toast(e);
        setLogsLoading(false);
      });
  }, [apilogsFromDate, apilogsToDate, apiLogsSelectedModels]);

  const columns: any = [
    {
      name: "Application",
      selector: (row) => {
        return (
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="tooltip-engine">{row.app_name}</Tooltip>}
          >
            <p className="text-truncate mb-0">{row.app_name}</p>
          </OverlayTrigger>
        );
      },
    },
    {
      name: "API key",
      width: "25%",
      cell: (row: any) => {
        return (
          <div className="d-flex">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-engine">{row.key}</Tooltip>}
            >
              <p className="text-truncate mb-0" style={{ width: "180px" }}>
                {row.key}
              </p>
            </OverlayTrigger>
            <img
              src="/images/copy-icon.svg"
              alt="copy-icon"
              className="ms-auto mb-0"
              style={{ cursor: "pointer" }}
              onClick={() => {
                copyToClipBoard(row.key);
                // alert("Copied!");
                toast.success("Copied!");
              }}
            />
          </div>
        );
      },
    },
    {
      name: "Model name",
      center: true,
      selector: (row) => {
        return (
          <div>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-engine">{row.model_name}</Tooltip>}
            >
              <p className="text-truncate mb-0 text-center">{row.model_name}</p>
            </OverlayTrigger>
          </div>
        );
      },
    },
    {
      name: "Status",
      center: true,
      selector: (row) => {
        return (
          <div>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-engine">{row.status}</Tooltip>}
            >
              <p className="text-truncate mb-0 text-center">{row.status}</p>
            </OverlayTrigger>
          </div>
        );
      },
    },

    {
      name: "Created on",
      selector: (row) => {
        return (
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="tooltip-engine">{row.created_on}</Tooltip>}
          >
            <p className="text-truncate mb-0">{row.created_on}</p>
          </OverlayTrigger>
        );
      },
    },

    {
      name: "Action",
      center: true,
      width: "10%",
      cell: (row: any) => {
        return (
          <div className="text-center">
            <img
              src="images/trash-icon.svg"
              alt="trash-icon"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setShouldBeDeletedId(row.id);
                setShowModal(true);
              }}
            />
          </div>
        );
      },
    },
  ];
  const customColumns = () => {
    return columns.map((ele: any) => {
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
  const ApiLogsCustomColumns = () => {
    return logColumns.map((ele: any) => {
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

  const logColumns: any = [
    {
      name: "ID",
      maxWidth: "100px",
      minWidth: "100px",
      selector: (row, id) => {
        return <p className="px-2 text-truncate mb-0">{id + 1}</p>;
      },
    },

    {
      name: "Model Name",
      selector: (row) => {
        return (
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="tooltip-engine">
                {row.model_type.charAt(0).toUpperCase() +
                  row.model_type.slice(1).replace("_", " ").replace("_", " ")}
              </Tooltip>
            }
          >
            <p className="text-truncate mb-0">
              {row.model_type.charAt(0).toUpperCase() +
                row.model_type.slice(1).replace("_", " ").replace("_", " ")}
            </p>
          </OverlayTrigger>
        );
      },
    },

    {
      name: "Created On",
      center: true,
      cell: (row: any) => {
        return (
          <div className="">
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id="tooltip-engine">{moment(row.created).format("DD/MM/YYYY")}</Tooltip>
              }
            >
              <p className="text-truncate mb-0 text-center">
                {moment(row.created).format("DD/MM/YYYY")}
              </p>
            </OverlayTrigger>
          </div>
        );
      },
    },
    {
      name: "Response Code",
      center: true,
      selector: (row) => {
        return <p className="text-center">{row.response_code}</p>;
      },
    },
  ];

  const circular_onchange = () => {};

  // Html designed code goes here
  return (
    <>
      <MainLayout>
        <div className="mainc container">
          <h3 className="mb-4">API's</h3>
          <div>
            <Card style={{ background: "#FFFFFF" }}>
              <Card.Body>
                <div>
                  <h5 className="fw-bold">Generate API key</h5>
                  <div className="my-3 mx-0 page-content">
                    {/* <p className="card-text">
                      Connect and integrate the ML models that you built with an API key.
                      <br />
                      Click on the button below to get your API key under your free-tier plan.
                    </p> */}
                    <p className="card-text">
                      Generate an API key that enables the linking and incorporation of the models
                      you have developed into your application.
                    </p>
                  </div>
                </div>
                <div className="d-flex flex-column">
                  <div>
                    <p className="my-1 mx-0 page-content">What is your application name?</p>
                    <input
                      className="form-control font-14 "
                      style={{ maxWidth: "250px" }}
                      type="text"
                      placeholder="Add application name here"
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                    />
                  </div>
                  <div className="d-flex gap-4 pt-3 pb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input cursor-pointer"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        onChange={() => {
                          setApikeyModelName("");
                          SetApiKeyFor(!apiKeyFor);
                        }}
                        checked={apiKeyFor === true}
                      />
                      <label
                        className="form-check-label cursor-pointer font-14"
                        htmlFor="flexRadioDefault1"
                      >
                        Pre trained models
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input cursor-pointer"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        onChange={() => {
                          setApikeyModelName("");
                          SetApiKeyFor(!apiKeyFor);
                        }}
                      />
                      <label
                        className="form-check-label cursor-pointer font-14"
                        htmlFor="flexRadioDefault2"
                      >
                        Custom Models
                      </label>
                    </div>
                  </div>
                  <p className=" mx-0 mb-0 page-content">Select Model</p>
                  <div style={{ zIndex: "999", maxWidth: "250px" }}>
                    {/* <select
                      className="form-select-sm ms-auto font-12"
                      aria-label="Default select example"
                      value={apikeyModelName}
                      onChange={(e) => setApikeyModelName(e.target.value)}
                    >
                      <option value="">Select model name</option>
                      {apikeyModeldata.map((ele) => (
                        <option value={ele.value}>{ele.name}</option>
                      ))}
                    </select> */}
                    <Select
                      value={apikeyModelName}
                      onChange={(e) => {
                        setApikeyModelName(e);
                      }}
                      options={apiKeyFor ? groupedOptionsPretrained : groupedOptionsCustom}
                      className="font-14"
                      placeholder="Select model name"
                    />
                  </div>
                  <div className="d-flex flex-row">
                    <div className="my-3 mx-0">
                      <button
                        className="btn btn-primary font-14 px-4 py-2"
                        onClick={() => {
                          if (!appName) {
                            toast.error("Please enter application name");
                            return;
                          }
                          if (!apikeyModelName) {
                            toast.error("Please select model");
                            return;
                          }

                          if (appName.trim().length > 0) {
                            setLoad(true);
                            let data;
                            if (Number.isInteger(parseInt(apikeyModelName.value))) {
                              data = {
                                application_name: appName,
                                model_id: parseInt(apikeyModelName.value),
                              };
                            } else {
                              data = {
                                application_name: appName,
                                model_name: apikeyModelName.value,
                              };
                            }

                            userService
                              .generateApiKey(data)
                              .then((res) => {
                                if (res === undefined) {
                                  toast.error("Cannot create more than 3 keys");
                                } else {
                                  toast.success("Key generated successfully");
                                  setReload(!reload);
                                  setAppName("");
                                  setApikeyModelName("");
                                }
                              })
                              .catch((err) => {
                                toast.error(err.msg);
                              })
                              .finally(() => setLoad(false));
                          } else toast.error("Application name must be filled out");
                        }}
                      >
                        {load && (
                          <Spinner
                            animation="border"
                            className="me-2"
                            style={{ width: "1em", height: "1em" }}
                          />
                        )}
                        Generate API key
                      </button>
                    </div>
                    {/* <div className="my-4 mx-3 font-14">
                      <a href="./api-documentation">View API documentation </a>
                    </div> */}
                  </div>
                </div>
                <hr />
                <h5 className="fw-bold mb-0">Manage API keys</h5>
                <div>
                  <p className="mb-3 page-content text-muted">
                    Monitor your APIs usage and activity status.
                  </p>
                </div>

                <DataTable
                  className="mh-200"
                  columns={loading ? customColumns() : columns}
                  data={data}
                  pagination
                  responsive
                  fixedHeader={true}
                  noHeader
                  persistTableHead
                  customStyles={customStyles}
                  // selectableRows
                  noDataComponent={
                    <div className="mh-200 d-flex flex-column justify-content-center p-5 mt-5">
                      <img src="/noactivityIcon.svg" height={120} className="p-2" />
                      <p className="text-center font-16 p-2 mb-0" style={{ color: "#bdbdbd" }}>
                        No activity yet
                      </p>
                    </div>
                  }
                />
                <hr />
                <div>
                  <h5 className="fw-bold mb-0">API Usage Metrics</h5>
                  <p className="mb-3 page-content text-muted">
                    Metrics and usage insights on model predictions
                  </p>
                  {/* <p className="mb-3 page-content text-muted">
                    It is a long established fact that a reader will be distracted by the readable
                    content.
                  </p> */}
                  <ApiCard {...statData} />
                </div>
                <hr />
                <div className="d-flex justify-content-end gap-2 font-12">
                  {/* <div style={{ width: "250px" }}> */}
                  <CustomDateRangePicker
                    setFromDate={setFromDate}
                    setToDate={setToDate}
                    chart_type="CIRCULAR AND LINE CHART"
                  />
                  {/* </div> */}
                  <div style={{ width: "250px" }} className="multiselect-upper-div">
                    <MultiSelectDropdown
                      selectedOptions={ccSelectedModels}
                      setSelectedOptions={setCcSelectedModels}
                      options={lcModelOptions}
                      setFieldValue="test"
                      from="CIRCULAR AND LINE CHART"
                    />
                  </div>
                </div>

                <div className="row pt-2">
                  <div className="col-12 col-xl-5 h-auto">
                    <div className="p-3 border rounded h-100">
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="fw-bold mb-0 font-14">Predictions by Model</p>
                        {/* 
                        <CustomDateRangePicker
                          setFromDate={setFromDate}
                          setToDate={setToDate}
                          chart_type="CIRCULAR CHART"
                        />
                        <MultiSelectDropdown
                          selectedOptions={ccSelectedModels}
                          setSelectedOptions={setCcSelectedModels}
                          options={lcModelOptions}
                          setFieldValue="test"
                          from="CIRCULAR CHART"
                        /> */}
                      </div>

                      <hr />

                      <CircularChart
                        {...{
                          selected_days,
                          setSelected_days,
                          fromDate,
                          toDate,
                          ccSelectedModels,
                          apiKeysModelsLength,
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-xl-7 h-auto">
                    <div className="p-3 border rounded h-100">
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="fw-bold mb-0 font-14">Predictions Timeline</p>{" "}
                        {/* <div className="d-flex flex-wrap gap-1">
                          <CustomDateRangePicker
                            setFromDate={setLcFromDate}
                            setToDate={setLcToDate}
                            chart_type="LINE CHART"
                          />
                          <MultiSelectDropdown
                            selectedOptions={lcSelectedModels}
                            setSelectedOptions={setLcSelectedModels}
                            options={lcModelOptions}
                            setFieldValue="test"
                            from="LINE CHART"
                          />
                        </div> */}
                      </div>
                      <hr />
                      <LineChart
                        {...{
                          selected_days,
                          setSelected_days,
                          fromDate,
                          toDate,
                          ccSelectedModels,
                          apiKeysModelsLength,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div>
                  <h5 className="fw-bold mb-0">API Logs</h5>
                  <p className="mb-3 page-content text-muted">
                    API log table to track and store data related to API requests and responses
                  </p>
                  <div className="d-flex justify-content-end gap-2">
                    {/* <InputGroup
                      className="input-search-bar w-30"
                      onChange={(e: any) => setSearchInput(e.target.value)}
                    >
                      <Form.Control style={{ border: "none" }} />
                      <img src="/inputSearchIcon.svg" className="px-2" />
                    </InputGroup> */}

                    <CustomDateRangePicker
                      setFromDate={setApilogsFromDate}
                      setToDate={setApilogsToDate}
                      chart_type="API LOGS"
                    />
                    <div style={{ width: "250px" }} className="multiselect-upper-div">
                      <MultiSelectDropdown
                        selectedOptions={apiLogsSelectedModels}
                        setSelectedOptions={setApiLogsSelectedModels}
                        options={lcModelOptions}
                        setFieldValue="test"
                        from="API LOGS"
                      />
                    </div>
                  </div>
                  <DataTable
                    columns={logsLoading ? ApiLogsCustomColumns() : logColumns}
                    data={api_logs_data}
                    pagination
                    responsive
                    fixedHeader
                    persistTableHead
                    customStyles={customStyles}
                    className="mt-3"
                    noDataComponent={
                      <div className="mh-200 d-flex flex-column justify-content-center p-5 mt-5">
                        <img src="/noactivityIcon.svg" height={120} className="p-2" />
                        <p className="text-center font-16 p-2 mb-0" style={{ color: "#bdbdbd" }}>
                          No activity yet
                        </p>
                      </div>
                    }
                  />
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
        <Modal
          onHide={() => {
            setShouldBeDeletedId(0);
          }}
          show={showModal}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          {" "}
          <Modal.Header style={{ backgroundColor: "white" }}>
            <Modal.Title className="ps-0 text-primary fw-bold">Confirm action</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-0 mx-1">
            <div className="container">
              <div className="mb-4">
                <p className="font-inter">Are you sure? Do you want to delete API key?</p>
              </div>
              <div className="d-flex">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    userService
                      .deleteApiKey(shouldBeDeletedId)
                      .then((res) => {
                        toast.success("Deleted Successfully");
                        setShowModal(false);
                        setReload(!reload);
                      })
                      .catch((e) => {
                        toast.error("Something went wrong");
                      });
                  }}
                >
                  Yes
                </button>
                <button
                  className="btn border-0 ms-3"
                  onClick={() => {
                    setShowModal(false);
                    setShouldBeDeletedId(0);
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </MainLayout>
    </>
  );
};
export default api;
