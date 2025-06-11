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

const LLMTrain = ({ user, router }) => {
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
          <>
            <div className="row g-3 my-2">
              <div className="col-12 ">
                <div className=" card annotate-body h-100 font-inter block-background py-5">
                  <div className=" text-center">
                    {details.loading ? (
                      <ShimmerThumbnail height={15} width={25} className="mb-0" rounded />
                    ) : (
                      <h6 className="fw-bold ">{details.total}</h6>
                    )}

                    <h6 className="card-title my-3 fw-bold">Total Files Uploaded</h6>
                  </div>
                </div>
              </div>
            </div>
          </>

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
                  Your model has finished training!
                </p>

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
                <h4 className="mb-2 fw-bold">Files uploaded</h4>
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

export default LLMTrain;
