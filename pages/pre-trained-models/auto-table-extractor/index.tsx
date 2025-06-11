import React, { FC, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { Document, Page, pdfjs } from "react-pdf";
import { ShimmerThumbnail } from "react-shimmer-effects";
import { Spinner } from "react-bootstrap";

import MainLayout from "layouts/MainLayout";
import { SampleCodeAccordion } from "components/accordion";
import AutoTableExtractorDropZone from "@components/dropzone/AutoTableExtractorDropZone";
import PRETRAINEDService from "services/pre-trained.services";

import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
//toast configuration
toast.configure();

//service object initialization
const pretrainedService = new PRETRAINEDService();

const AutoTableExtractor: FC = () => {
  // Submit button manipulation
  const [submit, setSubmit] = useState(false);
  const [actualFile, setActualFile] = useState<any>(null);

  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [result, setResult] = useState<any>([]);
  const [numPages, setNumPages] = useState(null);
  const [shimmer_effect, setShimmer_effect] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const run_model_function = () => {
    if (!shimmer_effect) {
      if (actualFile) {
        setShimmer_effect(true);
        setSubmit(true);
        const formdata = new FormData();
        formdata.append("file", actualFile);
        pretrainedService
          .tableExtractor(formdata)
          .then((res) => {
            const tempArr: any = [];
            (res?.results || []).map((e) => {
              Object.entries(e).map(([k, v]: any) => {
                if (Array.from(v).length > 0) {
                  v.map((el) => {
                    Object.entries(el).map(([ke, va]: any) => {
                      if (Array.from(va).length > 0) {
                        tempArr.push({ [`${k}-${ke}`]: va });
                      }
                    });
                  });
                }
              });
            });
            setFileType(!actualFile.type.includes("image") ? "pdf" : "image");
            setResult(tempArr);
            setFileUrl(res?.s3_url);
          })
          .catch(() => {
            toast.error("Something went wrong");
            setSubmit(false);
          })
          .finally(() => {
            setShimmer_effect(false);
          });
      } else {
        toast.error("please select file");
      }
    }
  };

  // Reset to default page
  const resetAll = (e) => {
    setActualFile(null);
    setFileUrl("");
    setResult([]);
    setSubmit(false);
  };

  const customStyles = {
    rows: {
      style: {
        fontSize: "12px", // override the row height
      },
    },
    table: {
      style: {
        minHeight: "0px !important",
      },
    },

    cells: {
      style: {
        "&:first-child": {
          minWidth: "50px",
          maxWidth: "50px",
        },
        padding: "5px",
      },
    },
  };
  // Html designed code goes here

  const loadColumns: any = [
    {
      cell: () => (
        <div className="w-100 my-2">
          <ShimmerThumbnail height={25} className="mb-0 w-100" rounded />
        </div>
      ),
      width: "50px",
    },

    {
      cell: () => (
        <div className="w-100 my-2">
          <ShimmerThumbnail height={25} className="mb-0 w-100" rounded />
        </div>
      ),
      width: "190px",
    },
    {
      cell: () => (
        <div className="w-100 my-2">
          <ShimmerThumbnail height={25} className="mb-0 w-100" rounded />
        </div>
      ),
      width: "190px",
    },
    {
      cell: () => (
        <div className="w-100 my-2">
          <ShimmerThumbnail height={25} className="mb-0 w-100" rounded />
        </div>
      ),
      width: "190px",
    },
  ];
  const getColumns = (v: any) => {
    const columns = [];
    Object.keys(v[0]).map((e) => {
      if (e !== "id")
        columns.push({
          name: e,
          cell: (row) => (
            <div className="py-0">
              <input readOnly className="not-first-col" value={row[e]} />
            </div>
          ),
        });
    });
    return columns.length > 0
      ? [
          {
            name: "id",
            cell: (row, id) => <div className="first-col rounded">{id === 0 ? "#" : id}</div>,
          },
          ...columns,
        ]
      : columns;
  };

  return (
    <>
      <MainLayout>
        <div className="">
          <div className="row mx-5 mt-5">
            <Link href="/pre-trained-models">
              <a>
                <p className="back-to-pretrained-text" style={{ cursor: "pointer" }}>
                  &#60; Back to pre-trained models
                </p>
              </a>
            </Link>
            <div className="card border-0 p-3 bg-white">
              <div className="">
                <h4 className="page-title ms-3">Auto-table extractor</h4>
              </div>
            </div>
            <hr className="mb-0" style={{ color: "#E4E4E4" }} />
            <div className="card border-0 bg-white pb-3">
              <div className="my-2 mx-4 page-content">
                <div className="py-3">
                  <p className="">
                    Auto table extraction model to identify table structures and extract the data
                    from unstructured pdf documents.
                  </p>
                  <SampleCodeAccordion
                    isPretrained={true}
                    isImageInput={false}
                    url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_table_extraction`}
                    url2={``}
                    url3={``}
                    modelName={"table-extractor"}
                    content_type="application/json"
                    curl_payload="file=@file.pdf"
                    // nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/image_url'&#93;&#125;"
                    nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/pdf_url'&#93;&#125;"
                    python_payload="&#123;'file' &#58; open&#40;'file.pdf','rb'&#41;&#125;"
                    data_format="formdata"
                    number_of_files={1}
                  />
                </div>

                <div className="block-background container p-3">
                  <div className="form-group ">
                    <div>
                      <AutoTableExtractorDropZone
                        setActualFile={setActualFile}
                        maxNumberOfFiles={1}
                        acceptedFileExtention={[
                          "application/pdf",
                          "image/jpeg",
                          "image/png",
                          "image/jpg",
                        ]}
                      />

                      {actualFile ? (
                        <div className="d-flex border border-white rounded bg-white align-items-center text-center mt-2 px-2 py-3   justify-content-between">
                          <div className="d-flex align-items-center w-80">
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
                            <span
                              className="p-0 text-muted text-truncate ms-2"
                              style={{ maxWidth: "40%" }}
                            >
                              {actualFile?.path}
                            </span>
                            <span className="p-0 text-muted">
                              {" "}
                              -{Math.ceil(actualFile?.size / 1024).toFixed(0)}kb
                            </span>
                          </div>
                          <div style={{ cursor: "pointer" }} onClick={resetAll}>
                            <img src="/images/delete-icon.svg" alt="delete-icon" />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-wrap py-5 gap-3 justify-content-center">
                  <div>
                    <button
                      className="btn btn-outline-primary  model-buttons"
                      onClick={run_model_function}
                    >
                      {shimmer_effect && (
                        <Spinner
                          animation="border"
                          className="me-2"
                          style={{ width: "1em", height: "1em" }}
                        />
                      )}
                      Run model
                    </button>
                  </div>
                  <div>
                    <button
                      className="btn btn-link text-decoration-none  model-buttons"
                      onClick={resetAll}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              <hr className="mb-0" style={{ color: "#E4E4E4" }} />
              <div className="card border-0 bg-white">
                {submit ? (
                  <div className="container p-4">
                    <h4 className="result-title">Model results</h4>

                    <div className="d-flex row justify-content-around">
                      <div className="col-12 col-xl-6">
                        <p className="result-title mt-4">Uploaded file</p>
                        {shimmer_effect ? (
                          <ShimmerThumbnail height={350} rounded />
                        ) : (
                          <>
                            {fileType === "image" ? (
                              <img src={fileUrl} alt="-" className="img-fluid" />
                            ) : (
                              <div className="pdf-div">
                                <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
                                  {Array.apply(null, Array(numPages))
                                    .map((x, i) => i + 1)
                                    .map((page, id) => (
                                      <Page key={id} pageNumber={page} renderTextLayer={false} />
                                    ))}
                                </Document>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <div className="col-12 col-xl-6">
                        <p className="result-title my-4">Extracted tables</p>

                        <>
                          {shimmer_effect ? (
                            <DataTable
                              className="output-shimmer-table"
                              columns={loadColumns}
                              data={[
                                { col: "1" },
                                { col: "1" },
                                { col: "1" },
                                { col: "1" },
                                { col: "1" },
                              ]}
                              noTableHead={true}
                              style={{ overflow: "hide" }}
                            />
                          ) : (
                            <>
                              {result.length > 0 ? (
                                result.map((e: any) =>
                                  Object.entries(e).map(([k, v]: any, id: any) => (
                                    <div key={id} className="py-2">
                                      <h6 className="fw-bold">{k}</h6>

                                      <DataTable
                                        className="output-table"
                                        columns={getColumns(v)}
                                        data={v}
                                        noTableHead={true}
                                        customStyles={customStyles}
                                      />
                                    </div>
                                  ))
                                )
                              ) : (
                                <>Tables not found</>
                              )}
                            </>
                          )}
                        </>
                      </div>
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
        </div>
      </MainLayout>
    </>
  );
};
export default AutoTableExtractor;
