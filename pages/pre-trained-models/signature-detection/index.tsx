// **************** Internal ************************

// React internal imports
import React, { FC, useState } from "react";

// Components

// Deeplobe layout import
import MainLayout from "layouts/MainLayout";
// Common function
import { SampleCodeAccordion } from "components/accordion";
import { fileToBase64, doesImageExist, getDataBlob } from "common_functions/functions";
//service
import PRETRAINEDService from "services/pre-trained.services";
//Shimmer effect
import { ShimmerThumbnail } from "react-shimmer-effects";

import { MyDropzone } from "components/dropzone";

import { signatureDetectionSamples } from "common_functions/sample_images.ts/signatureDetectionSamples";
// toasts
import { toast } from "react-toastify";
import Link from "next/link";
import DataTable from "react-data-table-component";
import { Document, Page, pdfjs } from "react-pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { OverlayTrigger, ProgressBar, Spinner, Tab, Tabs, Tooltip } from "react-bootstrap";
import JsonFormatter from "react-json-formatter";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
//toast configuration
toast.configure();

//service object initialization
const pretrainedService = new PRETRAINEDService();

const signatureDetection: FC = () => {
  // Predicted result storage
  const [result, setResult] = useState({}) as any;
  // Submit button manipulation
  const [submit, setSubmit] = useState(false);
  // Loader manipulation
  const [loading, setLoading] = useState(false);
  // Upload type storage
  const [selectedUploadType, setSelectedUploadType] = useState("upload-image");
  // if upload type is image-url Image URL is set in this state
  const [imageUrl, setImageUrl] = useState("");
  // if upload type is upload-image image file is set in this state
  const [uploadedFile, setUploadedFile] = useState({} as any);
  // if upload type is sample-image selected sample image files is set in this state
  const [selectedImages, setSelectedImages] = useState([] as any);
  // All sample images are set here
  const [test_array, setTest_array] = useState(signatureDetectionSamples);
  const [key, setKey] = useState("Labels");

  const [numPages, setNumPages] = useState(null);

  const customStyles = {
    rows: {
      style: {
        minHeight: "40px",
        fontSize: 14,
        fontFamily: "Inter",
        fontStyle: "normal !important",
        borderBottom: "0px",
        cursor: "default !important",
      },
    },
    headCells: {
      style: {
        fontSize: "14px", // override the cell padding for head cells
        fontWeight: "bold",
        backgroundColor: "#F7FAFC",
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
        whiteSpace: "normal !important",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
        paddingTop: "8px",
        paddingBottom: "8px",
        div: {
          display: "-webkit-box",
          "-webkit-line-clamp": "3",
          "-webkit-box-orient": "vertical",
        },
      },
    },
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const detectFaces = async () => {
    let pl = "" as any;
    let tempfile = "" as any;
    let error = true;
    if (Object.keys(uploadedFile).length > 0 || imageUrl.length > 0 || selectedImages.length > 0) {
      if (selectedUploadType === "upload-image" && selectedImages.length > 0) {
        pl = await fileToBase64(selectedImages[0]);
        error = false;
      } else if (selectedUploadType === "sample-image") {
        pl = await getDataBlob(uploadedFile.original_path);
        error = false;
      } else {
        error = true;
      }
      if (error) {
        toast.error("Something went wrong. Please select valid photo");
        setLoading(false);
        setSubmit(false);
      } else {
        setSubmit(true);

        const t = await fetch(pl);
        const tr = await t.blob();
        let newfile;
        if (tr.type === "application/pdf") {
          newfile = new File([tr], "Filename.pdf", { type: "application/pdf" });
        } else {
          newfile = new File([tr], "File name", { type: "image/png" });
        }
        const formData = new FormData();
        formData.append("file", newfile);
        tempfile = formData;
        pretrainedService
          .signatureDetection(tempfile)
          .then((res) => {
            const timestamp = Date.now();
            res.output_image_paths = res.output_image_paths.map(
              (img) => `${img}?timestamp=${timestamp}`
            );

            res.result.forEach((ele) => {
              return (ele.Cropped_image = `${ele.Cropped_image}?timestamp=${timestamp}`);
            });
            setResult({
              original_image_url: URL.createObjectURL(newfile),
              output_image_urls: res.output_image_paths,
              input_file_url: res.s3_url,
              resultData: res.result,
            });
            setLoading(false);
          })
          .catch((err) => {
            toast.error("Something went wrong");
            setLoading(false);
          });
      }
    } else {
      toast.error("Please provide image to the run model");
      setLoading(false);
    }
  };

  // Reset to default page
  const resetAll = (e) => {
    setResult({} as any);
    setSubmit(false);
    setUploadedFile([]);
    setSelectedUploadType("upload-image");
    setTest_array(signatureDetectionSamples);
    setSelectedImages([]);
  };

  const imageClick = (image) => {
    setSelectedUploadType("sample-image");
    //Reset Upload images
    setSelectedImages([]);
    let updated_sample = signatureDetectionSamples.map((item: any) => {
      if (item.id == image.id) {
        return {
          id: image.id,
          thumbnail_path: image.thumbnail_path,
          original_path: image.original_path,
          selected: true,
        };
      } else {
        return item;
      }
    });
    setTest_array(updated_sample);
    setUploadedFile(image);
  };

  const columns: any = [
    {
      name: "Label",
      selector: (row: any) => row.Label,
      sortable: true,
      wrap: true,
    },

    {
      name: "Page No",
      selector: (row: any) => row.Page_no,
      sortable: true,
      wrap: true,
    },
    {
      name: "Confidence score",
      selector: (row: any) => row.Confidence_score,
      sortable: true,
      wrap: true,
    },
    {
      width: "50%",
      name: "Signature",
      center: true,
      selector: (row: any) => (
        <>
          <img src={row.Cropped_image} height={75} />
        </>
      ),
      sortable: true,
      wrap: true,
    },
  ];

  const copy = (ele: any) => {
    navigator.clipboard.writeText(ele);
  };
  // Html designed code goes here
  return (
    <>
      <MainLayout>
        <div className="">
          <div className="row mx-5 my-5">
            <Link href="/pre-trained-models">
              <a>
                <p className="text-primary font-14" style={{ cursor: "pointer" }}>
                  &#60; Back to pre-trained models
                </p>
              </a>
            </Link>
            <div className="card border-0 p-3 bg-white">
              <div className="">
                <h4 className="page-title ms-3">Signature detection</h4>
              </div>
            </div>
            <hr className="mb-0" style={{ color: "#E4E4E4" }} />
            <div className="card border-0 bg-white pb-3">
              <div className="my-2 mx-4 page-content">
                <p className="mb-3">
                  The signature detection model allows you to automatically detect handwritten
                  signatures, electronic signatures on documents or images
                </p>
              </div>
              <SampleCodeAccordion
                isPretrained={true}
                isImageInput={true}
                url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/signature-detection`}
                url2={``}
                url3={``}
                modelName={"image-background-removal"}
                content_type="application/json"
                curl_payload="file=@file.jpg"
                // nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/image_url'&#93;&#125;"
                nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/image_url'&#93;&#125;"
                python_payload="&#123;'file' &#58; open&#40;'file.jpg','rb'&#41;&#125;"
                data_format="formdata"
                number_of_files={1}
              />
              <div className="m-3 row">
                <div className="col-md-5 block-background p-4">
                  <h5 className="mb-3 try-sample-title">Click on sample images below to select</h5>
                  <div
                    className="bg-white  container large-2 px-0"
                    style={{ height: "228px", overflowY: "auto", overflowX: "hidden" }}
                  >
                    {/* <p className="page-content">Select any two images to check similarity score</p> */}

                    <div className="m-3   emulated-flex-gap1 gap-2 justify-content-center">
                      {/* <div className="d-flex flex-wrap justify-content-start"> */}
                      {test_array.map((image) => (
                        <div className="m-0" key={image.id}>
                          <img
                            src={image.thumbnail_path}
                            onClick={() => {
                              imageClick(image);
                            }}
                            className="fishes"
                            style={{
                              height: 70,
                              width: 76,
                              opacity: image.selected ? 0.25 : 1,
                              objectFit: "fill",
                            }}
                          />
                          {image.selected ? (
                            <div className="overlay d-flex justify-content-center align-items-center">
                              <i
                                className="fa fa-check-circle"
                                style={{ marginTop: "-80px", color: "#6152D9" }}
                              ></i>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-md-2  text-center">
                  <div className="col-md-1 col-12 d-flex flex-column justify-content-center align-items-center h-100 w-100">
                    <div className="border-start h-100"></div>
                    <h6 className="m-0 my-1">or</h6>
                    <div className="border-start h-100"></div>
                  </div>
                </div>
                <div className="col-md-5 block-background container p-2">
                  <div className="d-flex flex-wrap gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input cursor-pointer"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        checked={selectedUploadType === "upload-image" ? true : false}
                        onChange={() => {
                          setSelectedUploadType("upload-image");
                          //Reset Upload images
                          setSelectedImages([]);
                          //Reset Try Samples
                          setTest_array(signatureDetectionSamples);
                        }}
                      />
                      <label
                        className="form-check-label page-content cursor-pointer"
                        onClick={() => {
                          setSelectedUploadType("upload-image");
                          setSelectedImages([]);
                          setTest_array(signatureDetectionSamples);
                        }}
                      >
                        Upload image or pdf
                      </label>
                    </div>
                  </div>
                  <div className="form-group mt-3">
                    {selectedUploadType === "upload-image" ? (
                      <>
                        <div>
                          <MyDropzone
                            setSelectedImages={setSelectedImages}
                            maxNumberOfImages={1}
                            align={true}
                            acceptExtensions={[
                              "image/jpeg",
                              "image/png",
                              "image/jpg",
                              "application/pdf",
                              ".pdf",
                            ]}
                          />
                        </div>
                        {selectedImages.length > 0 ? (
                          <div className="d-flex border border-white rounded bg-white mt-3 p-3 justify-content-between">
                            <div className="d-flex">
                              <svg
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M21.0005 10V16C21.0005 20 20.0005 21 16.0005 21H6.00049C2.00049 21 1.00049 20 1.00049 16V6C1.00049 2 2.00049 1 6.00049 1H7.50049C9.00049 1 9.33049 1.44 9.90049 2.2L11.4005 4.2C11.7805 4.7 12.0005 5 13.0005 5H16.0005C20.0005 5 21.0005 6 21.0005 10Z"
                                  stroke="#6152d9"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                />
                              </svg>
                              <p
                                className="p-0 text-muted text-truncate ms-2"
                                style={{ maxWidth: "200px" }}
                              >
                                {selectedImages[0].path}
                              </p>
                              <p className="p-0 text-muted">
                                {" "}
                                - {Math.ceil(selectedImages[0].size / 1024).toFixed(0)}kb
                              </p>
                            </div>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setSelectedImages([]);
                              }}
                            >
                              <img src="../images/delete-icon.svg" alt="delete-icon" />
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="d-flex flex-wrap py-5 gap-3 justify-content-center">
                <button
                  className="btn btn-outline-primary model-buttons"
                  onClick={async () => {
                    setSubmit(false);
                    setLoading(true);
                    await setResult("");
                    detectFaces();
                  }}
                >
                  {loading && (
                    <Spinner
                      animation="border"
                      className="me-2"
                      style={{ width: "1em", height: "1em" }}
                    />
                  )}
                  Run model
                </button>
                <button
                  className="btn btn-link text-decoration-none  model-buttons"
                  onClick={resetAll}
                >
                  Clear
                </button>
              </div>
            </div>
            <hr className="mb-0" style={{ color: "#E4E4E4" }} />
            <div className="card border-0 bg-white">
              {submit ? (
                <>
                  <div className="container">
                    <h3 className="my-3 result-title">Model results</h3>
                    <div className="d-flex row justify-content-around mt-3 mb-2 gap-3 gap-xl-0">
                      <div className="col-12 col-xl-6">
                        <div className="d-flex justify-content-center w-100  bg-light p-3 p-xl-4 shimmer-div">
                          {loading ? (
                            <ShimmerThumbnail height={350} rounded className="d-flex mb-0" />
                          ) : (
                            <>
                              {result.input_file_url?.endsWith(".pdf") ? (
                                <div>
                                  <Document
                                    height="350px"
                                    file={result.input_file_url}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                  >
                                    {Array.apply(null, Array(numPages))
                                      .map((x, i) => i + 1)
                                      .map((page, id) => (
                                        <Page
                                          key={id}
                                          pageNumber={page}
                                          renderTextLayer={false}
                                          style={{ maxHeight: "350px" }}
                                        />
                                      ))}
                                  </Document>
                                </div>
                              ) : (
                                <>
                                  {" "}
                                  <img
                                    className="img-fluid"
                                    src={result.original_image_url}
                                    style={{ maxHeight: "350px" }}
                                  />
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-xl-6">
                        <div className="d-flex justify-content-center w-100  bg-light p-3 p-xl-4 shimmer-div">
                          {loading ? (
                            <ShimmerThumbnail height={350} rounded className="d-flex mb-0" />
                          ) : (
                            <>
                              <div
                                className="d-flex flex-column  gap-3 justify-content-center w-auto"
                                style={{
                                  overflow: "auto",
                                  maxHeight: result.input_file_url?.endsWith(".pdf")
                                    ? "570px"
                                    : "350px",
                                }}
                              >
                                {result.output_image_urls?.map((image) => {
                                  return (
                                    <img
                                      className="img-fluid"
                                      src={image}
                                      style={{
                                        maxHeight: result.input_file_url?.endsWith(".pdf")
                                          ? "570px"
                                          : "350px",
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {!loading ? (
                      <div>
                        <Tabs
                          id="controlled-tab-example"
                          activeKey={key}
                          onSelect={(k: any) => setKey(k)}
                          className="border-0"
                        >
                          <Tab eventKey="Labels" title="Labels" className="p-3">
                            <div className="row">
                              <div className="col-12">
                                <DataTable
                                  columns={columns}
                                  data={result.resultData}
                                  pagination
                                  responsive
                                  fixedHeader={true}
                                  noHeader
                                  persistTableHead
                                  customStyles={customStyles}
                                />
                              </div>
                            </div>
                          </Tab>
                          <Tab eventKey="JSON" title="JSON" className="p-3">
                            <div style={{ position: "relative" }}>
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id="button-tooltip">Copy to ClipBoard</Tooltip>}
                              >
                                <button
                                  className="copy-button btn"
                                  onClick={() => copy(JSON.stringify(result?.resultData))}
                                >
                                  <img src={"/copy.svg"} className="copy" alt="img" />
                                </button>
                              </OverlayTrigger>
                            </div>
                            <div>JSON</div>
                            <div className="p-r"></div>
                            <JsonFormatter json={JSON.stringify(result?.resultData)} />
                          </Tab>
                        </Tabs>
                      </div>
                    ) : (
                      ""
                    )}

                    {/* </div> */}
                  </div>
                </>
              ) : (
                <>
                  <div className="container">
                    <h3 className="my-3 result-title">Model results</h3>
                    <div className="text-center my-5">
                      <div>
                        <p className="result-default">You will see the results here!</p>
                      </div>
                      <div className=" h-100 d-flex justify-content-center align-items-center ">
                        <img
                          className="mb-2"
                          style={{ width: "82px", height: "95px" }}
                          src="/images/brain-icon.svg"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};
export default signatureDetection;
