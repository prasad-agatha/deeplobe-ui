import AnnotationNav from "@components/navigation/AnnotationNav";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { OverlayTrigger, ProgressBar, Spinner, Tab, Tabs, Tooltip } from "react-bootstrap";
import { ShimmerThumbnail } from "react-shimmer-effects";
import JsonFormatter from "react-json-formatter";

import Progressbar from "@components/custom_progress_bar/Progressbar";
import { SampleCodeAccordion } from "components/accordion";
import { MyDropzone } from "@components/dropzone";
import { copyToClipBoard, getRandomColor } from "common_functions/functions";
import ObjDetectionDropzone from "@components/dropzone/ObjDetectionDropZone";

import ModelTrainService from "services/model.train.service";

const trainService = new ModelTrainService();

const Evaluation = ({ router, user }) => {
  const [details, setDetails] = useState<any>({
    load: true,
    model_name: "",
    annotated_count: 0,
    status: "Draft",
  });
  const { uuid } = router.query;
  const [trainData, setTrainData] = useState<any>({});
  const [selectedImages, setSelectedImages] = useState([] as any);
  const [predictedData, setPredictedData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [key, setKey] = useState("Labels");

  useEffect(() => {
    const getDetails = (uuid) =>
      trainService
        .getModelDetails(uuid)
        .then((res) => {
          if (!res.extra) {
            toast.error("Train model to evaluate");
            router.replace(router.pathname.replace("[uuid]", router.query.uuid) + `?train#top`);
          } else {
            if (
              router.query.evaluate.includes("https://deeplobe-ai.s3.amazonaws.com/") ||
              router.query.evaluate.includes(
                "https://s3-ap-south-1.amazonaws.com/deeplobe-ai/prediction-"
              )
            )
              setSubmit(true);
            setDetails({
              load: false,
              model_name: res.name,
              id: res.id,
              annotated_count: 1,
              status: res.status,
            });
            setTrainData(res);
          }
        })
        .catch((e) => {
          toast.error(e);
          router.replace("/my-models");
        });
    if (uuid && uuid !== "") {
      getDetails(uuid);
    }
  }, [uuid]);

  const getString = (data) => {
    return JSON.stringify(data)
      .replace(`{"x1":`, "(")
      .replace(`"y1":`, "")
      .replace(`},{"x2":`, "),(")
      .replace(`"y2":`, "")
      .replace(`},{"x3":`, "),(")
      .replace(`"y3":`, "")
      .replace(`},{"x4":`, "),(")
      .replace(`"y4":`, "")
      .replace(`}`, ")");
  };

  const predictPageUpdate = (predictedResult) => {
    let formattedResult = [];
    const barColours = ["#507B58", "#799163", "#EDE0A6", "#F0A087", "#AB3131", "#540202"];
    if (trainData.model_type === "segmentation") {
      const data = {} as any;
      data.inputImage = predictedResult.input_images;
      data.outputImage = predictedResult.result.image;
      data.jsonData = predictedResult.result.json;
      formattedResult.push(data);
    } else if (trainData.model_type === "instance") {
      const data = {} as any;
      data.inputImage = predictedResult.input_images;
      data.outputImage = predictedResult.result.image;

      data.jsonData = predictedResult.result.json;
      formattedResult.push(data);
    } else if (trainData.model_type === "classification") {
      const temp = [];
      for (let [index, res] of predictedResult.result.result.entries()) {
        const data = {} as any;
        data.id = index + 1;
        data.tag = res[0];
        data.confidenceValue = parseFloat(res[1]).toFixed(3);
        data.confidenceScore = Math.round(res[1] * 100);
        data.barColor = getRandomColor();
        data.inputImageURL = predictedResult.input_images;
        temp.push(data);
      }
      const leastConfidence = temp.pop();
      leastConfidence.barColor = barColours.pop();
      temp.map((data, index) => {
        if (barColours[index] !== undefined) {
          data.barColor = barColours[index];
        }
      });
      formattedResult = temp;
      formattedResult.push(leastConfidence);
    } else if (["object_detection", "ocr"].includes(trainData.model_type)) {
      const data = {} as any;
      data.inputImage = predictedResult.input_images;
      data.outputImage = predictedResult.result.image;
      data.jsonData = predictedResult.result.json;
      formattedResult.push(data);
    }
    setPredictedData(formattedResult);
    setLoading(false);
  };

  const predictWithSingleInput = () => {
    if (loading) return;
    if (
      router.query.evaluate.includes("https://deeplobe-ai.s3.amazonaws.com/") ||
      router.query.evaluate.includes("https://s3-ap-south-1.amazonaws.com/deeplobe-ai/prediction-")
    ) {
      router.replace(router.pathname.replace("[uuid]", router.query.uuid) + `?evaluate#top`);
    }
    if (selectedImages.length > 0) {
      setLoading(true);
      setSubmit(true);
      const formdata = new FormData();
      formdata.append("name[]", selectedImages[0].name);
      formdata.append("asset[]", selectedImages[0], selectedImages[0].name);
      trainService
        .uploadAsset(formdata)
        .then((res) => {
          trainService
            .predictModel(details?.id, { input_url: res[0].asset })
            .then((predictedResult) => {
              if (
                trainData.model_type === "object_detection" &&
                selectedImages[0].type.includes("video")
              ) {
                setSubmit(false);
                setLoading(false);
                toast.success(
                  "Your video is being evaluated. We will notify you via email once it is completed"
                );
              } else predictPageUpdate(predictedResult);
            })
            .catch((e: any) => {
              setSubmit(false);
              setLoading(false);
              toast.error(e?.msg ? e.msg : typeof e === "string" ? e : "Something went wrong");
            });
        })
        .catch((e: any) => {
          setSubmit(false);
          setLoading(false);
          toast.error("Something went wrong");
        });
    } else {
      setLoading(false);
      toast.error("Please upload image to predict");
    }
  };
  const predictWithMultipleInput = () => {
    if (loading) return;
    if (selectedImages.length > 1) {
      setLoading(true);
      setSubmit(true);
      const formdata = new FormData();
      selectedImages.map((ele, id) => {
        formdata.append("name[]", selectedImages[id].name);
        formdata.append("asset[]", selectedImages[id], selectedImages[id].name);
      });
      // formdata.append("name[]", selectedImages[0].name);
      // formdata.append("asset[]", selectedImages[0], selectedImages[0].name);
      // formdata.append("name[]", selectedImages[1].name);
      // formdata.append("asset[]", selectedImages[1], selectedImages[1].name);
      trainService.uploadAsset(formdata).then((res) => {
        trainService
          .predictModel(details?.id, { input_url: res.map((ele) => ele.asset) })
          .then((res) => {
            const resultData = {
              image1: res.result.result.image1,
              image2: res.result.result.image2,
              similarityScore: res.result.result.similarity_score,
            };
            setPredictedData([resultData]);
            setLoading(false);
          })
          .catch((e: any) => {
            setSubmit(false);
            toast.error("Something went wrong");
          });
      });
    } else {
      toast.error("Please upload 2 images to predict");
    }
  };
  const modelResult = () => (
    <>
      {predictedData[0]?.jsonData.map((ele: any, idx: any) => {
        return (
          <div key={idx}>
            <div className="d-flex flex-column flex-md-row align-items-md-center mb-2">
              <div>
                <span
                  className="labels  text-white my-md-0"
                  style={{
                    background:
                      trainData.model_type === "segmentation"
                        ? ele.color_mask
                        : trainData.model_type === "ocr"
                        ? "#6152d9"
                        : ele.color,
                  }}
                >
                  {(ele.label || "").replaceAll("_", " ")}
                </span>
                {["ocr"].includes(trainData.model_type) && (
                  <span className="values"> &nbsp;{ele.value.replaceAll("_", " ")}</span>
                )}
              </div>
              {trainData.model_type === "segmentation" ? null : (
                <div className="d-flex flex-nowrap align-items-center w-100 ms-auto ms-md-3">
                  <ProgressBar
                    now={
                      typeof ele.predicted_score !== "number"
                        ? ele.predicted_score[0]
                        : ele.predicted_score
                    }
                    min={0}
                    max={1}
                    className="d-inline-flex me-3"
                  />
                  <span className="fs-12">
                    {typeof ele.predicted_score !== "number"
                      ? ele.predicted_score[0].toFixed(3)
                      : ele.predicted_score.toFixed(3)}
                  </span>
                </div>
              )}
            </div>
            {trainData.model_type === "segmentation" ? null : (
              <h6 className="mb-3" style={{ letterSpacing: "1px" }}>
                {/* {getString(ele.coordinates)} */}
                {trainData.model_type === "instance" ? getString(ele.coordinates) : ele.coordinates}
              </h6>
            )}
          </div>
        );
      })}
    </>
  );

  const copy = (ele: any) => {
    navigator.clipboard.writeText(ele);
  };

  // Reset to default page
  const resetAll = (e) => {
    setPredictedData({} as any);
    setSubmit(false);
    setSelectedImages([]);
    setLoading(false);
    if (
      router.query.evaluate.includes("https://deeplobe-ai.s3.amazonaws.com/") ||
      router.query.evaluate.includes("https://s3-ap-south-1.amazonaws.com/deeplobe-ai/prediction-")
    ) {
      router.replace(router.pathname.replace("[uuid]", router.query.uuid) + `?evaluate#top`);
    }
  };

  const changeImage = (path: any) => router.replace(path);

  return (
    <div className="mainc container-fluid" id="top">
      <div className="border border-light rounded bg-white mb-5 p-4">
        <AnnotationNav {...{ user, router, changeImage, details }} />
        <hr id="divider" style={{ marginTop: "6px", marginBottom: "6px" }} />

        <div className="">
          <>
            <p className="font-16">Analyse &amp; validate</p>
            <div className="d-flex block-background p-4 justify-content-around">
              <div className=" text-center">
                <p className="p-0 m-0">Model id</p>
                {!trainData.uuid ? (
                  <ShimmerThumbnail height={25} width={175} rounded />
                ) : (
                  <p className="text-blue p-0 m-0">
                    {trainData.uuid}
                    <img
                      src="/images/copy-icon.svg"
                      alt="copy-icon"
                      className="mb-0 mx-2"
                      onClick={() => {
                        copyToClipBoard(trainData.uuid);
                        // alert("Copied!");
                        toast.success("Copied!");
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </p>
                )}
              </div>
              {trainData.model_type !== "image_similarity" ? (
                <>
                  <div className="vr"></div>
                  <div className="text-center">
                    <p className="p-0 m-0">
                      {trainData.model_type === "segmentation"
                        ? "Mean intersection over union"
                        : trainData.model_type === "object_detection"
                        ? "Intersection Over Union"
                        : trainData.model_type === "instance"
                        ? "Mean average precision"
                        : "Accuracy"}
                    </p>
                    {!trainData.model_type ? (
                      <div className="shimmer-div">
                        {" "}
                        <ShimmerThumbnail height={25} width={75} rounded />
                      </div>
                    ) : (
                      <p className="text-blue p-0 m-0">
                        {trainData.model_type === "classification"
                          ? `${(trainData.extra * 100).toFixed(2)} %`
                          : trainData.model_type === "ocr"
                          ? `${(trainData.extra.result.accuracy * 100).toFixed(2)} %`
                          : trainData.model_type === "segmentation"
                          ? `${(trainData.extra[0]["Mean IOU:"] * 100).toFixed(2)} %`
                          : trainData.model_type === "object_detection"
                          ? `${(trainData.extra[0].test_iou * 100).toFixed(2)} %`
                          : trainData.model_type === "instance"
                          ? `${(trainData.extra[0].map * 100).toFixed(2)} %`
                          : "-"}
                      </p>
                    )}
                  </div>
                </>
              ) : null}
              {trainData.model_type === "ocr" ? (
                <>
                  <div className="vr"></div>
                  <div className="text-center">
                    <p className="p-0 m-0">Recall score </p>
                    <p className="text-blue p-0 m-0">
                      {trainData ? `${(trainData.extra.result.recall * 100).toFixed(2)} %` : "-"}
                    </p>
                  </div>
                </>
              ) : null}
              {trainData.model_type === "ocr" ? (
                <>
                  <div className="vr"></div>
                  <div className="text-center">
                    <p className="p-0 m-0">Precision</p>
                    <p className="text-blue p-0 m-0">
                      {trainData.model_type === "ocr"
                        ? `${(trainData.extra.result.precision * 100).toFixed(2)} %`
                        : "-"}
                    </p>
                  </div>
                </>
              ) : null}
              {trainData.model_type === "ocr" ? (
                <>
                  <div className="vr"></div>
                  <div className="text-center">
                    <p className="p-0 m-0">F1 score</p>
                    <p className="text-blue p-0 m-0">
                      {trainData.model_type === "ocr"
                        ? `${(trainData.extra.result.f1 * 100).toFixed(2)} %`
                        : "-"}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
            {trainData.model_type === "image_similarity" ? (
              <>
                <SampleCodeAccordion
                  isPretrained={false}
                  isImageInput={false}
                  url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/aimodels/`}
                  url2={`${trainData.id}`}
                  url3={`/prediction`}
                  content_type="application/json"
                  curl_payload='&#123;"images" &#58; &#91;"https://example.com/image_url1", "https://example.com/image_url2"&#93;  &#125;'
                  nodejs_payload="&#123;'images' &#58; &#91;'https://example.com/image_url1', 'https://example.com/image_url2'&#93;&#125;"
                  python_payload="&#123;&#34;images&#34; &#58; &#91;&#34;https://example.com/image_url1&#34;, &#34;https://example.com/image_url2&#34;&#93;&#125;"
                  data_format="text"
                  number_of_files={trainData.model_type === "image_similarity" ? 2 : 1}
                  // url={`${process.env.NEXT_PUBLIC_API_SERVER}/api/aimodels/${trainData.id}/prediction`}
                  modelName={`${trainData.model_type}`}
                />
              </>
            ) : (
              <>
                <SampleCodeAccordion
                  isPretrained={false}
                  isImageInput={false}
                  url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/aimodels/`}
                  url2={`${trainData.id}`}
                  url3={`/prediction`}
                  content_type="application/json"
                  curl_payload='&#123;"images" &#58; &#91;"https://example.com/image_url"&#93; &#125;'
                  nodejs_payload="&#123;'images' &#58; &#91;'https://example.com/image_url'&#93; &#125;"
                  python_payload="&#123;&#34;images&#34; &#58; &#91;&#34;https://example.com/image_url&#34;&#93;&#125;"
                  data_format="text"
                  number_of_files={trainData.model_type === "image_similarity" ? 2 : 1}
                  // url={`${process.env.NEXT_PUBLIC_API_SERVER}/api/aimodels/${trainData.id}/prediction`}
                  modelName={`${trainData.model_type}`}
                />
              </>
            )}

            <p className="font-16 mt-2">
              Test the model by uploading the{" "}
              {trainData.model_type === "image_similarity" ? "sample images" : "sample image"}
            </p>
            {!trainData.uuid ? (
              <div className="block-background p-4">
                <div className="dropz">
                  <div className="w-50">
                    <ShimmerThumbnail className="m-0" height={18} />
                  </div>
                  <div className="w-75">
                    <ShimmerThumbnail className="m-0" height={18} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="block-background p-4">
                {trainData?.model_type === "object_detection" ? (
                  <ObjDetectionDropzone
                    setSelectedImages={setSelectedImages}
                    maxNumberOfImages={1}
                    align={true}
                  />
                ) : (
                  <MyDropzone
                    setSelectedImages={setSelectedImages}
                    maxNumberOfImages={trainData?.model_type === "image_similarity" ? 10 : 1}
                    align={true}
                  />
                )}
                {selectedImages.map((img, index) => (
                  <div
                    className="d-flex border border-white rounded bg-white mt-2 px-2 py-3 align-items-center"
                    key={index}
                  >
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
                    </div>
                    <div className=" text-muted text-truncate ms-2">{img.path}</div>
                    <div className="text-muted text-nowrap me-3">
                      &nbsp;- {Math.ceil(img.size / 1024).toFixed(0)}kb
                    </div>
                    <div
                      className="ms-auto cursor-pointer"
                      onClick={() => {
                        const imageArray = selectedImages.filter((item, idx) => index !== idx);
                        setSelectedImages(imageArray);
                      }}
                    >
                      <img src="/images/delete-icon.svg" alt="delete-icon" />
                    </div>
                  </div>
                ))}

                {/* ) : null} */}
              </div>
            )}

            <div className="d-flex justify-content-center my-4 m-0">
              <button
                type="button"
                className="btn btn-primary font-14 font-inter py-3 px-5"
                disabled={!details?.id}
                onClick={
                  trainData?.model_type === "image_similarity"
                    ? predictWithMultipleInput
                    : predictWithSingleInput
                }
              >
                {loading && (
                  <Spinner
                    animation="border"
                    className="me-2"
                    style={{ width: "1em", height: "1em" }}
                  />
                )}
                Test
              </button>
              <button className="btn  btn-sm ms-3 font-inter border-0 me-5" onClick={resetAll}>
                Clear
              </button>
            </div>
            <hr />
            {submit ? (
              <>
                <h3 className="my-3 result-title">Model results</h3>
                {trainData?.model_type === "image_similarity" ? (
                  <>
                    {loading ? (
                      <div>
                        <div className="row justify-content-around mt-3 mb-2 gap-3 gap-xl-0">
                          <div className="col-12 col-xl-6">
                            <ShimmerThumbnail className="mb-1" height={30} width={250} rounded />

                            <div className="d-flex justify-content-center w-100  bg-light  p-3 p-xl-4 shimmer-div">
                              <ShimmerThumbnail height={350} rounded className="d-flex mb-0" />
                            </div>
                          </div>
                          <div className="col-12 col-xl-6">
                            <ShimmerThumbnail className="mb-1" height={30} width={250} rounded />

                            <div className="d-flex justify-content-center w-100  bg-light  p-3 p-xl-4 shimmer-div">
                              <ShimmerThumbnail height={350} rounded className="d-flex mb-0" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="d-flex flex-row mt-4 result-content">
                            <ShimmerThumbnail className="mb-1" height={30} width={250} rounded />
                          </h5>
                        </div>
                      </div>
                    ) : (
                      predictedData?.[0].image2.map((ele, id) => (
                        <div key={id}>
                          <div className="row justify-content-around mt-3 mb-2 gap-3 gap-xl-0">
                            <div className="col-12 col-xl-6">
                              <div className="text-left">
                                <h6 className="mt-2">Image 1</h6>
                              </div>
                              <div className="d-flex justify-content-center w-100  bg-light  p-3 p-xl-4">
                                <img
                                  className="img-fluid"
                                  src={predictedData[0].image1}
                                  style={{ maxHeight: "350px" }}
                                />
                              </div>
                            </div>
                            <div className="col-12 col-xl-6">
                              <div className="text-left">
                                <h6 className="mt-2">Image 2</h6>
                              </div>
                              <div className="d-flex justify-content-center w-100  bg-light  p-3 p-xl-4">
                                <img
                                  className="img-fluid"
                                  src={ele}
                                  style={{ maxHeight: "350px" }}
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="d-flex flex-row mt-4 result-content">
                              Similarity score:{" "}
                              {parseFloat(predictedData[0]?.similarityScore[0]).toFixed(2)} out 10
                            </h5>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                ) : ["ocr", "object_detection", "instance", "segmentation"].includes(
                    trainData.model_type
                  ) ? (
                  (trainData.model_type === "object_detection" &&
                    router.query.evaluate.includes("https://deeplobe-ai.s3.amazonaws.com/")) ||
                  router.query.evaluate.includes(
                    "https://s3-ap-south-1.amazonaws.com/deeplobe-ai/prediction-"
                  ) ? (
                    <>
                      <button
                        className="btn btn-outline-primary d-flex ms-auto my-2"
                        onClick={() => window.open(router.query.evaluate, "_blank")}
                      >
                        Download
                      </button>
                      <div className="d-flex justify-content-center w-100  bg-light p-3 p-xl-4 shimmer-div">
                        <video className="w-100" height="350" controls>
                          {/* <source
                            src="https://deeplobe-ai.s3.amazonaws.com/media_assets/ezgif.com-video-cutter_1MDzMYi.mp4"
                            type="video/mp4"
                          /> */}
                          <source src={router.query.evaluate} type="video/mp4" />
                        </video>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="row justify-content-around mt-3 mb-2 gap-3 gap-xl-0">
                        <div className="col-12 col-xl-6">
                          <div className="d-flex justify-content-center w-100  bg-light p-3 p-xl-4 shimmer-div">
                            {loading ? (
                              <ShimmerThumbnail height={350} rounded className="d-flex mb-0" />
                            ) : (
                              <img
                                className="img-fluid"
                                src={predictedData[0].inputImage}
                                alt="result-photo"
                                style={{ maxHeight: "350px" }}
                              />
                            )}
                          </div>
                        </div>
                        <div className="col-12 col-xl-6">
                          <div className="d-flex justify-content-center w-100  bg-light p-3 p-xl-4 shimmer-div">
                            {loading ? (
                              <ShimmerThumbnail height={350} rounded className="d-flex mb-0" />
                            ) : (
                              <img
                                className="img-fluid"
                                src={predictedData[0].outputImage}
                                alt="result-photo"
                                style={{ maxHeight: "350px" }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      {!loading
                        ? ["ocr", "object_detection", "instance", "segmentation"].includes(
                            trainData.model_type
                          ) && (
                            <div>
                              <Tabs
                                id="controlled-tab-example"
                                activeKey={key}
                                onSelect={(k: any) => setKey(k)}
                                className="border-0"
                              >
                                <Tab eventKey="Labels" title="Labels" className="p-3">
                                  {modelResult()}
                                </Tab>
                                <Tab eventKey="JSON" title="JSON" className="p-3">
                                  <div style={{ position: "relative" }}>
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip id="button-tooltip">Copy to ClipBoard</Tooltip>
                                      }
                                    >
                                      <button
                                        className="copy-button btn"
                                        onClick={() =>
                                          copy(JSON.stringify(predictedData[0]?.jsonData))
                                        }
                                      >
                                        <img src={"/copy.svg"} className="copy" alt="img" />
                                      </button>
                                    </OverlayTrigger>
                                  </div>
                                  <div>JSON</div>
                                  <div className="p-r"></div>
                                  <JsonFormatter
                                    json={JSON.stringify(predictedData[0]?.jsonData)}
                                  />
                                </Tab>
                              </Tabs>
                            </div>
                          )
                        : ""}
                    </>
                  )
                ) : (
                  <div>
                    {/* <div className="my-3 rounded bg-white p-4 br-12"> */}
                    <div className="row justify-content-around mt-3 mb-2 gap-3 gap-xl-0">
                      <div className="col-12 col-xl-12">
                        <div className="d-flex justify-content-center w-100  bg-light  p-3 p-xl-4 shimmer-div">
                          {loading ? (
                            <ShimmerThumbnail height={350} rounded className="d-flex mb-0" />
                          ) : (
                            <img
                              className="img-fluid"
                              src={`${predictedData[0].inputImageURL}`}
                              style={{ maxHeight: "350px" }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    {loading ? (
                      <>
                        {" "}
                        <div className="mt-3">
                          <ShimmerThumbnail height={15} width={40} rounded />

                          <div className="d-flex row">
                            <div className="d-flex align-items-center shimmer-div">
                              <ShimmerThumbnail height={15} rounded />
                              <ShimmerThumbnail height={15} width={40} rounded className="ms-2" />
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <ShimmerThumbnail height={15} width={40} rounded />

                          <div className="d-flex row">
                            <div className="d-flex align-items-center shimmer-div">
                              <ShimmerThumbnail height={15} rounded />
                              <ShimmerThumbnail height={15} width={40} rounded className="ms-2" />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      predictedData.map((data) => (
                        <div key={data.id} className="mt-3">
                          {loading ? (
                            <ShimmerThumbnail height={15} width={40} rounded />
                          ) : (
                            <h5 className="text-start font-inter result-content">{data.tag}</h5>
                          )}

                          <div className="d-flex row">
                            <div className="d-flex align-items-center shimmer-div">
                              {loading ? (
                                <ShimmerThumbnail height={15} rounded />
                              ) : (
                                <Progressbar
                                  bgcolor={data.barColor}
                                  progress={data.confidenceScore}
                                  height={12}
                                />
                              )}
                              {loading ? (
                                <ShimmerThumbnail height={15} width={40} rounded className="ms-2" />
                              ) : (
                                <p className="my-0 mx-3 page-content">{data.confidenceValue}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    {/* </div> */}
                  </div>
                )}
              </>
            ) : (
              <>
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
              </>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default Evaluation;
