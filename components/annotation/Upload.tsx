import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import { OverlayTrigger, Spinner, Tooltip, Modal } from "react-bootstrap";

import { PreviewDropzone } from "@components/dropzone";
import AnnotationNav from "@components/navigation/AnnotationNav";
import BestPracticesModal from "@components/modals/BestPractices";
import LeavePageModal from "@components/modals/LeavePage";
import { Shimmer } from "components/annotation";
import { getBlob, getDataBlob, getDataBlob1, getModelType } from "common_functions/functions";

import ImageBatchService from "services/imageupload.service";
import AnnotationService from "services/annotation.service";
import ImportFiles from "@components/dropzone/ImportFiles";

import VideoUploader from "@components/video_uploader/uploader";
import TooltipSlider, { handleRender } from "components/video_uploader/tooltip_slider";
import FrameService from "services/frames.service";
import { ShimmerThumbnail } from "react-shimmer-effects";

const imageBatchService = new ImageBatchService();
const annotationService = new AnnotationService();
const frameService = new FrameService();
const annotation_files = {
  segmentation: "https://deeplobe-ai.s3.amazonaws.com/media_assets/segmentation.json",
  ocr: "https://deeplobe-ai.s3.amazonaws.com/media_assets/Ocr_ann_file.json",
  object_detection: "https://deeplobe-ai.s3.amazonaws.com/media_assets/object_detection.json",
};

const cls = (router: any) => [
  {
    id: uuidv4(),
    name: getModelType(router.pathname, true),
    changeTagName: false,
    images: [],
    selectedImages: [],
    selectedJsonFile: [],
    previewImages: [],
  },
];

const Upload = ({ user, details, router, Router }) => {
  const [classes, setClasses] = useState<any>(cls(router));
  const [errorMessages, setErrorMessages] = useState([]);
  const [uploadLoader, setUploadLoader] = useState(false);
  const [show, setShow] = useState("");
  const [showModal, setShowModal] = useState("");
  const [shows, setShows] = useState(false);
  const handlesClose = () => setShows(false);
  const handlesShow = () => setShows(true);
  const [upload, setUpload] = useState("images");
  const [changeRoute, setChangeRoute] = useState(false);
  const [cR, setCR] = useState(false);
  const [state, setState] = useState<any>({ stop: false, redirect: "" });

  const [show_one, setShow_one] = useState(false);
  const [number_of_images, setNumber_of_images] = useState(0);
  const [video_fps, setVideo_fps] = useState(0);
  const [max_no_of_frames, setMax_no_of_frames] = useState(0);
  const [video_details, setVideo_details]: any = useState({});
  const [userFPS, setUserFPS] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stepper, setStepper] = useState("upload");
  const [sliderValue, setSlidervalue] = useState(60);

  useEffect(() => {
    var fps;
    if (sliderValue === 60) {
      fps = 1;
    } else if (sliderValue > 60) {
      fps = (1 / (sliderValue - 59)).toFixed(3);
    } else {
      fps = 61 - sliderValue;
    }
    setUserFPS(fps);
    let interval = Math.floor(video_fps / fps);
    if (interval < 1) {
      interval = 1;
    }
    if (max_no_of_frames === 0) {
      // setUserFPS(fps);
      // let interval = Math.floor(videoFPS / fps);
      // if (interval < 1) {
      //   interval = 1;
      // }
      // const images_count = [...Array(max_frames)].filter((e, id) => id % interval === 0).length;
      // console.log("ifff", interval, images_count);
      // if (images_count > max_frames) setNumber_of_images(max_frames);
      // else setNumber_of_images(images_count);
    } else {
      const images_count = [...Array(max_no_of_frames)].filter(
        (e, id) => id % interval === 0
      ).length;
      if (images_count > max_no_of_frames) setNumber_of_images(max_no_of_frames);
      else setNumber_of_images(images_count);
    }
  }, [sliderValue, max_no_of_frames]);

  const cal_no_images = (slider_value, max_frames, videoFPS) => {
    setSlidervalue(slider_value);
    var fps;
    if (slider_value === 60) {
      fps = 1;
    } else if (slider_value > 60) {
      fps = (1 / (slider_value - 59)).toFixed(3);
    } else {
      fps = 61 - slider_value;
    }
    setUserFPS(fps);
    let interval = Math.floor(video_fps / fps);
    if (interval < 1) {
      interval = 1;
    }
    if (max_no_of_frames === 0) {
      setUserFPS(fps);
      let interval = Math.floor(videoFPS / fps);
      if (interval < 1) {
        interval = 1;
      }
      const images_count = [...Array(max_frames)].filter((e, id) => id % interval === 0).length;
      if (images_count > max_frames) setNumber_of_images(max_frames);
      else setNumber_of_images(images_count);
    } else {
      const images_count = [...Array(max_no_of_frames)].filter(
        (e, id) => id % interval === 0
      ).length;
      if (images_count > max_no_of_frames) setNumber_of_images(max_no_of_frames);
      else setNumber_of_images(images_count);
    }
  };

  const convertToFrames = () => {
    setStepper("uploading");
    setLoading(true);
    const d = document.getElementById("divider");
    const wind = document.getElementById("dashboard-layout-wrapper");
    const dw = d.clientWidth ? d.clientWidth : 1110;
    const dh = wind.clientHeight ? wind.clientHeight : 1080;
    const rw = Math.floor(dw * 0.25) - 200 > 0 ? Math.floor(dw * 0.25) : 200;
    const block_w = Math.floor(dw - 116 - rw).toString();
    const block_h = (Math.floor(dh - 480) > 400 ? Math.floor(dh - 480) : 400).toString();
    const formData = new FormData();
    formData.append("video", video_details.file);
    formData.append("gfps", `${userFPS}`);
    formData.append("width", block_w);
    formData.append("height", block_h);
    formData.append("uuid", router.query.uuid);
    frameService
      .convertToFrames(formData)
      .then((res) => {
        const progress = document.getElementById("progress");
        progress.classList.add("loading_completed");
        changeImage(router.pathname.replace("[uuid]", router.query.uuid) + `?annotate#top`);
        // setTimeout(function () {
        //   // setShow_one(false);
        //   // setLoading(false);
        //   setUploadLoader(true);
        //   console.log("GOT URLS");
        //   let tempUrls = _.chunk(res, 25);
        //   uploadImgs(tempUrls, res.length, "url");
        //   // setStepper("upload");
        // }, 3000);
      })
      .catch((err) => {
        toast.error("Something went wrong");
        setShow_one(false);
        setLoading(false);
        setStepper("upload");
      });
  };

  // console.log(details, "CHANGE");

  useEffect(() => {
    if (changeRoute) setCR(true);
    setState({
      ...state,
      stop: classes[0].selectedImages.length > 0 || classes[0].selectedJsonFile.length > 0,
    });
  }, [classes]);

  useEffect(() => {
    setClasses(cls(router));
  }, [upload]);

  const message = "Are you sure? Changes you made may not be saved.";
  useEffect(() => {
    if (state.stop && !state.redirect) {
      let isWarned = false;

      const routeChangeStart = (url: string) => {
        if (Router.asPath !== url && !isWarned) {
          setState({ ...state, redirect: url });
          setShowModal("step1");
          isWarned = false;
          Router.events.emit("routeChangeError");
          Router.replace(Router, Router.asPath, { shallow: true });
          // eslint-disable-next-line no-throw-literal
          throw "Abort route change. Please ignore this error.";
        }
      };

      const beforeUnload = (e: BeforeUnloadEvent) => {
        if (!isWarned) {
          const event = e || window.event;
          event.returnValue = message;
          return message;
        }
        return null;
      };

      Router.events.on("routeChangeStart", routeChangeStart);
      window.addEventListener("beforeunload", beforeUnload);
      Router.beforePopState(({ url }) => {
        if (Router.asPath !== url && !isWarned) {
          setState({ ...state, redirect: url });
          setShowModal("step1");
          isWarned = false;
          window.history.pushState(null, "", url);
          Router.replace(Router, Router.asPath, { shallow: true });
          return false;
        }
        return true;
      });

      return () => {
        Router.events.off("routeChangeStart", routeChangeStart);
        window.removeEventListener("beforeunload", beforeUnload);
        Router.beforePopState(() => {
          return true;
        });
      };
    }
  }, [message, state.stop, state.redirect]);

  const renderPhotos = (classes, tag, source) => {
    return source.map((photo, idx) => {
      return (
        <div className="m-0" key={idx}>
          <img
            src={photo.blobFile}
            alt=""
            className=""
            style={{ height: 50, width: 50, borderRadius: 5, opacity: photo.selected ? 0.3 : 1 }}
          />
          <div className="overlay">
            <img
              onClick={() => {
                const allClasses = _.cloneDeep(classes);
                const selectedTag = _.find(allClasses, (cls) => {
                  return tag.id === cls.id;
                });
                selectedTag.selectedImages.map((cls) => {
                  if (cls.id === photo.id) {
                    let updatedSelectedImages = selectedTag.selectedImages.filter(
                      (item) => item.id !== photo.id
                    );
                    selectedTag.selectedImages = updatedSelectedImages;
                  } else {
                    cls.selected = false;
                    cls.clickCounter = 0;
                  }
                });
                // const index = _.findIndex(allClasses, { id: tag.id });
                // allClasses.splice(index, 1, selectedTag);
                // console.log(allClasses);
                setClasses(allClasses);
              }}
              src="/images/delete-cross-icon.svg"
              alt="delete-icon"
              className="cursor-pointer"
              style={{ marginTop: "-120px", color: "#6152D9", marginLeft: "45px" }}
            />
          </div>
        </div>
      );
    });
  };
  const renderFile = () => {
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
          <p className="p-0 text-muted text-truncate ms-2 mb-0" style={{ maxWidth: "200px" }}>
            {classes[0]?.selectedJsonFile[0].img.path}
          </p>
          <p className="p-0 text-muted m-0">
            &nbsp; - {Math.ceil(classes[0]?.selectedJsonFile[0].img.size / 1024).toFixed(0)}kb
          </p>
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setClasses(cls(router));
            setErrorMessages([]);
          }}
        >
          <img src="/images/delete-icon.svg" alt="delete-icon" />
        </div>
      </div>
    );
  };

  const annotatePage = router.pathname.replace("[uuid]", router.query.uuid) + `?annotate#top`;

  useEffect(() => {
    if (cR) changeImage(annotatePage);
  }, [cR]);

  const uploadImgs = (tempUrls, imgLen, type?: any) => {
    const uuid = router.query.uuid;
    const imageUrls = [];
    const allUrls = [];
    tempUrls.map((arrItem, idx) => {
      arrItem.map((img, indx) => {
        const imge = new window.Image();
        imge.src = type ? img : img.blobFile;
        imge.onload = async () => {
          if (imge) {
            const ratio = imge.width / imge.height;
            const d = document.getElementById("divider");
            const wind = document.getElementById("dashboard-layout-wrapper");
            const dw = d.clientWidth ? d.clientWidth : 1110;
            const dh = wind.clientHeight ? wind.clientHeight : 1080;
            const rw = Math.floor(dw * 0.25) - 200 > 0 ? Math.floor(dw * 0.25) : 200;
            const block_w = Math.floor(dw - 116 - rw);
            const block_h = Math.floor(dh - 480) > 400 ? Math.floor(dh - 480) : 400;
            let width = block_w;
            let height = width / ratio;
            
            if ((imge.width < width && imge.height < block_h )|| getModelType(router.pathname) === 'ocr') {
              height = imge.height;
              width = imge.width;
            } else if (height > block_h) {
              height = block_h;
              width = height * ratio;
            }
            const imgFormData = new FormData();
            imgFormData.append("width", Math.floor(width).toString());
            imgFormData.append("height", Math.floor(height).toString());
            imgFormData.append("class_name", uuidv4());
            if (type) {
              const asset: any = await getDataBlob1(img);
              if (asset) {
                imgFormData.append("asset", asset, asset.name);
              }
            } else {
              imgFormData.append("asset", img.img, img.img.name);
            }
            // console.log("type else");
            imageBatchService
              .createModelImagesResize(uuid.trim(), imgFormData)
              .then((res) => {
                if (res.asset && res.id) imageUrls.push(res);
              })
              .finally(() => {
                allUrls.push(1);
                if (allUrls.length === imgLen) {
                  if (imageUrls.length === imgLen) {
                    const temp = [];
                    imageUrls.map((item: any) => {
                      temp.push({
                        id: item.id,
                        file_name: item.asset.split("/").pop(),
                        url: item.asset,
                        annotated: false,
                      });
                    });
                    const formdata = new FormData();
                    formdata.append("annotation_file", getBlob({ images: temp }), "Annotate.json");
                    annotationService
                      .createAnnotations(uuid, "images", getModelType(router.pathname), formdata)
                      .then(() => {
                        setClasses(cls(router));
                        setChangeRoute(true);
                        toast.success("Images uploaded successfully", { autoClose: 10000 });
                      })
                      .catch(() => {
                        toast.error("Error uploading images. Try again.");
                      });
                  } else toast.error("Error uploading images. Try again.");
                  setUploadLoader(false);
                }
              });
          }
        };
      });
    });
  };
  const uploadFiles = async () => {
    if (!uploadLoader) {
      const uuid = router.query.uuid;
      if (upload === "images") {
        let error = false;
        for (let tag of classes) {
          if (tag.selectedImages.length < 10) error = true;
        }
        if (error) toast.error("Minimum 10 images should be added for each class");
        else {
          setUploadLoader(true);
          let tag = classes[0];
          let tempUrls = _.chunk(tag.selectedImages, 25);
          uploadImgs(tempUrls, tag.selectedImages.length);
        }
      } else {
        const formdata = new FormData();
        formdata.append("annotation_file", classes[0]?.selectedJsonFile[0]?.img, "Annotate.json");
        setUploadLoader(true);
        annotationService
          .createAnnotations(uuid, "file", getModelType(router.pathname), formdata)
          .then(() => {
            setClasses(cls(router));
            setChangeRoute(true);
            toast.success("Images uploaded successfully", { autoClose: 10000 });
          })
          .catch(() => {
            toast.error("Error uploading images. Try again.");
          })
          .finally(() => setUploadLoader(false));
      }
    }
  };

  const downloadFile = () => {
    const url =
      `${getModelType(router.pathname)}` === "object_detection"
        ? annotation_files.object_detection
        : `${getModelType(router.pathname)}` === "segmentation"
        ? annotation_files.segmentation
        : `${getModelType(router.pathname)}` === "ocr"
        ? annotation_files.ocr
        : annotation_files.segmentation;
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("target", "_blank");
        link.download = "Annotation-file";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };
  // const downloadFile = () => {
  //   const link = document.createElement("a");
  //   link.href =
  //     `${getModelType(router.pathname)}` === "object_detection"
  //       ? annotation_files.object_detection
  //       : `${getModelType(router.pathname)}` === "segmentation"
  //       ? annotation_files.segmentation
  //       : `${getModelType(router.pathname)}` === "ocr"
  //       ? annotation_files.ocr
  //       : annotation_files.segmentation;

  //   link.setAttribute("download", "");
  //   link.click();
  //   console.log("lll");
  // };

  const onClose = () => {
    setState({ ...state, redirect: "" });
    setShowModal("");
  };

  const onClick = () => {
    setShowModal("");
    if (showModal === "step1" && state.redirect) router.push(state.redirect);
    if (showModal === "step") {
      setState({ stop: false, redirect: "" });
      setClasses(cls(router));
    }
  };

  const changeImage = (path: any) => router.replace(path);

  if (details.load) return <Shimmer {...{ user, router }} />;

  return (
    <>
      <div className="mainc container-fluid flex-grow-1" id="top">
        <div
          className="border border-light rounded bg-white mb-5 p-4"
          style={{ minHeight: "100%" }}
        >
          <AnnotationNav {...{ user, router, changeImage, details }} />
          <hr id="divider" style={{ marginTop: "6px", marginBottom: "6px" }} />

          <div className="d-flex flex-wrap g-1 w-100 my-3">
            {["images", "annotation file"].map((ele: any, id: any) => (
              <>
                <label
                  className="d-flex align-items-center cr-p"
                  key={id}
                  onClick={() => setUpload(ele)}
                >
                  <input
                    id={ele}
                    type="radio"
                    name="r"
                    className="form-check-input me-2 mt-0"
                    checked={ele === upload}
                    readOnly
                  />
                  <p className="m-0">Upload {ele === "images" ? "data" : ele}</p>
                  {/* {getModelType(router.pathname) === "object_detection" ? (
                <p className="m-0">Upload {ele === "images" ? "data" : ele}</p>
              ) : (
                <p className="m-0">Upload {ele}</p>
              )} */}

                  {ele === "images" && (
                    <img
                      src="/info.svg"
                      alt="info"
                      className="ms-2"
                      onClick={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShow("bestPractices");
                      }}
                    />
                  )}
                </label>
                {ele === "annotation file" && (
                  // <span
                  //   className="badge btn-primary text-center font-7 ms-1 cursor-pointer"
                  //   style={{ lineHeight: "10px", fontSize: "8px", fontWeight: "100" }}
                  //   onClick={downloadFile}
                  // >
                  //   Download sample file
                  // </span>
                  <span
                    className="badge bg-primary font-100 font-9 pt-1 cursor-pointer"
                    onClick={downloadFile}
                  >
                    Download sample file
                  </span>
                )}
              </>
            ))}
          </div>

          <div className="block-background p-4">
            {upload === "images" ? (
              <PreviewDropzone
                item={classes[0]}
                classId={classes[0].id}
                classes={classes}
                setClasses={setClasses}
                maxNumberOfImages={5000}
                acceptedFileExtention={["image/jpeg", "image/png", "image/jpg"]}
              />
            ) : (
              <PreviewDropzone
                item={classes[0]}
                classId={classes[0].id}
                classes={_.cloneDeep(classes)}
                setClasses={setClasses}
                maxNumberOfImages={1}
                acceptedFileExtention={".json"}
              />
            )}

            {upload === "images" ? (
              <>
                {classes[0].selectedImages.length > 0 && (
                  <div
                    className="d-flex flex-wrap bg-white p-2 px-3 large-2"
                    style={{ maxHeight: "250px", overflowY: "auto" }}
                  >
                    {renderPhotos(classes, classes[0], classes[0].selectedImages)}
                  </div>
                )}
              </>
            ) : (
              <>
                {classes[0]?.selectedJsonFile.length === 1 ? renderFile() : null}
                {errorMessages.map((message, index) => (
                  <p className="font-14 text-danger mb-0 my-1" key={index}>
                    {message}
                  </p>
                ))}
              </>
            )}
            <hr />

            {upload === "images" && (
              <div className="d-flex justify-content-between gap-3">
                <p className="text-muted m-0">Minimum of 10 images</p>
                <p className="text-muted m-0">{classes[0].selectedImages.length} images</p>
              </div>
            )}
          </div>

          <div className="d-flex w-100 py-3 row  mx-0">
            <div
              className={
                getModelType(router.pathname) === "ocr"
                  ? "d-none"
                  : "col-md-6 p-0 py-2 py-md-0 pe-md-2"
              }
            >
              <div className="block-background p-4">
                <VideoUploader
                  {...{
                    setShow_one,
                    sliderValue,
                    cal_no_images,
                    setNumber_of_images,
                    setMax_no_of_frames,
                    setVideo_fps,
                    video_details,
                    setVideo_details,
                    setLoading,
                  }}
                  maxNumberOfFiles={1}
                  acceptedFileExtention={"video/*"}
                />
              </div>
            </div>
            <div
              className={
                getModelType(router.pathname) === "ocr"
                  ? "col-12 file-uploader px-0"
                  : "col-md-6 file-uploader p-0 py-2 py-md-0 ps-md-2"
              }
            >
              <div className="block-background h-100 flex-center p-4">
                <div className="cursor-pointer border-dashed w-100 h-100">
                  <div
                    className="flex-center bg-white h-100 "
                    style={{ border: "2px dashed #eeeeee" }}
                    onClick={handlesShow}
                  >
                    <div className="d-flex w-100 flex-column ">
                      <small className="text-center w-100 p-4" style={{ color: "#bdbdbd" }}>
                        Import from
                        <a className="mb-3 text-blue" style={{ cursor: "pointer" }}>
                          {" "}
                          Data sources
                        </a>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
              <Modal
                show={shows}
                // onHide={() => setShows(false)}
                keyboard={false}
                aria-labelledby="example-custom-modal-styling-title"
              >
                <Modal.Body className="pt-0 mx-2">
                  <ImportFiles />
                </Modal.Body>
                <Modal.Footer>
                  <button
                    className="btn  btn-sm ms-3 font-inter border-0"
                    onClick={() => setShows(false)}
                  >
                    Cancel
                  </button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>

          {classes[0].selectedImages.length > 0 || classes[0].selectedJsonFile.length > 0 ? (
            <div className="d-flex justify-content-center p-0 mt-4">
              <button className="btn btn-sm border-0 me-5" onClick={() => setShowModal("step")}>
                Clear
              </button>
              <button
                type="button"
                className="btn btn-primary font-14 py-3 px-5"
                onClick={uploadFiles}
              >
                {uploadLoader && (
                  <Spinner
                    animation="border"
                    className="me-2"
                    style={{ width: "1rem", height: "1rem" }}
                  />
                )}
                {` Upload`}
              </button>
            </div>
          ) : (
            <div className="d-flex justify-content-center p-0 mt-4">
              {details.image_id ? (
                <button
                  type="button"
                  className="btn btn-primary font-14 py-3 px-5"
                  onClick={() => changeImage(annotatePage)}
                >
                  Continue
                </button>
              ) : (
                <OverlayTrigger
                  overlay={<Tooltip id="tooltip-engine">Upload images to continue</Tooltip>}
                >
                  <button
                    type="button"
                    style={{ opacity: "0.65" }}
                    className="btn btn-primary font-14 py-3 px-5 cr-d"
                  >
                    Continue
                  </button>
                </OverlayTrigger>
              )}
            </div>
          )}
          <hr className="mt-4" />
        </div>

        {show === "bestPractices" && <BestPracticesModal {...{ setShow, show }} />}
        <LeavePageModal {...{ showModal, onClick, onClose }} save={false} />
      </div>

      <div id="video-uploading-model-div">
        <Modal
          backdrop="static"
          keyboard={false}
          show={show_one}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="video-uploading-model"
        >
          <Modal.Header className="video-uploader-model bg-white">
            <Modal.Title className="flex-between font-16 w-100" style={{ color: "#323C47" }}>
              What is the recommended frequency for sampling this video?
              <img
                className="cursor-pointer"
                src="/closeicon.svg"
                onClick={() => {
                  setShow_one(false);
                  setLoading(false);
                  setStepper("upload");
                  setNumber_of_images(0);
                  setVideo_fps(0);
                  setMax_no_of_frames(0);
                  setUserFPS(1);
                  setSlidervalue(60);
                }}
              />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column justify-content-center align-items-center gap-1  border-top">
            <img src={video_details.video_thumbnail} className="uploaded-video-img" />
            <div className="font-14 d-flex justify-content-center">
              <span className="font-500  text-truncate" style={{ maxWidth: "150px" }}>
                {video_details.file_name?.slice(0, -4)}
              </span>
              <span className="font-500">{video_details.file_name?.slice(-4)}</span>
              <span style={{ color: "#A0A1AB" }}> &nbsp;({video_details.duration})</span>
            </div>
            {stepper === "upload" ? (
              <>
                <span className="font-14 font-600">Select frame rates as per your requirement</span>
                <div className="w-100 mt-5" id="rc-slider">
                  <TooltipSlider
                    max={119}
                    min={1}
                    defaultValue={[60]}
                    onChange={(e: any) => {
                      setSlidervalue(e);
                    }}
                    tipFormatter={(value) => {
                      if (value === 60) {
                        return `1 Frame / second`;
                      } else if (value > 60) {
                        return `1 Frame / every ${value - 59} seconds`;
                      } else {
                        return `${61 - value} Frames / second`;
                      }
                      // `${value}!`
                    }}
                    tipProps={1}
                  />

                  <div className="d-flex justify-content-between w-100 ">
                    <span className="font-9">60 Frames / second</span>
                    <span className="font-9">1 Frame / every 60 seconds</span>
                  </div>
                </div>

                <div className="font-14">
                  {loading ? (
                    <ShimmerThumbnail height={15} className="mb-0" width={150} rounded />
                  ) : (
                    <>
                      <span>Output Size: </span>
                      <span>
                        {number_of_images} {number_of_images > 1 ? "Images" : "Image"}
                      </span>
                    </>
                  )}
                </div>

                <button
                  className="btn btn-primary text-white model-buttons mt-3"
                  onClick={convertToFrames}
                >
                  Choose Frame Rate
                </button>
              </>
            ) : (
              <>
                <div className="d-flex justify-content-center align-items-center gap-3">
                  <span className="exporting-text">Exporting Image Sequence</span>
                  <div className="progress-bar frames-pgb">
                    <div className="progress-fill" id="progress"></div>
                  </div>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default Upload;
