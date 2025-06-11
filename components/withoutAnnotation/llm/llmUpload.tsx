import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import _, { random } from "lodash";
import { OverlayTrigger, Popover, Spinner } from "react-bootstrap";
import { ShimmerThumbnail } from "react-shimmer-effects";

import { PreviewDropzone } from "@components/dropzone";
import LeavePageModal from "@components/modals/LeavePage";
import CustomModalNav from "@components/navigation/CustomModalNav";

import ModelTrainService from "services/model.train.service";
import ImageBatchService from "services/imageupload.service";
import { getBlob, getDataBlob, getDataBlob1, getModelType } from "common_functions/functions";
const imageBatchService = new ImageBatchService();

const trainService = new ModelTrainService();

const clss = (name) => {
  return {
    changeTagName: false,
    images: [],
    selectedImages: [],
  };
};

const llmUpload = ({ router, Router }: any) => {
  const [classes, setClasses] = useState<any>(clss(router));
  const [errorMessages, setErrorMessages] = useState([]);
  const [render, setRender] = useState(false);
  const [reRender, setRerender] = useState(false);
  const [showModal, setShowModal] = useState("");
  const [state, setState] = useState<any>({ stop: false, redirect: "" });
  const [details, setDetails] = useState<any>({ model_name: "", categories: [], loading: true });
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState(false);

  const [files, setFiles] = useState([]);

  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(files, "ew filesssssssss");
  }, files);

  useEffect(() => {
    const getDetails = async () => {
      trainService
        .getModelDetails(router?.query?.uuid)
        .then((res) => {
          if (res?.annotation_details?.categories.length > 0)
            setClasses(_.map(res.annotation_details.categories, (e) => clss(e.name)));

          setDetails({
            model_name: res?.name,
            categories: res?.annotation_details?.categories || [],
            loading: false,
          });
        })
        .catch((e) => {
          toast.error(e);
          router.replace("/my-models");
        });
    };
    getDetails();
  }, [reRender]);

  const popover = (
    <Popover id="popover-contained" className="ms-5">
      <Popover.Content
        className=" font-inter"
        style={{
          display: "flex",
          color: "white",
          background: "#263238",
          height: "50px",
          width: "600px",
          borderRadius: "8px",
          fontSize: "10px",
          alignItems: "center",
        }}
      >
        <p className="mb-0" style={{ color: "white" }}>
          Production models typically require up to a 1000 image threshold minimum or more for
          training in order to achieve high levels of accuracy!
        </p>
      </Popover.Content>
    </Popover>
  );

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

  const onClose = () => {
    setState({ ...state, redirect: "" });
    setShowModal("");
  };

  const onClick = () => {
    setShowModal("");
    if (showModal === "step1" && state.redirect) router.push(state.redirect);
  };

  const uploadImages = async (path: any, redirect?: any) => {
    if (loading) return;
    else if (files.length < 1) {
      toast.error("please upload files to continue");
      return;
    } else if (redirect) {
      setState({ ...state, stop: false });
      let allImageCount = files.length;
      console.log(allImageCount, "all image count");
      let uploadImageCount = 0;
      let successImgCount = 0;
      let uploadStart = false;

      let chunck_files = _.chunk(files, 25);

      //   async function uploadImages1() {
      for (let ele of chunck_files) {
        ele.map(async (e) => {
          const imgFormData = new FormData();
          imgFormData.append("asset", e);
          setLoading(true);
          uploadStart = true;

          try {
            await imageBatchService.createModelImages(router.query.uuid.trim(), imgFormData);
            successImgCount++;
          } catch (error) {
            toast.error("API failed");
          } finally {
            uploadImageCount++;
            if (uploadImageCount !== allImageCount) {
              console.log("uploadImageCount !== allImageCount", uploadImageCount, allImageCount);
              return;
            }
            setRerender(!reRender);
            const categories = [];
            setDetails({ ...details, categories });
            setLoading(false);
            if (successImgCount === uploadImageCount) {
              toast.success("Images uploaded successfully");
              router.replace(path);
            } else {
              toast.error("Error uploading all images");
            }
          }
        });
      }
      //   }

      //   uploadImages1();

      if (!uploadStart) {
        router.replace(path);
      }
    } else router.replace(path);
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
            setClasses(clss(router));
            setErrorMessages([]);
          }}
        >
          <img src="/images/delete-icon.svg" alt="delete-icon" />
        </div>
      </div>
    );
  };

  return (
    <div className="mainc container-fluid flex-grow-1" id="top">
      <div className="border border-light rounded bg-white mb-5 p-4" style={{ minHeight: "100%" }}>
        <CustomModalNav {...{ router, uploadImages, details }} />
        <hr id="divider" style={{ marginTop: "6px", marginBottom: "6px" }} />

        <p className="d-flex font-inter">
          Upload files
          <OverlayTrigger placement="bottom" overlay={popover}>
            <img className="mx-2" src="/images/clarity_info-standard-line.svg" />
          </OverlayTrigger>
        </p>

        <div className="d-flex justify-content-around p-0">
          <div className="row mt-3 w-100">
            <div className="col-12 p-0">
              <div className="block-background p-4 m-2">
                <div className="">
                  <p className="text-muted font-inter">Add training files</p>
                  <div className="my-1">
                    {details.loading ? (
                      <div className="bg-white p-4">
                        <ShimmerThumbnail height={30} className="m-0" rounded />
                        <ShimmerThumbnail height={30} className="m-0" rounded />
                      </div>
                    ) : (
                      <>
                        <PreviewDropzone
                          item={files}
                          classId="llm"
                          classes="dummy"
                          setClasses={setFiles}
                          maxNumberOfImages={500}
                          acceptedFileExtention={[".pdf", "application/pdf", ".txt", "text/plain"]}
                        />
                        {files.length > 0 ? (
                          <div style={{ maxHeight: "250px", overflow: "auto" }}>
                            {files.map((image: any) => {
                              return (
                                <div className="d-flex border border-white rounded bg-white mt-3 p-3 justify-content-between">
                                  <div className="d-flex d-flex align-items-center">
                                    <img src="/ai-files-icon.svg" alt="" />
                                    <p
                                      className="p-0 text-muted text-truncate ms-2 mb-0"
                                      style={{ maxWidth: "450px" }}
                                    >
                                      {image.path}
                                    </p>
                                    <p className="p-0 text-muted mb-0">
                                      {" "}
                                      - {Math.ceil(image.size / 1024).toFixed(0)}kb
                                    </p>
                                  </div>
                                  <div
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      const temp = files.filter((img) => img !== image);
                                      setFiles(temp);
                                    }}
                                  >
                                    <img src="/images/delete-icon.svg" alt="delete-icon" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>

                <hr />
                <div className="d-flex justify-content-between">
                  <p className="text-muted font-inter mb-0">{files.length} files selected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {details.loading ? (
          <div className="d-flex mt-3 w-100 justify-content-center gap-2 flex-wrap">
            <div className="d-flex mt-3 w-100 justify-content-center gap-2 flex-wrap">
              <div>
                <ShimmerThumbnail height={30} width={50} className="m-0" rounded />
              </div>
              <div>
                <ShimmerThumbnail height={30} width={50} className="m-0" rounded />
              </div>
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-around p-0">
            <div className="d-flex mt-3 w-100 justify-content-center gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-outline-primary fw-bold font-inter"
                onClick={() => {
                  setFiles([]);
                  setRender(!render);
                }}
              >
                Clear
              </button>
              <button
                type="button"
                className="btn btn-outline-primary fw-bold font-inter"
                onClick={() =>
                  uploadImages(
                    router.pathname.replace("[uuid]", router.query.uuid) + `?train#top`,
                    "redirect"
                  )
                }
              >
                {loading && <Spinner animation="border" className="me-2 sp-wh" />}
                {` Continue`}
              </button>
            </div>
          </div>
        )}
      </div>

      <LeavePageModal {...{ showModal, onClick, onClose }} save={false} />
    </div>
  );
};

export default llmUpload;
