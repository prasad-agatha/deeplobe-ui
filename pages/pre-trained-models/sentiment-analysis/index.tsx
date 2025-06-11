// **************** Internal ************************

// React internal imports
import React, { FC, useState } from "react";
// Components

// Deeplobe layout import
import MainLayout from "layouts/MainLayout";
// Common function
import { SampleCodeAccordion } from "components/accordion"; //Shimmer effect
import { ShimmerThumbnail } from "react-shimmer-effects";
//service
import PRETRAINEDService from "services/pre-trained.services";

import { ProgressBar, Spinner } from "react-bootstrap";
// toasts
import { toast } from "react-toastify";
import Link from "next/link";
//toast configuration
toast.configure();
//service object initialization
const pretrainedService = new PRETRAINEDService();

const sentimentalAnalysis: FC = () => {
  // Predicted result storage
  const [result, setResult] = useState({}) as any;
  // Submit button manipulation
  const [submit, setSubmit] = useState(false);
  // Loader manipulation
  const [loading, setLoading] = useState(false);
  // Input test is stored here
  const [text, setText] = useState("");

  // Reset to default page
  const resetAll = (e) => {
    setText("");
    setResult({} as any);
    setSubmit(false);
  };
  // Html designed code goes here
  return (
    <>
      <MainLayout>
        <div className="">
          <div className="row mx-5 mt-5">
            <Link href="/pre-trained-models">
              <a>
                <p className="text-primary font-14" style={{ cursor: "pointer" }}>
                  &#60; Back to pre-trained models
                </p>
              </a>
            </Link>

            <div className="card border-0 p-3 bg-white">
              <div className="">
                <h4 className="page-title ms-3">Sentiment analysis</h4>
              </div>
            </div>
            <hr className="mb-0" style={{ color: "#E4E4E4" }} />
            <div className="card border-0 bg-white pb-3">
              <div className="my-2 mx-4 page-content">
                <p className="mb-3">
                  Understand and analyze the tone and sentiment conveyed within written text.
                  Copy-paste text in the box below and click "Run model". Our API will provide
                  analysis and will interpret positive, neutral, or negative sentiment.
                </p>
                <SampleCodeAccordion
                  isPretrained={true}
                  isImageInput={false}
                  url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_sentimental_analysis`}
                  url2={``}
                  url3={``}
                  modelName={"sentimental-analysis"}
                  content_type="application/json"
                  curl_payload='&#123;"text" &#58; "sample text"&#125;'
                  nodejs_payload="&#123;'text' &#58; 'sample text'&#125; "
                  python_payload="&#123;&#34;text&#34; &#58; &#34;sample text&#34;&#125;"
                  data_format="text"
                  number_of_files={1}
                />
                {/* <div className="block-background p-3 ">
                  <Accordion defaultActiveKey="1" activeKey={activeKey}>
                    <Card className="border-0">
                      <Card.Header className="block-background" style={{ border: "None" }}>
                        <Accordion.Toggle
                          eventKey="0"
                          className="border-0 font-inter font-12 w-100 text-start"
                          style={{ background: "None" }}
                          onClick={() => {
                            if (activeKey == "1") {
                              setActiveKey("0");
                            } else {
                              setActiveKey("1");
                            }
                          }}
                        >
                          Sample Code{" "}
                          <img
                            className="ms-3"
                            src={`/images/${activeKey === "1" ? "down" : "up"}-arrow-key.svg`}
                          />
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body style={{ borderRadius: "12px", backgroundColor: "#040213" }}>
                          <div style={{ backgroundColor: "#1E1E1E", borderRadius: "8px" }}>
                            <p className="text-light ps-3 font-14 font-weight-600 py-2">Curl</p>
                          </div>
                          <div className="d-flex">
                            <div>
                              <div className="d-flex my-0">
                                <small className="me-3 my-0" style={{ color: "#86939F" }}>
                                  1
                                </small>
                                <p className="text-light my-0 font-mono font-weight-400">
                                  CURL -X POST \
                                </p>
                              </div>
                              <div className="d-flex my-0">
                                <small className="me-3 my-0" style={{ color: "#86939F" }}>
                                  2
                                </small>
                                <p className="text-light my-0 font-mono font-weight-400">
                                  -H "Content-Type:application/json" \{" "}
                                </p>
                              </div>
                              <div className="d-flex my-0">
                                <small className="me-3 my-0" style={{ color: "#86939F" }}>
                                  3
                                </small>
                                <p className="text-light my-0 font-mono font-weight-400">
                                  -H “API_KEY: REPLACE_API_KEY” \
                                </p>
                              </div>
                              <div className="d-flex my-0">
                                <small className="me-3 my-0" style={{ color: "#86939F" }}>
                                  4
                                </small>
                                <p className="text-light my-0 font-mono font-weight-400">{`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_sentimental_analysis`}</p>
                              </div>
                            </div>
                            <img
                              src="/images/copy-icon2.svg"
                              alt="copy-icon"
                              className="ms-auto"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                copyToClipBoard(
                                  ` CURL -X POST \\ 
                                -H "Content-Type:application/json" \\ 
                                -H “API_KEY: REPLACE_API_KEY” \\
                                ${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_sentimental_analysis
                             `
                                );
                                // alert("Copied!");
                                toast.success("Copied!");
                              }}
                            />
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </div> */}
                <textarea
                  className="w-100 analysis-text-area form-control mt-3"
                  placeholder="Enter your text here"
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                  autoFocus
                />
              </div>
              <div className="d-flex flex-wrap py-5 mx-4 gap-3 justify-content-center">
                <button
                  className="btn btn-outline-primary  model-buttons"
                  onClick={() => {
                    if (!loading) {
                      if (text.trim().length > 0) {
                        setLoading(true);
                        setSubmit(true);
                        pretrainedService
                          .sentimentalAnalysis({ text })
                          .then((res) => {
                            setResult({
                              ...result,
                              positive: res[0].POSITIVE,
                              positive_percentage: Number(res[0].POSITIVE) * 100,
                              negative: res[0].NEGATIVE,
                              negative_percentage: Number(res[0].NEGATIVE) * 100,
                            });
                            setLoading(false);
                          })
                          .catch((err) => {
                            toast.error("Something went wrong");
                            setLoading(false);
                          });
                      } else {
                        toast.error("Empty values are not accepted");
                      }
                    }
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
                <div className="container">
                  <h4 className="my-2 result-title">Model results</h4>
                  {loading ? (
                    <div>
                      {[...Array(2)].map((e: any, id: any) => (
                        <div key={id}>
                          <div className="align-items-center">
                            <ShimmerThumbnail height={20} width={50} rounded />
                          </div>

                          <div className="row align-items-start">
                            <div className="col-7 col-sm-7 col-lg-4 me-2 ">
                              <ShimmerThumbnail height={15} className="" rounded />
                            </div>

                            <div className="col-3 col-sm-3 col-lg-1">
                              <ShimmerThumbnail height={15} rounded />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="my-3">
                      <h5 className="text-start font-inter result-content">Positive</h5>
                      <div className="d-flex row">
                        <div className="d-flex align-items-center">
                          <ProgressBar
                            className="my-0 mb-0"
                            now={result.positive_percentage}
                            style={{ width: "302px", height: "10px", borderRadius: "10px" }}
                          />
                          <p className="my-0 mx-3 page-content">
                            {(parseFloat(result.positive) * 100).toFixed(3)}
                          </p>
                        </div>
                      </div>

                      <h5 className="mt-3 text-start font-inter result-content">Negative</h5>
                      <div className="d-flex align-items-center">
                        <ProgressBar
                          className="my-0"
                          variant="danger"
                          now={result.negative_percentage}
                          style={{ width: "302px", height: "10px", borderRadius: "10px" }}
                        />
                        <p className="my-0 mx-3 page-content">
                          {(parseFloat(result.negative) * 100).toFixed(3)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
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
export default sentimentalAnalysis;
