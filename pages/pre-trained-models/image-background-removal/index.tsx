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

import { imageBackgroundRemovalSamples } from "common_functions/sample_images.ts/imageBackgroundRemovalSamples";
// toasts
import { toast } from "react-toastify";
import Link from "next/link";
import { OverlayTrigger, ProgressBar, Spinner, Tab, Tabs, Tooltip } from "react-bootstrap";
import JsonFormatter from "react-json-formatter";
//toast configuration
toast.configure();

//service object initialization
const pretrainedService = new PRETRAINEDService();

const imageBackgroundRemoval: FC = () => {
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
  const [test_array, setTest_array] = useState(imageBackgroundRemovalSamples);
  const [key, setKey] = useState("JSON");
  const [actualResult, setActualResult] = useState({});

  const detectFaces = async () => {
    setLoading(true);
    let pl = "" as any;
    let tempfile = "" as any;
    let error = true;
    let validURL;
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
        // pl = pl.split(",").pop();
        const t = await fetch(pl);
        const tr = await t.blob();
        const newfile = new File([tr], "File name", { type: "image/png" });
        const formData = new FormData();
        formData.append("file", newfile);
        tempfile = formData;
        pretrainedService
          .imagebackgroundremoval(tempfile)
          .then((res) => {
            setActualResult(res);
            setResult({
              ...result,
              original_image_url: URL.createObjectURL(newfile),
              image_url: res.s3_url,
            });
            setLoading(false);
          })
          .catch((err) => {
            toast.error("Something went wrong");
            setLoading(false);
            setSubmit(false);
          });
      }
    } else {
      toast.error("Please provide image to the run model");
      setLoading(false);
      setSubmit(false);
    }
  };

  // Reset to default page
  const resetAll = (e) => {
    setResult({} as any);
    setActualResult({} as any);
    setSubmit(false);
    setUploadedFile([]);
    setSelectedUploadType("upload-image");
    setTest_array(imageBackgroundRemovalSamples);
    setSelectedImages([]);
  };

  const imageClick = (image) => {
    setSelectedUploadType("sample-image");
    //Reset Upload images
    setSelectedImages([]);
    let updated_sample = imageBackgroundRemovalSamples.map((item: any) => {
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
                <h4 className="page-title ms-3">Image background removal</h4>
              </div>
            </div>
            <hr className="mb-0" style={{ color: "#E4E4E4" }} />
            <div className="card border-0 bg-white pb-3">
              <div className="my-2 mx-4 page-content">
                <p className="mb-3">
                  Removes background from the image. The model instantly detects the subject from
                  any photo and gives you a smooth & precise cutout.
                </p>
              </div>
              <SampleCodeAccordion
                isPretrained={true}
                isImageInput={true}
                url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/remove-background`}
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
                            src={image.original_path}
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
                          setTest_array(imageBackgroundRemovalSamples);
                        }}
                      />
                      <label
                        className="form-check-label page-content cursor-pointer"
                        onClick={() => {
                          setSelectedUploadType("upload-image");
                          setSelectedImages([]);
                          setTest_array(imageBackgroundRemovalSamples);
                        }}
                      >
                        Upload image
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
                <button className="btn btn-outline-primary model-buttons" onClick={detectFaces}>
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
                      <div className="col-12 col-xl-6 d-flex">
                        <div className="d-flex justify-content-center w-100  bg-light p-3 p-xl-4 shimmer-div">
                          {loading ? (
                            <ShimmerThumbnail height={350} rounded className="d-flex mb-0" />
                          ) : (
                            <img
                              className="img-fluid"
                              src={result.original_image_url}
                              style={{ maxHeight: "350px" }}
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-xl-6 d-flex">
                        <div className="d-flex justify-content-center w-100  bg-light px-3 px-xl-4 pt-3 pt-xl-3 pb-0 shimmer-div flex-column pb-0">
                          {loading ? (
                            <ShimmerThumbnail height={350} rounded className="d-flex mb-0" />
                          ) : (
                            <>
                              <img
                                className="img-fluid"
                                src={result.image_url}
                                style={{ maxHeight: "350px" }}
                              />

                              <a
                                className="text-end font-14"
                                href={result.image_url}
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent the default behavior of the link (opening the image in the browser)
                                  fetch(result.image_url)
                                    .then((response) => response.blob())
                                    .then((blob) => {
                                      var link = document.createElement("a");
                                      link.href = window.URL.createObjectURL(blob);
                                      link.download = "myFileName.jpg"; // You can set the desired file name and extension here
                                      link.click();
                                    })
                                    .catch((error) =>
                                      console.error("Error fetching the image:", error)
                                    );
                                }}
                              >
                                <img src="/images/downloadimageIcon.svg" /> Download here
                              </a>
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
                          <Tab eventKey="JSON" title="JSON" className="p-3">
                            <div style={{ position: "relative" }}>
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id="button-tooltip">Copy to ClipBoard</Tooltip>}
                              >
                                <button
                                  className="copy-button btn"
                                  onClick={() => copy(JSON.stringify(actualResult))}
                                >
                                  <img src={"/copy.svg"} className="copy" alt="img" />
                                </button>
                              </OverlayTrigger>
                            </div>
                            <div>JSON</div>
                            <div className="p-r"></div>
                            <JsonFormatter json={JSON.stringify(actualResult)} />
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
export default imageBackgroundRemoval;
