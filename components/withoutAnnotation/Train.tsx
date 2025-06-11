import { useEffect, useState } from "react";
import { OverlayTrigger, ProgressBar, Spinner, Tab, Tabs, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";

import CustomModalNav from "@components/navigation/CustomModalNav";
import AnnotationService from "services/annotation.service";
import ModelTrainService from "services/model.train.service";
import Progressbar_new from "@components/custom_progress_bar/progress_bar_new";
import { ShimmerThumbnail } from "react-shimmer-effects";

const trainService = new ModelTrainService();
const annotationService = new AnnotationService();
const class_balance_array = [
  { cat: "Table class", nm: 10, progress_range: 10, txt: "Under Representation" },
  { cat: "Pot class", nm: 27, progress_range: 100, txt: "Over Representation" },
  { cat: "Chair class", nm: 21, progress_range: 100, txt: "over Representation" },
];
const labels = {
  model_name: "object detection",
  status: "Draft",
  categories: [
    { name: "grass", count: 27 },
    { name: "seeds", count: 7 },
  ],
  total: 34,
};

const Train = ({ user, router }) => {
  const [details, setDetails] = useState<any>({
    loading: true,
    model_name: "",
    categories: [],
    status: "Draft",
    total: 0,
  });
  const [isTrainingStarted, setIsTrainingStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [trainedResults, setTrainedResults] = useState<any>({});
  const [completed, setCompleted] = useState(false);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const getDetails = async () => {
      trainService
        .getModelDetails(router?.query?.uuid)
        .then((res) => {
          setDetails({
            model_name: res?.name,
            categories: res?.annotation_details?.categories || [],
            loading: false,
            status: res?.status,
            total: res?.annotation_details?.total,
          });
        })
        .catch((e) => {
          toast.error(e);
          router.replace("/my-models");
        });
    };
    setTimeout(getDetails, 4000);
  }, []);

  useEffect(() => {
    let _interval = setInterval(() => {
      if (isTrainingStarted) {
        trainService
          .getModelDetails(router.query.uuid)
          .then((response: any) => {
            setTrainedResults(response);
            setTimer(timer + 1);
          })
          .catch(() => {
            setLoading(false);
            router.push("/create-model");
            toast.error("Your model is failed, please train again");
          });
      }
    }, 60000);
    return () => {
      clearInterval(_interval);
    };
  }, [timer, isTrainingStarted]);

  useEffect(() => {
    if (trainedResults?.is_trained) {
      setLoading(false);
      setCompleted(true);
      setDetails({ ...details, status: trainedResults?.status });
    }
  }, [trainedResults]);

  const handleTrainModel = () => {
    setLoad(true);
    annotationService
      .trainModel(router.query.uuid)
      .then((res) => {
        setIsTrainingStarted(true);
        setLoading(true);
        setLoad(false);
      })
      .catch((e) => {
        toast.error(e);
        setLoading(false);
        setLoad(false);
      });
  };
  const uploadImages = (path: any) => router.replace(path);
  return (
    <div className="mainc container-fluid flex-grow-1" id="top">
      <div
        className="d-flex flex-column border border-light rounded bg-white p-4"
        style={{ minHeight: "100%" }}
      >
        <CustomModalNav {...{ router, uploadImages, details }} />
        <hr id="divider" style={{ marginTop: "6px", marginBottom: "6px" }} />
        <>
          <div className="row g-3 my-2">
            <div className="col-12 col-md-6 col-xl-3">
              <div className=" card annotate-body h-100 font-inter block-background">
                <div className=" text-center">
                  {details.loading ? (
                    <ShimmerThumbnail height={15} width={25} className="mb-0" rounded />
                  ) : (
                    <h6 className="fw-bold">{details.total}</h6>
                  )}

                  <h6 className="card-title">Total dataset</h6>
                  <img src="/pie-chart1new.svg" />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card annotate-body h-100 font-inter block-background">
                <div className=" text-center">
                  {details.loading ? (
                    <ShimmerThumbnail height={15} width={25} className="mb-0" rounded />
                  ) : (
                    <h6 className="fw-bold">{Math.ceil(details.total * 0.8)}</h6>
                  )}

                  <h6 className="card-title">Training set</h6>
                  <p className="card-text font-14">
                    <img src="/pie-chart2new.svg" className="me-2" />
                    80% of Dataset Used
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card annotate-body h-100 font-inter block-background">
                <div className=" text-center">
                  {details.loading ? (
                    <ShimmerThumbnail height={15} width={25} className="mb-0 px-5" rounded />
                  ) : (
                    <h6 className="fw-bold">{Math.round(details.total * 0.1)}</h6>
                  )}

                  <h6 className="card-title">Validation set</h6>
                  <p className="card-text font-14">
                    <img src="/pie-chart3new.svg" className="me-2" /> 10% of Dataset Used
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card annotate-body h-100 font-inter block-background">
                <div className=" text-center">
                  {details.loading ? (
                    <ShimmerThumbnail height={15} width={25} className="mb-0" rounded />
                  ) : (
                    <h6 className="fw-bold">{Math.round(details.total * 0.1)}</h6>
                  )}

                  <h6 className="card-title">Test set</h6>
                  <p className="card-text font-14">
                    <img src="/pie-chart3new.svg" className="me-2" /> 10% of Dataset Used
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row d-flex flex-wrap my-3">
            <div className="col-12 col-lg-6">
              <div className="font-20-weight-600">Class Balance</div>
              <div
                className="block-background overflow-auto p-3 mt-3"
                style={{ maxHeight: "155px" }}
              >
                {details.loading ? (
                  <>
                    {class_balance_array.map((e, id) => (
                      <div className="d-flex flex-row w-100 align-items-center py-1 gap-4" key={id}>
                        <h6 className="txt-overflow mb-0" style={{ minWidth: "120px" }}>
                          <ShimmerThumbnail height={10} className="mb-0" rounded />
                        </h6>

                        <div className=" w-100">
                          <ShimmerThumbnail height={10} className="mb-0" rounded />
                        </div>
                        <h6 className="mb-0" style={{ minWidth: "120px" }}>
                          <ShimmerThumbnail height={10} className="mb-0" rounded />
                        </h6>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {(details && Array.isArray(details.categories) ? details.categories : []).map(
                      (e, id) => (
                        <div className="d-flex flex-row w-100 align-items-center py-2" key={id}>
                          <h6 className="txt-overflow mb-0" style={{ minWidth: "120px" }}>
                            {e.name}
                          </h6>

                          <div className=" w-100">
                            <Progressbar_new
                              bgcolor={
                                e.count <
                                  details.total / details.categories.length +
                                    (details.total / details.categories.length) * 0.1 &&
                                e.count >
                                  details.total / details.categories.length -
                                    (details.total / details.categories.length) * 0.1
                                  ? "green"
                                  : "red"
                              }
                              progress={(e.count / details.total) * 100}
                              height={8}
                            />
                          </div>
                          <h6 className="me-3 text-center mb-0" style={{ minWidth: "50px" }}>
                            {e.count}
                          </h6>
                          <h6
                            className={
                              e.count <
                                details.total / details.categories.length +
                                  (details.total / details.categories.length) * 0.1 &&
                              e.count >
                                details.total / details.categories.length -
                                  (details.total / details.categories.length) * 0.1
                                ? "text-success mb-0"
                                : "text-danger mb-0"
                            }
                            style={{ minWidth: "120px" }}
                          >
                            {e.count <
                              details.total / details.categories.length +
                                (details.total / details.categories.length) * 0.1 &&
                            e.count >
                              details.total / details.categories.length -
                                (details.total / details.categories.length) * 0.1
                              ? "Balanced Class"
                              : e.count <
                                details.total / details.categories.length -
                                  (details.total / details.categories.length) * 0.1
                              ? "Minority Class"
                              : "Majority Class"}
                          </h6>
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="font-20-weight-600 text-center">Images</div>

              <div className="row d-flex justify-content-center p-3 gap-5">
                <div
                  style={{ width: "250px" }}
                  className=" gap-2 card annotate-body h-100   font-inter block-background text-center p-3"
                >
                  {details.loading || !labels ? (
                    <ShimmerThumbnail height={25} width={25} className="mb-0" rounded />
                  ) : (
                    <span className="annotate_number ">{details?.total}</span>
                  )}

                  <div className="text-start">
                    {details.loading || !labels ? (
                      <ShimmerThumbnail height={15} className="mb-0" rounded />
                    ) : (
                      <div className="text-center">
                        <img src="/annotate_icon2.svg" />
                        <span className="ms-3">
                          across {details?.categories?.length}{" "}
                          {details?.categories?.length > 1 ? "classes" : "class"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="d-flex flex-column justify-content-center align-items-center  block-background mt-2">
              <div className=" d-flex flex-column justify-content-center align-items-center p-3 gap-2 py-5">
                <img src="/cropped_loading.gif" width={120} alt="success" className="" />
                <h4 className="mb-2 fw-bold">Training started</h4>
                <div className="text-muted font-14 mb-1 text-center">
                  <span>Your model is processing. We will notify you at </span>
                  <span className="fw-bold">{user?.email}</span>
                  <span> once the model is ready.</span>
                </div>
              </div>
            </div>
          ) : completed ? (
            <div className="d-flex flex-column justify-content-center align-items-center  block-background mt-2">
              <div className=" d-flex flex-column justify-content-center align-items-center p-3 gap-2 py-5">
                <img src="/annot_com_tickmark.svg" width={60} alt="success" className="" />
                <h4 className="mb-2 fw-bold">Training completed</h4>
                <p className="text-muted font-14 mb-1 text-center">
                  Your model has finished training! See the accuracy score below and view results.
                </p>
                {trainedResults?.model_type !== "image_similarity" ? (
                  <p className="text-muted font-14 mb-1 fw-bold">
                    Model accuracy{" - "}
                    {trainedResults?.model_type === "ocr"
                      ? `${(trainedResults?.extra.result.accuracy * 100).toFixed(2)}%`
                      : trainedResults?.model_type === "segmentation"
                      ? `${(trainedResults?.extra[0]["Mean IOU:"] * 100).toFixed(2)}%`
                      : trainedResults?.model_type === "object_detection"
                      ? `${(trainedResults?.extra[0].test_iou * 100).toFixed(2)}%`
                      : trainedResults?.model_type === "instance"
                      ? `${(trainedResults?.extra[0].map * 100).toFixed(2)}%`
                      : trainedResults?.model_type === "classification"
                      ? `${(trainedResults?.extra * 100).toFixed(2)}%`
                      : "-"}
                  </p>
                ) : (
                  ""
                )}
                {/* <p className="text-muted font-18 mb-1 text-center">
                    {trainedResults?.model_type === "ocr"
                      ? `${(trainedResults?.extra.result.accuracy * 100).toFixed(2)}%`
                      : trainedResults?.model_type === "segmentation"
                      ? `${(trainedResults?.extra[0]["Mean IOU:"] * 100).toFixed(2)}%`
                      : trainedResults?.model_type === "object_detection"
                      ? `${(trainedResults?.extra[0].test_iou * 100).toFixed(2)}%`
                      : trainedResults?.model_type === "instance"
                      ? `${(trainedResults?.extra[0].map * 100).toFixed(2)}%`
                      : "-"}
                  </p> */}
                <button
                  className="btn btn-primary font-14 py-3 px-5"
                  onClick={() =>
                    router.replace(
                      router.pathname.replace("[uuid]", router.query.uuid) + `?evaluate#top`
                    )
                  }
                >
                  Test model
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column justify-content-center align-items-center  block-background mt-2 ">
              <div className=" d-flex flex-column justify-content-center align-items-center p-3 gap-2 py-5">
                <img src="/annot_com_tickmark.svg" width={60} alt="success" className="" />
                <h4 className="mb-2 fw-bold">Images uploaded</h4>
                <div className="text-muted font-14 mb-1 text-center">
                  Now you are ready to build your own custom model.
                </div>
                {details.annotated_count < 10 ? (
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-engine">
                        Annotate atleast 10 images to train model
                      </Tooltip>
                    }
                  >
                    <button
                      className="btn btn-primary font-14 py-3 px-5"
                      style={{ opacity: "0.65" }}
                    >
                      Train model
                    </button>
                  </OverlayTrigger>
                ) : (
                  <button className="btn btn-primary font-14 py-3 px-5" onClick={handleTrainModel}>
                    {load && <Spinner animation="border" className="me-2 sp-wh" />}
                    {` Train model`}
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Train;
