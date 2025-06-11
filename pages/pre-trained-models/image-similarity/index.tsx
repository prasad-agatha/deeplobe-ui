import React, { FC, useState } from "react";
// import MainLayoutNew from "layouts/MainLayoutNew";
import MainLayout from "layouts/MainLayout";
import { SampleCodeAccordion } from "components/accordion";
//service
import PRETRAINEDService from "services/pre-trained.services";
//Shimmer effect
import { ShimmerThumbnail } from "react-shimmer-effects";
//Loader
import Loader from "react-loader-spinner";

// import Shimmer from "react-shimmer-effect";
// import Shimmer from "react-js-loading-shimmer";
// import { Image, Shimmer, Breathing } from "react-shimmer";

import { MyDropzone } from "../../../components/dropzone";
import { Cursor } from "@styled-icons/bootstrap";
import { imageSimilaritySampleImages } from "common_functions/sample_images.ts/imageSimilaritySampleImages";
// toasts
import { toast } from "react-toastify";
import { getDataBlob, getDataBlob1 } from "common_functions/functions";
import Link from "next/link";
import { Spinner } from "react-bootstrap";
//toast configuration
toast.configure();

//service object initialization
const pretrainedService = new PRETRAINEDService();

const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

const imageSimilarity: FC = () => {
  // Predicted result storage
  const [result, setResult] = useState({}) as any;
  // Submit button manipulation
  const [submit, setSubmit] = useState(false);
  // Loader manipulation
  const [loading, setLoading] = useState(false);
  // Upload type storage
  const [selectedUploadType, setSelectedUploadType] = useState("upload-image");
  // if upload type is image-url Image URL 1 is set in this state
  const [imageUrl1, setImageUrl1] = useState("");
  // if upload type is image-url Image URL 2 is set in this state
  const [imageUrl2, setImageUrl2] = useState("");
  // if upload type is upload-image image file is set in this state
  const [uploadedFile, setUploadedFile] = useState([]);
  // if upload type is sample-image selected sample image files is set in this state
  const [selectedImage, setSelectedImage] = useState([]);
  // if upload type is upload-image selected sample image files is set in this state
  const [selectedImages, setSelectedImages] = useState([] as any);
  // All sample images are set here
  const [test_array, setTest_array] = useState(imageSimilaritySampleImages);
  const [img_Arr, setImgArr] = useState([] as any);

  const fileToBase64 = async (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (e) => reject(e);
    });

  const handleFile = (event) => {
    const value = event.target.files[0];
    const value2 = event.target.files[1];

    setUploadedFile([value, value2]);
  };

  async function parseURI(d) {
    var reader = new FileReader(); /* https://developer.mozilla.org/en-US/docs/Web/API/FileReader */
    reader.readAsDataURL(
      d
    ); /* https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL */
    return new Promise((res, rej) => {
      /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise */
      reader.onload = (e) => {
        /* https://developer.mozilla.org/en-US/docs/Web/API/FileReader/onload */
        res(e.target.result);
      };
    });
  }

  const doesImageExist = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });

  const detectFaces = async () => {
    console;
    setLoading(true);
    let pl = "" as any;
    let imgArr = [] as any;
    let error = true;
    let validURL;
    let errMsg;
    if (
      Object.keys(uploadedFile).length > 1 ||
      imageUrl1.length > 0 ||
      imageUrl2.length > 0 ||
      selectedImages.length > 0
    ) {
      if (selectedUploadType === "upload-image") {
        const formData = new FormData();
        for (let file of selectedImages) {
          let base64Image: any = await fileToBase64(file);
          const t = await fetch(base64Image);
          const tr = await t.blob();
          const newfile = new File([tr], "File name", { type: "image/png" });
          formData.append("file", newfile);
        }
        imgArr.push(formData);
        error = false;
      } else if (selectedUploadType === "upload-url") {
        const formData = new FormData();
        const imageExists1 = await doesImageExist(imageUrl1);
        const imageExists2 = await doesImageExist(imageUrl2);
        if (imageExists1 && imageExists2) {
          try {
            const blob1 = (await getDataBlob1(imageUrl1)) as any;
            const blob2 = (await getDataBlob1(imageUrl2)) as any;
            formData.append("file", blob1);
            formData.append("file", blob2);
            imgArr.push(formData);
            // imgArr.push(blob1.split(",").pop());
            // imgArr.push(blob2.split(",").pop());

            error = false;
          } catch (e) {
            console.log(e);
          }
        } else {
          error = true;
          errMsg = "Something went wrong. A valid secure public URL is required";
        }
      } else if (selectedUploadType === "sample-image") {
        const formData = new FormData();
        for (let file of uploadedFile) {
          let base64Image: any = await getDataBlob(file.original_path);
          const t = await fetch(base64Image);
          const tr = await t.blob();
          const newfile = new File([tr], "File name", { type: "image/png" });
          formData.append("file", newfile);
        }
        imgArr.push(formData);
        error = false;
      } else {
        error = true;
        errMsg = "Something went wrong. Please select valid photos";
      }
      if (error) {
        toast.error(errMsg);
        setLoading(false);
        setSubmit(false);
      } else {
        setSubmit(true);
        pl = imgArr;

        pretrainedService
          .imageSimilarity(pl[0])
          .then((res) => {
            if (res === undefined) {
              resetAll();
              toast.error("Something went wrong. Please provide valid photos");
            } else {
              setResult(res);
            }
            setLoading(false);
          })
          .catch((err) => {
            toast.error(err);
            setLoading(false);
          });
      }
    } else {
      toast.error("Please provide images to the run model");
      setLoading(false);
    }
  };

  // Reset to default page
  const resetAll = () => {
    setResult({} as any);
    setSubmit(false);
    setUploadedFile([]);
    setSelectedUploadType("upload-image");
    setTest_array(imageSimilaritySampleImages);
    setSelectedImage([]);
    setImgArr([]);
    setSelectedImages([]);
  };

  const imageClick = (image) => {
    setSelectedUploadType("sample-image");
    //Reset Upload images
    setSelectedImages([]);
    img_Arr.push(image);
    if ([...selectedImage, image.id].length > 2) {
      selectedImage.shift();
      img_Arr.shift();
      setSelectedImage([...selectedImage, image.id]);
    }
    setSelectedImage([...selectedImage, image.id]);
    let updated_sample = [] as any;
    for (let item of imageSimilaritySampleImages) {
      if ([...selectedImage, image.id].includes(item.id)) {
        updated_sample.push({
          id: item.id,
          thumbnail_path: item.thumbnail_path,
          original_path: item.original_path,
          selected: true,
        });
      } else {
        updated_sample.push(item);
      }
    }
    setTest_array(updated_sample);
    setUploadedFile(img_Arr);
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
                <h4 className="page-title ms-3">Image similarity</h4>
              </div>
            </div>
            <hr className="mb-0" style={{ color: "#E4E4E4" }} />
            <div className="card border-0 bg-white pb-3">
              <div className="my-2 mx-4 page-content">
                <p className="mb-3">
                  Compare two images to check how similar they are. We’ll give you a score that
                  represents the level of similarity - the higher the score, the more similar and
                  identical the images are. You can test your model by selecting from provided
                  sample images or, alternatively, you can either upload your own images or you can
                  copy-paste the URLs images that you want to compare. Once you upload your images,
                  simply click “Run model”.
                </p>
              </div>
              <SampleCodeAccordion
                isPretrained={true}
                isImageInput={true}
                url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_image_similarity`}
                url2={``}
                url3={``}
                modelName={"image-similarity"}
                content_type="application/json"
                curl_payload="file=@file1.jpg"
                nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/image_url'&#93;&#125;" //not using
                python_payload="&#123;'file' &#58; open&#40;'file1.jpg','rb'&#41;, 'file' &#58; open&#40;'file2.jpg','rb'&#41;&#125;"
                data_format="formdata"
                number_of_files={2}
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
                    <h6 className="m-0 my-1 try-sample-title">or</h6>
                    <div className="border-start h-100"></div>
                  </div>
                </div>
                <div className="col-md-5  block-background container p-4">
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
                          setTest_array(imageSimilaritySampleImages);
                        }}
                      />
                      <label
                        className="form-check-label page-content cursor-pointer"
                        onClick={() => {
                          setSelectedUploadType("upload-image");
                          //Reset Upload images
                          setSelectedImages([]);
                          //Reset Try Samples
                          setTest_array(imageSimilaritySampleImages);
                        }}
                      >
                        Upload images
                      </label>
                    </div>
                    <div className="form-check ">
                      <input
                        className="form-check-input cursor-pointer"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        checked={selectedUploadType === "upload-url" ? true : false}
                        onChange={() => {
                          setSelectedUploadType("upload-url");
                          setTest_array(imageSimilaritySampleImages);
                        }}
                      />
                      <label
                        className="form-check-label page-content cursor-pointer"
                        onClick={() => {
                          setSelectedUploadType("upload-url");
                          setTest_array(imageSimilaritySampleImages);
                        }}
                      >
                        Upload URLs
                      </label>
                    </div>
                  </div>
                  <div className="form-group mt-3">
                    {selectedUploadType === "upload-url" ? (
                      <>
                        <label className="page-content">Upload image 1 URL</label>
                        <input
                          className="form-control image-placeholder"
                          type="text"
                          placeholder="Add URL_1 here"
                          onChange={(e) => {
                            setImageUrl1(e.target.value);
                          }}
                          autoFocus
                        />
                        <label className="mt-4 page-content">Upload image 2 URL</label>
                        <input
                          className="form-control image-placeholder"
                          type="text"
                          placeholder="Add URL_2 here"
                          onChange={(e) => {
                            setImageUrl2(e.target.value);
                          }}
                        />
                      </>
                    ) : null}
                    {selectedUploadType === "upload-image" ? (
                      <>
                        <div>
                          <MyDropzone
                            {...{ selectedImages, setSelectedImages }}
                            // setSelectedImages={setSelectedImages}
                            // selectedImages={selectedImages}
                            maxNumberOfImages={2}
                            align={true}
                          />
                        </div>

                        {selectedImages.length > 0 ? (
                          <>
                            {selectedImages.map((image: any) => {
                              return (
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
                                      {image.path}
                                    </p>
                                    <p className="p-0 text-muted">
                                      {" "}
                                      - {Math.ceil(image.size / 1024).toFixed(0)}kb
                                    </p>
                                  </div>
                                  <div
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      const temp = selectedImages.filter((img) => img !== image);
                                      setSelectedImages(temp);
                                    }}
                                  >
                                    <img src="../images/delete-icon.svg" alt="delete-icon" />
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="d-flex flex-wrap mx-4 py-5 gap-3 justify-content-center">
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
              {/* <h3 className="my-3 mx-4 result-title">Model results</h3> */}
              {submit ? (
                <div className="container">
                  <h3 className="my-3 result-title">Model results</h3>

                  <div className="d-flex row justify-content-around mt-3 mb-2 gap-3 gap-xl-0">
                    <div className="col-12 col-xl-6">
                      {loading ? (
                        <ShimmerThumbnail className="mb-1" height={30} width={300} rounded />
                      ) : (
                        <div className="text-left">
                          <h6 className="mt-2">Image 1</h6>
                        </div>
                      )}
                      <div className="d-flex justify-content-center w-100  bg-light  p-3 p-xl-4 shimmer-div">
                        {loading ? (
                          <ShimmerThumbnail height={350} rounded className="d-flex mb-0" />
                        ) : (
                          <img
                            className="img-fluid"
                            src={result.image1}
                            style={{ maxHeight: "350px" }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-xl-6">
                      {loading ? (
                        <ShimmerThumbnail className="mb-1" height={30} width={300} rounded />
                      ) : (
                        <div className="text-left">
                          <h6 className="mt-2">Image 2</h6>
                        </div>
                      )}
                      <div className="d-flex justify-content-center w-100  bg-light  p-3 p-xl-4 shimmer-div">
                        {loading ? (
                          <ShimmerThumbnail height={350} rounded className="d-flex mb-0" />
                        ) : (
                          <img
                            className="img-fluid"
                            src={result.image2}
                            style={{ maxHeight: "350px" }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {loading ? (
                    <ShimmerThumbnail className="mt-2" height={30} width={350} rounded />
                  ) : (
                    <h5 className="d-flex flex-row mt-4 result-content">
                      Similarity score: {parseFloat(result.score).toFixed(2)} out 10
                    </h5>
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
export default imageSimilarity;
