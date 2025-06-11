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

import { MyDropzone } from "../../../components/dropzone";
//Shimmer effect
import { ShimmerThumbnail } from "react-shimmer-effects";
import { ProgressBar, Spinner } from "react-bootstrap";
import { faceExpressionSampleImages } from "common_functions/sample_images.ts/faceExpressionSampleImages";
// toasts
import { toast } from "react-toastify";
import Link from "next/link";
//toast configuration
toast.configure();

//service object initialization
const pretrainedService = new PRETRAINEDService();

const facialExpressionDetection: FC = () => {
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
  const [test_array, setTest_array] = useState(faceExpressionSampleImages);

  const detectFaces = async () => {
    setLoading(true);
    let pl = "" as any;
    let tempfile = "" as any;
    let error = true;
    let validURL;
    if (Object.keys(uploadedFile).length > 0 || imageUrl.length > 0 || selectedImages.length > 0) {
      if (selectedUploadType === "upload-image") {
        pl = await fileToBase64(selectedImages[0]);
        error = false;
      } else if (selectedUploadType === "upload-url") {
        const imageExists = await doesImageExist(imageUrl);
        if (imageExists) {
          try {
            pl = await getDataBlob(imageUrl);
            error = false;
          } catch (e) {
            console.log(e);
          }
        } else {
          error = true;
          validURL = false;
        }
      } else if (selectedUploadType === "sample-image") {
        const imageExists = await doesImageExist(uploadedFile.original_path);
        pl = await getDataBlob(uploadedFile.original_path);
        error = false;
      } else {
        error = true;
      }
      if (error) {
        if (!validURL) {
          toast.error("Something went wrong. A valid secure public URL is required");
        } else {
          toast.error("Something went wrong. Please select valid photo");
        }
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
          .facialExpressionRecognition(tempfile)
          .then((res) => {
            const formatted = [] as any;
            for (let face of res.faces) {
              formatted.push({
                angry: Math.round(Number(face.emotion.emotion.angry)),
                disgust: Math.round(Number(face.emotion.emotion.disgust)),
                fear: Math.round(Number(face.emotion.emotion.fear)),
                happy: Math.round(Number(face.emotion.emotion.happy)),
                sad: Math.round(Number(face.emotion.emotion.sad)),
                surprise: Math.round(Number(face.emotion.emotion.surprise)),
                neutral: Math.round(Number(face.emotion.emotion.neutral)),
                face_url: face.face_url,
              });
            }
            setResult({
              ...result,
              original_image_url: res.original_image_url,
              annotated_img_url: res.annotated_img_url,
              no_of_faces: res.no_of_faces,
              faces: formatted,
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
    }
  };

  // Reset to default page
  const resetAll = (e) => {
    setResult({} as any);
    setSubmit(false);
    setUploadedFile([]);
    setSelectedUploadType("upload-image");
    setTest_array(faceExpressionSampleImages);
    setSelectedImages([]);
  };

  const imageClick = (image) => {
    setSelectedUploadType("sample-image");
    //Reset Upload images
    setSelectedImages([]);
    let updated_sample = faceExpressionSampleImages.map((item: any) => {
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
                <h4 className="page-title ms-3">Facial expression recognition</h4>
              </div>
            </div>
            <hr className="mb-0" style={{ color: "#E4E4E4" }} />
            <div className="card border-0 bg-white pb-3">
              <div className="my-2 mx-4 page-content">
                <p className="mb-3">
                  Recognize facial expressions like happiness, sadness, anger, surprise, fear, etc.
                  Test the model by either selecting an image from the sample images provided below
                  or by uploading an image/URL an image in the box provided below. The model will
                  show if the facial expression in the selected image is of anger, disgust, fear,
                  happiness, sadness, surprise, or neutral.
                </p>
              </div>
              <SampleCodeAccordion
                isPretrained={true}
                isImageInput={true}
                url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_facial_expression`}
                url2={``}
                url3={``}
                modelName={"facial-expression"}
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

                    <div className="m-3   emulated-flex-gap gap-2">
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
                          setTest_array(faceExpressionSampleImages);
                        }}
                      />
                      <label
                        className="form-check-label page-content cursor-pointer"
                        onClick={() => {
                          setSelectedUploadType("upload-image");
                          setSelectedImages([]);
                          setTest_array(faceExpressionSampleImages);
                        }}
                      >
                        Upload image
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input cursor-pointer"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        checked={selectedUploadType === "upload-url" ? true : false}
                        onChange={() => {
                          setSelectedUploadType("upload-url");
                          //Reset Try Samples
                          setTest_array(faceExpressionSampleImages);
                        }}
                      />
                      <label
                        className="form-check-label page-content cursor-pointer"
                        onClick={() => {
                          setSelectedUploadType("upload-url");
                          setTest_array(faceExpressionSampleImages);
                        }}
                      >
                        Upload URL
                      </label>
                    </div>
                  </div>
                  <div className="form-group mt-3">
                    {selectedUploadType === "upload-url" ? (
                      <>
                        <label className="page-content">Image URL</label>
                        <input
                          className="form-control image-placeholder"
                          type="text"
                          placeholder="Add URL here"
                          onChange={(e) => {
                            setImageUrl(e.target.value);
                          }}
                          autoFocus
                        />
                      </>
                    ) : null}
                    {selectedUploadType === "upload-image" ? (
                      <>
                        <div>
                          {/* <input type="file" onChange={handleFile} accept="image/*" />
                           */}
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
                <button className="btn btn-outline-primary  model-buttons" onClick={detectFaces}>
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
                <div className="container  mb-4">
                  <h3 className="my-3 result-title">Model results</h3>
                  <div className="d-flex row justify-content-center mt-3">
                    <div className="col-12 col-xl-12">
                      <div className="d-flex justify-content-center w-100 bg-light p-3 p-xl-4 shimmer-div">
                        {" "}
                        {loading ? (
                          <ShimmerThumbnail className="d-flex mb-0" height={350} rounded />
                        ) : (
                          <img
                            className="img-fluid"
                            src={`${result.annotated_img_url}`}
                            style={{ maxHeight: "350px" }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-100 mt-4">
                    {loading ? (
                      <ShimmerThumbnail height={30} width={250} rounded className="mb-0" />
                    ) : (
                      <h4 className="txt-overflow mt-2">Expression intensity</h4>
                    )}
                  </div>
                  <div className="d-flex align-items-center my-3 flex-wrap gap-5">
                    {(loading ? [...Array(1)] : result?.faces).map((face: any, id: any) => (
                      <div
                        className="d-flex justify-content-start w-100 align-items-center gap-3"
                        key={id}
                      >
                        <div className="d-flex align-items-center">
                          {loading ? (
                            <ShimmerThumbnail className="mb-0" height={150} width={130} rounded />
                          ) : (
                            <img
                              alt="face"
                              src={face.face_url}
                              style={{ maxHeight: "150px" }}
                              className="img-fluid"
                              height={150}
                              width={125}
                            />
                          )}
                        </div>
                        <div className="me-2 d-flex gap-2 flex-column gap-2 justify-content-center">
                          {loading ? (
                            <ShimmerThumbnail height={35} width={200} rounded className="mb-0" />
                          ) : (
                            <div>
                              <h6>Happy</h6>
                              <ProgressBar
                                style={{ width: "212px", height: "10px", borderRadius: "10px" }}
                                now={face.happy}
                              />
                            </div>
                          )}
                          {loading ? (
                            <ShimmerThumbnail height={35} width={200} rounded className="mb-0" />
                          ) : (
                            <div>
                              <h6>Neutral</h6>
                              <ProgressBar
                                style={{ width: "212px", height: "10px", borderRadius: "10px" }}
                                now={face.neutral}
                              />
                            </div>
                          )}
                          {loading ? (
                            <ShimmerThumbnail height={35} width={200} rounded className="mb-0" />
                          ) : (
                            <div>
                              <h6>Surprised</h6>
                              <ProgressBar
                                style={{ width: "212px", height: "10px", borderRadius: "10px" }}
                                now={face.surprise}
                              />
                            </div>
                          )}
                        </div>
                        <div className="me-2 d-flex gap-2 flex-column gap-2 justify-content-center">
                          {loading ? (
                            <ShimmerThumbnail height={35} width={200} rounded className="mb-0" />
                          ) : (
                            <div>
                              <h6>Sad</h6>
                              <ProgressBar
                                style={{ width: "212px", height: "10px", borderRadius: "10px" }}
                                now={face.sad}
                              />
                            </div>
                          )}
                          {loading ? (
                            <ShimmerThumbnail height={35} width={200} rounded className="mb-0" />
                          ) : (
                            <div>
                              <h6>Angry</h6>
                              <ProgressBar
                                style={{ width: "212px", height: "10px", borderRadius: "10px" }}
                                now={face.angry}
                              />
                            </div>
                          )}
                          {loading ? (
                            <ShimmerThumbnail height={35} width={200} rounded className="mb-0" />
                          ) : (
                            <div>
                              <h6>Scared</h6>
                              <ProgressBar
                                style={{ width: "212px", height: "10px", borderRadius: "10px" }}
                                now={face.fear}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {" "}
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
export default facialExpressionDetection;
