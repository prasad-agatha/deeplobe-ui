// **************** Internal ************************

// React internal imports
import React, { FC, useState } from "react";
import dynamic from "next/dynamic";
// Deeplobe layout import
import MainLayout from "layouts/MainLayout";

//service
import PRETRAINEDService from "services/pre-trained.services";

import { Spinner } from "react-bootstrap";
// toasts
import { toast } from "react-toastify";
import Link from "next/link";
import ExtractorDropzone from "@components/dropzone/ExtractorDropZone";
import { ShimmerThumbnail } from "react-shimmer-effects";
import SampleCodeAccordian from "@components/accordion/sample_code";
const PdfViewer = dynamic(() => import("components/pdfViewer/PdfViewer"), {
  ssr: false,
});

//toast configuration
toast.configure();

//service object initialization
const pretrainedService = new PRETRAINEDService();

const textModeration: FC = () => {
  // Predicted result storage
  const [result, setResult] = useState([]) as any;
  // Submit button manipulation
  const [submit, setSubmit] = useState(false);
  // Loader manipulation
  const [loading, setLoading] = useState(false);
  // Input test is stored here
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [item, setItem] = useState({ item: null } as any);
  const [selectedUploadType, setSelectedUploadType] = useState("upload-file");
  const [numPages, setNumPages] = useState(null);
  const [activeKey, setActiveKey] = React.useState("0");
  const [hightLights, setHightLights] = React.useState([] as any);
  const [toggle, setToggle] = useState(false);
  console.log(activeKey, "activekey");

  const dataExtarct = async () => {
    if (selectedUploadType === "upload-file" && !item?.item) {
      toast.error("Please upload file");
      return;
    }
    setLoading(true);
    setSubmit(true);
    const formData = new FormData();

    if (selectedUploadType === "upload-file") formData.append("file", item.item);
    else if (selectedUploadType === "text-area") {
      formData.append("file", new Blob([text], { type: "text/palin" }), "extract.txt");
    }

    pretrainedService
      .piiExtractor(formData)
      .then(async (res) => {
        const temp = {};
        const tempHighlights = [];
        res.coordinate.map((e: any) => {
          const name = e.entity_name;
          const { page, text, x1, x2, y1, y2 } = e;
          const pageNumber = page + 1;
          const height = y1 - y2 > 0 ? y1 - y2 : y2 - y1;
          const width = x1 - x2 > 0 ? x1 - x2 : x2 - x1;
          const id =
            `${x1}`.replace(".", "") +
            `${y1}`.replace(".", "") +
            `${x2}`.replace(".", "") +
            `${y2}`.replace(".", "");

          tempHighlights.push({
            content: { text },
            comment: {
              text,
              emoji: "",
              id,
            },
            position: {
              boundingRect: { height, width, pageNumber, x1, x2, y1, y2 },
              rects: [{ height, width, pageNumber, x1, x2, y1, y2 }],
              pageNumber,
            },
            id,
          });

          if (temp[name]) {
            temp[name] = [...temp[name], { pageNumber, text, x1, x2, y1, y2 }];
          } else {
            temp[name] = [{ pageNumber, text, x1, x2, y1, y2 }];
          }
        });

        setResult(temp);
        setHightLights(tempHighlights);
        setUrl(res.s3_url);

        setLoading(false);
        if (selectedUploadType === "text-area")
          setItem({
            type: "text/plain",
            url: text,
            item: null,
          });
      })
      .catch((err) => {
        toast.error("Something went wrong");
        setLoading(false);
        setSubmit(false);
      });
    // setLoading(false);
    // setSubmit(false);
  };

  // Reset to default page
  const resetAll = (e) => {
    setText("");
    setResult({} as any);
    setSubmit(false);
    setItem({
      item: null,
    });
  };
  // Html designed code goes here
  return (
    <>
      <MainLayout>
        <div className="">
          <div className="row mx-5 mt-5">
            <Link href="/pre-trained-models">
              <a>
                <p className="text-primary" style={{ cursor: "pointer" }}>
                  &#60; Back to pre-trained models
                </p>
              </a>
            </Link>
            <div className="card border-0 p-3 bg-white">
              <div className="">
                <h4 className="page-title ms-3">PII Entity Density Detector</h4>
              </div>
            </div>
            <hr className="mb-0" style={{ color: "#E4E4E4" }} />
            <div className="card border-0 bg-white pb-3">
              <div className="my-2 mx-4 page-content">
                <div className="py-3">
                  <p className="mb-3">
                    Automatically identify and extract personally identifiable information (PII)
                    like email ids, passwords, credit cards numbers, social security numbers, etc
                    from unstructured data.
                  </p>
                  <SampleCodeAccordian
                    isPretrained={true}
                    isImageInput={false}
                    url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_pii_extraction`}
                    url2={``}
                    url3={``}
                    modelName={"pii-data-extractor"}
                    content_type="application/json"
                    curl_payload="file=@file.pdf"
                    nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/pdf_url'&#93;&#125;"
                    python_payload="&#123;'file' &#58; open&#40;'file.pdf','rb'&#41;&#125;"
                    data_format="formdata"
                    number_of_files={1}
                  />
                </div>

                <div className="block-background container p-3">
                  <div className="d-flex flex-wrap gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        checked={selectedUploadType === "upload-file" ? true : false}
                        onChange={() => {
                          setSelectedUploadType("upload-file");
                          setItem(false);
                        }}
                      />
                      <label className="form-check-label page-content">Upload File</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        checked={selectedUploadType === "text-area" ? true : false}
                        onChange={() => {
                          setSelectedUploadType("text-area");
                          setText("");
                        }}
                      />
                      <label className="form-check-label page-content">Enter Text</label>
                    </div>
                  </div>
                  <div className="form-group mt-3">
                    {selectedUploadType === "upload-file" ? (
                      <>
                        <div>
                          <ExtractorDropzone
                            setItem={setItem}
                            maxNumberOfFiles={1}
                            acceptedFileExtention={["text/plain", "application/pdf"]}
                          />
                        </div>
                        {item?.item ? (
                          <div className="d-flex border border-white rounded bg-white align-items-center text-center mt-2 px-2 py-3 w-100">
                            <div style={{ width: "22px" }}>
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
                            </div>
                            <div
                              className="text-start text-muted text-truncate ms-2 "
                              // style={{ maxWidth: "200px" }}
                            >
                              {item?.item.path}
                            </div>
                            <div className="text-muted text-nowrap me-3">
                              - {Math.ceil(item?.item.size / 1024).toFixed(0)}kb
                            </div>

                            <div
                              className="ms-auto cursor-pointer"
                              onClick={() => setItem({ item: null })}
                            >
                              <img src="/images/delete-icon.svg" alt="delete-icon" />
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                    {selectedUploadType === "text-area" ? (
                      <div className="p-2">
                        <textarea
                          className="w-100 analysis-text-area form-control mt-3"
                          placeholder="Enter Your Text Here"
                          onChange={(e) => setText(e.target.value)}
                          value={text}
                          autoFocus
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="d-flex flex-wrap mx-4 py-5 gap-3 justify-content-center">
                <button className="btn btn-outline-primary  model-buttons" onClick={dataExtarct}>
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
                <div className="container p-4">
                  <h4 className="result-title">Model results</h4>
                  {/* {loading ? (
                    <ShimmerThumbnail height={60} width={550} rounded />
                  ) : (
                    <div className="res-b flex-wrap px-3 py-2">
                      <h4 className="result-title">Model results</h4>

                      <button className="btn btn-outline-primary" type="button">
                        Download as Excel
                      </button>
                    </div>
                  )} */}
                  <div>
                    <>
                      {loading ? (
                        <ShimmerThumbnail className="my-2" height={40} width={220} rounded />
                      ) : (
                        <p className="result-title my-4 text-nowrap d-flex">
                          <u>PII Entities</u>
                          {/* {!loading ? (
                            <div className="ms-auto" onClick={() => setToggle(false)}>
                              Preview
                            </div>
                          ) : (
                            <></>
                          )} */}
                        </p>
                      )}
                      {loading ? (
                        <div className="row flex-grow-1">
                          <div className={"col-12 col-xl-4"}>
                            <p className="mb-0">
                              <ShimmerThumbnail height={40} rounded />
                            </p>
                            <p className="mb-0">
                              <ShimmerThumbnail height={40} rounded />
                            </p>
                            <p className="mb-0">
                              <ShimmerThumbnail height={40} rounded />
                            </p>
                            <p className="mb-0">
                              <ShimmerThumbnail height={40} rounded />
                            </p>
                            <p className="mb-0">
                              <ShimmerThumbnail height={40} rounded />
                            </p>
                          </div>
                          <div className={"col-12 col-xl-8 pt-3 pt-sm-0 ps-2"}>
                            <ShimmerThumbnail height={500} rounded />
                          </div>
                        </div>
                      ) : (
                        <>
                          <PdfViewer
                            url={url}
                            result={result}
                            highlights={hightLights}
                            activeKey={activeKey}
                            setActiveKey={setActiveKey}
                            toggle={toggle}
                            setToggle={setToggle}
                            numPages={numPages}
                            setNumPages={setNumPages}
                          />
                        </>
                      )}
                    </>
                  </div>
                </div>
              ) : (
                <>
                  <div className="container p-4">
                    <h3 className=" result-title">Model results</h3>
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
export default textModeration;
