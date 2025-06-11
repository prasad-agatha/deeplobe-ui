import { getModelType } from "common_functions/functions";
import { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ShimmerThumbnail } from "react-shimmer-effects";
import { toast } from "react-toastify";

import AnnotationService from "services/annotation.service";

const annotationService = new AnnotationService();

const CustomModalNav = ({ router, uploadImages, details }: any) => {
  const [editName, setEditName] = useState("");
  const [prevName, setPrevName] = useState("");
  useEffect(() => {
    setEditName(details.model_name);
  }, [details]);
  const { status } = details;
  const [edit, setEdit] = useState(false);
  const [tab, setTab] = useState("shimmer");

  useEffect(() => {
    if (router?.query?.uuid)
      setTab(
        router?.query?.evaluate !== undefined
          ? "evaluate"
          : router?.query?.train !== undefined
          ? "train"
          : "images"
      );
  }, [router?.query]);

  const updateName = async () => {
    setEdit(false);
    if (editName.trim() && editName.trim() !== prevName) {
      annotationService
        .createAnnotations(router.query.uuid, "name", getModelType(router.pathname), {
          name: editName.trim(),
        })
        .catch((e) => {
          toast.error(e);
          setEditName(prevName);
        });
    } else setEditName(prevName);
  };

  return (
    <div className="d-flex flex-wrap justify-content-between w-100 gap-3">
      <div className="">
        {details.loading ? (
          <ShimmerThumbnail className="m-0" height={30} />
        ) : (
          <>
            {edit ? (
              <input
                className="form-control"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={updateName}
                onKeyDown={(e) => e.code === "Enter" && updateName()}
                autoFocus
              />
            ) : (
              <div className="d-flex">
                <h4 className="fw-bold text-truncate">{editName || "Enter Model name"}</h4>
                {tab !== "evaluate" && (
                  <img
                    className="ms-2 cursor-pointer"
                    src="/images/edit-icon.svg"
                    alt="edit-icon"
                    onClick={() => {
                      setPrevName(editName.trim());
                      setEdit(true);
                    }}
                  />
                )}
              </div>
            )}
          </>
        )}

        <div className="">{getModelType(router?.pathname, true)}</div>
      </div>

      <div className="ms-auto">
        <div className="d-flex align-items-center w-100" style={{ maxWidth: "500px" }}>
          <div
            className="text-center me-2 cr-p"
            onClick={() => uploadImages(router.pathname.replace("[uuid]", router.query.uuid))}
          >
            <img
              src={`/annotations/${tab === "shimmer" ? "ys1" : tab === "images" ? "p1" : "c1"}.svg`}
              alt="step-1"
            />
            <p className={"font-12 m-0 p-0 text-primary " + (tab === "images" ? "fw-bold" : "")}>
              Data
            </p>
          </div>

          <img
            src={`/annotations/${
              details.categories.length > 0 ||
              ["train", "evaluate"].includes(tab) ||
              status === "Live"
                ? "line"
                : "dot"
            }.svg`}
            alt=""
            className="mb-3"
          />

          {details.categories.length > 0 ||
          ["train", "evaluate"].includes(tab) ||
          status === "Live" ? (
            <div
              className="text-center mx-2 cr-p"
              onClick={() =>
                uploadImages(router.pathname.replace("[uuid]", router.query.uuid) + `?train#top`)
              }
            >
              <img src={`/annotations/${tab === "train" ? "p3" : "c3"}.svg`} alt="step-3" />
              <p className={"font-12 m-0 p-0 text-primary " + (tab === "train" ? "fw-bold " : "")}>
                Train
              </p>
            </div>
          ) : (
            <OverlayTrigger
              overlay={<Tooltip id="tooltip-engine">Upload images to train model</Tooltip>}
            >
              <div className="text-center mx-2 cr-p">
                <img src="/annotations/ys3.svg" alt="step-3" />
                <p className="font-12 m-0 p-0 text-muted">Train</p>
              </div>
            </OverlayTrigger>
          )}

          <img
            src={
              ["evaluate"].includes(tab) || status === "Live"
                ? "/annotations/line.svg"
                : "/annotations/dot.svg"
            }
            alt=""
            className="mb-3"
          />

          {details.categories.length > 0 || ["evaluate"].includes(tab) || status === "Live" ? (
            <div
              className="text-center cr-p"
              onClick={() =>
                uploadImages(router.pathname.replace("[uuid]", router.query.uuid) + `?evaluate#top`)
              }
            >
              <img src={`/annotations/${tab === "evaluate" ? "p4" : "c4"}.svg`} alt="step-4" />
              <p
                className={"font-12 m-0 p-0 text-primary " + (tab === "evaluate" ? "fw-bold " : "")}
              >
                Evaluate
              </p>
            </div>
          ) : (
            <OverlayTrigger
              overlay={<Tooltip id="tooltip-engine">Train model to evaluate</Tooltip>}
            >
              <div className="text-center cr-p">
                <img src="/annotations/ys4.svg" alt="step-4" />
                <p className="font-12 m-0 p-0 text-muted">Evaluate</p>
              </div>
            </OverlayTrigger>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModalNav;
