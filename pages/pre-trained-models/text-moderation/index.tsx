// **************** Internal ************************

// React internal imports
import React, { FC, useState } from "react";

// Components

// Deeplobe layout import
import MainLayout from "layouts/MainLayout";
// Common function
import { SampleCodeAccordion } from "components/accordion";
//Shimmer effect
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

const textModeration: FC = () => {
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
                <h4 className="page-title ms-3">Text moderation</h4>
              </div>
            </div>
            <hr className="mb-0" style={{ color: "#E4E4E4" }} />
            <div className="card border-0 bg-white pb-3">
              <div className="my-2 mx-4 page-content">
                <p className="mb-3">
                  Scan text for content containing profanity, toxic, hate symbols, guns, insult,
                  obscene, threat, or any other unwanted content. Copy-paste the text in the box
                  below and click "Run model". The model will return probability scores if it
                  detects any questionable text.
                </p>
                <SampleCodeAccordion
                  isPretrained={true}
                  isImageInput={false}
                  url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_text_moderation`}
                  url2={``}
                  url3={``}
                  modelName={"text-moderation"}
                  content_type="application/json"
                  curl_payload='&#123;"text" &#58; "sample text"&#125;'
                  nodejs_payload=" &#123;'text' &#58; 'sample text'&#125; "
                  python_payload="&#123;&#34;text&#34; &#58; &#34;sample text&#34;&#125;"
                  data_format="text"
                  number_of_files={1}
                />
                <textarea
                  className="w-100 analysis-text-area form-control mt-3"
                  placeholder="Enter Your Text Here"
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                  autoFocus
                />
              </div>
              <div className="d-flex flex-wrap py-5 gap-3 justify-content-center">
                <button
                  className="btn btn-outline-primary  model-buttons"
                  onClick={() => {
                    if (text.trim().length > 0) {
                      setLoading(true);
                      setSubmit(true);
                      pretrainedService
                        .textModeration({ text: [text] })
                        .then((res) => {
                          // setResult(res.response);
                          setResult({
                            ...result,
                            hate: res[0].HATE,
                            hate_percentage: Number(res[0].HATE) * 100,
                            non_hate: res[0].NON_HATE,
                            non_hate_percentage: Number(res[0].NON_HATE) * 100,
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
                  <h4 className="my-3 result-title">Model results</h4>
                  {loading ? (
                    <div>
                      {[...Array(2)].map((e: any, id: any) => (
                        <div key={id}>
                          <ShimmerThumbnail height={30} width={50} rounded />

                          <div className="d-flex row">
                            <div className="d-flex align-items-center">
                              <ShimmerThumbnail height={20} width={300} className="me-3" rounded />

                              <ShimmerThumbnail height={20} width={50} rounded />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <h5 className="text-start mt-3 font-inter result-content">Hate</h5>
                      <div className="d-flex row">
                        <div className="d-flex align-items-center">
                          <ProgressBar
                            className="my-0 mb-0"
                            variant="danger"
                            now={result.hate_percentage}
                            // style={{ width: "302px", height: "10px", borderRadius: "10px" }}
                          />
                          <p className="my-0 mx-3 page-content">
                            {(parseFloat(result.hate) * 100).toFixed(3)}
                          </p>
                        </div>
                      </div>
                      <h5 className="text-start mt-3 font-inter result-content">Non Hate</h5>
                      <div className="d-flex align-items-center">
                        <ProgressBar
                          now={result.non_hate_percentage}
                          // style={{ width: "302px", height: "10px", borderRadius: "10px" }}
                        />
                        <p className="mx-3 mb-0 page-content">
                          {(parseFloat(result.non_hate) * 100).toFixed(3)}
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
export default textModeration;
