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
const imageBatchService = new ImageBatchService();

const trainService = new ModelTrainService();

const clss = (name, is_previous) => {
  return {
    id: "a" + uuidv4(),
    name,
    changeTagName: false,
    images: [],
    selectedImages: [],
    selectedJsonFile: [],
    previewImages: [],
    is_previous: is_previous,
  };
};

const Upload = ({ router, Router }: any) => {
  const [classes, setClasses] = useState([clss("", false), clss("", false)]);
  const [render, setRender] = useState(false);
  const [reRender, setRerender] = useState(false);
  const [showModal, setShowModal] = useState("");
  const [state, setState] = useState<any>({ stop: false, redirect: "" });
  const [details, setDetails] = useState<any>({ model_name: "", categories: [], loading: true });
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState(false);

  const [count, setCount] = useState(0);

  useEffect(() => {
    const getDetails = async () => {
      trainService
        .getModelDetails(router?.query?.uuid)
        .then((res) => {
          if (res?.annotation_details?.categories.length > 0)
            setClasses(_.map(res.annotation_details.categories, (e) => clss(e.name, true)));

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

  const renderPhotos = (classes, tag, source) => {
    return source.map((photo) => {
      return (
        <div className="m-0" key={photo.id}>
          <img
            src={photo.blobFile}
            alt=""
            className=""
            style={{ height: 50, width: 50, borderRadius: 5, opacity: photo.selected ? 0.3 : 1 }}
          />
          <div className="overlay">
            <img
              onClick={() => {
                const allClasses = classes;
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
                const index = _.findIndex(allClasses, { id: tag.id });
                allClasses.splice(index, 1, selectedTag);
                setClasses(allClasses);
                setRender(!render);
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

  const deleteClass = (id) => {
    if (classes.length <= 2) {
      toast.error("Minimum number of classes are 2");
    } else {
      const allClasses1 = classes;
      _.remove(allClasses1, function (e: any) {
        return e.id === id;
      });
      setClasses(allClasses1);
      setRender(!render);
    }
  };
  const isDuplicate = (value) => {
    let x = 1;
    classes.map((tag: any) => {
      if (tag.name === value) {
        x = 0;
      }
    });
    if (x === 0) {
      return x;
    } else {
      return x;
    }
  };

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

  useEffect(() => {
    setState({
      ...state,
      stop: _.filter(classes, (e) => e.selectedImages.length > 0).length > 0,
    });
    if (path) router.replace(path);
  }, [classes, render]);

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

  const uploadImages = (path: any, redirect?: any) => {
    if (loading) return;
    let err = false;
    classes.map((ele) => {
      if (ele.name === "" || ele.name === null) {
        if (!err) toast.error("Please add class names for all classes");
        err = true;
      }
    });
    if (err) return;
    else if (
      _.filter(
        classes,
        (e) =>
          !details.categories.map((elem) => elem.name).includes(e.name) &&
          e.selectedImages.length < 10
      ).length > 0
    )
      toast.error("Minimum 10 images should be added for each class");
    else if (redirect) {
      setState({ ...state, stop: false });
      let uploadImageCount = 0;
      let allImageCount = 0;
      let successImgCount = 0;
      let uploadStart = false;

      classes.map((ele1) => {
        allImageCount += ele1.selectedImages.length;
      });
      classes.map((ele) => {
        let tempUrls = _.chunk(ele.selectedImages, 25);
        tempUrls.map((e, idx) => {
          e.map((e1, id1) => {
            const imgFormData = new FormData();
            const name = ele.name;
            imgFormData.append("class_name", name ? name : `Class ${idx}`);
            imgFormData.append("asset", e1.img, e1.img.name);
            setLoading(true);
            uploadStart = true;
            imageBatchService
              .createModelImages(router.query.uuid.trim(), imgFormData)
              .then(() => successImgCount++)
              .catch(() => toast.error("api failed"))
              .finally(() => {
                uploadImageCount++;
                // console.log("uploadImageCount", ele.name);
                if (uploadImageCount !== allImageCount) return;
                setRerender(!reRender);
                const categories = [];
                setDetails({ ...details, categories });
                setLoading(false);
                if (successImgCount === uploadImageCount) {
                  toast.success("Images uploaded successfully");
                  setPath(path);
                } else toast.error("Error uploading all images");
              });
          });
        });
      });
      if (!uploadStart) {
        router.replace(path);
      }
    } else router.replace(path);
  };

  return (
    <div className="mainc container-fluid flex-grow-1" id="top">
      <div className="border border-light rounded bg-white mb-5 p-4" style={{ minHeight: "100%" }}>
        <CustomModalNav {...{ router, uploadImages, details }} />
        <hr id="divider" style={{ marginTop: "6px", marginBottom: "6px" }} />

        <p className="d-flex font-inter">
          Upload images
          <OverlayTrigger placement="bottom" overlay={popover}>
            <img className="mx-2" src="/images/clarity_info-standard-line.svg" />
          </OverlayTrigger>
        </p>

        <div className="d-flex justify-content-around p-0">
          <div className="row mt-3 w-100">
            {classes.map((item: any, indx) => {
              return (
                <div className="col-md-6 p-0" key={item.id}>
                  <div className="block-background p-4 m-2">
                    {details.loading ? (
                      <ShimmerThumbnail height={30} width={50} className="m-0" rounded />
                    ) : (
                      <div>
                        {item.changeTagName ? (
                          <input
                            className="form-control"
                            type="text"
                            placeholder={item.name || `Class ${indx}`}
                            defaultValue={item.name}
                            onBlur={(e) => {
                              const allClasses: any = classes;
                              allClasses.map((tag: any) => {
                                tag.changeTagName = false;
                              });
                              const selectedTag = _.find(allClasses, (tag: any) => {
                                return tag.id === item.id;
                              });
                              const isNew = (value) => {
                                let x = 1;
                                allClasses.map((tag: any, idx: any) => {
                                  if (tag.name === value && idx !== indx) {
                                    x = 0;
                                  }
                                });
                                if (x === 0) {
                                  toast.error("Class name should be unique");
                                  return x;
                                } else {
                                  return x;
                                }
                              };
                              selectedTag.name =
                                e.target.value.length > 0 && isNew(e.target.value)
                                  ? e.target.value
                                  : selectedTag.name;
                              const index = _.findIndex(allClasses, { id: item.id });
                              allClasses.splice(index, 1, selectedTag);
                              setClasses([...allClasses]);
                              setRender(!render);
                            }}
                            autoFocus
                          />
                        ) : (
                          <>
                            <div className="d-flex justify-content-between">
                              <div className="d-flex">
                                <h4 className="fw-bold">{item.name || `Class ${indx}`}</h4>
                                {!item.is_previous
                                  ? _.filter(details.categories, (e) => e === item.name).length ===
                                      0 && (
                                      <img
                                        className="m-2 cr-p"
                                        src="/images/edit-icon.svg"
                                        alt="edit-icon"
                                        onClick={() => {
                                          const allClasses: any = classes;
                                          allClasses.map((tag: any) => {
                                            tag.changeTagName = false;
                                          });
                                          const selectedTag = _.find(allClasses, (tag: any) => {
                                            return tag.id === item.id;
                                          });
                                          selectedTag.changeTagName = true;
                                          const index = _.findIndex(allClasses, {
                                            id: item.id,
                                          });
                                          allClasses.splice(index, 1, selectedTag);
                                          setClasses([...allClasses]);
                                          setRender(!render);
                                        }}
                                      />
                                    )
                                  : ""}
                              </div>
                              {!item.is_previous
                                ? _.filter(details.categories, (e) => e === item.name).length ===
                                    0 && (
                                    <div className="justify-content-right cr-p">
                                      <img
                                        src="/images/delete-icon.svg"
                                        alt="delete-icon"
                                        onClick={() => {
                                          deleteClass(item.id);
                                        }}
                                      />
                                    </div>
                                  )
                                : ""}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    <hr />
                    <div className="">
                      <p className="text-muted font-inter">Add training images</p>
                      <div className="my-1">
                        {details.loading ? (
                          <div className="bg-white p-4">
                            <ShimmerThumbnail height={30} className="m-0" rounded />
                            <ShimmerThumbnail height={30} className="m-0" rounded />
                          </div>
                        ) : (
                          <PreviewDropzone
                            item={item}
                            classId={item.id}
                            classes={classes}
                            setClasses={setClasses}
                            maxNumberOfImages={5000}
                            acceptedFileExtention={["image/jpeg", "image/png", "image/jpg"]}
                          />
                          // <FileUploader
                          //   model_id={router.query.uuid.trim()}
                          //   item={item}
                          //   classId={item.id}
                          //   classes={classes}
                          //   setClasses={setClasses}
                          //   maxNumberOfImages={1000}
                          //   acceptedFileExtention={["image/jpeg", "image/png", "image/jpg"]}
                          //   upload_images
                          //   {...{ count, setCount }}
                          // />
                        )}
                      </div>
                      <div
                        className="d-flex flex-wrap bg-white pt-2 container large-2"
                        key={item.id}
                        style={{ minHeight: "85px", maxHeight: "230px", overflowY: "auto" }}
                      >
                        {renderPhotos(classes, item, item.selectedImages)}
                      </div>
                    </div>

                    <hr />
                    <div className="d-flex justify-content-between">
                      {/* // As per Todd request changed sample count 50 to 10 */}
                      <p className="text-muted font-inter">
                        {router?.query?.reTrain ? "" : "Minimum of 10 images"}
                      </p>
                      <p className="text-muted font-inter">{item.selectedImages.length} images</p>
                    </div>
                  </div>
                </div>
              );
            })}
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
                  const allClasses: any = classes;
                  allClasses.push(clss("", false));
                  setClasses(allClasses);
                  setRender(!render);
                }}
              >
                Add class
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

export default Upload;
