import { getModelType, isRole, userAccess } from "common_functions/functions";
import { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ShimmerThumbnail } from "react-shimmer-effects";
import { toast } from "react-toastify";

import AnnotationService from "services/annotation.service";

const annotationService = new AnnotationService();

const AnnotationNav = ({ user, router, changeImage, details }: any) => {
  const [editName, setEditName] = useState("");
  const [prevName, setPrevName] = useState("");

  useEffect(() => {
    setEditName(details.model_name);
  }, [details]);

  const { unannotated_count: unann, image_id, status } = details;
  const [edit, setEdit] = useState(false);
  const [tab, setTab] = useState("shimmer");

  useEffect(() => {
    if (router?.query?.uuid)
      setTab(
        router?.query?.evaluate !== undefined
          ? "evaluate"
          : router?.query?.train !== undefined
          ? "train"
          : router?.query?.annotate !== undefined
          ? "annotate"
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
    <div className="d-flex flex-wrap justify-content-between w-100 gap-3" id="top">
      <div className="">
        {details.load ? (
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
          {isRole(user, "annotator") ? (
            <OverlayTrigger
              overlay={
                <Tooltip id="tooltip-engine">You don't have access to upload images</Tooltip>
              }
            >
              <div className="text-center mx-2 cr-p">
                <img src="/annotations/ys2.svg" alt="step-3" />
                <p className="font-12 m-0 p-0 text-muted">Annotate</p>
              </div>
            </OverlayTrigger>
          ) : (
            <div
              className="text-center me-2 cr-p"
              onClick={() =>
                changeImage(router.pathname.replace("[uuid]", router.query.uuid) + "#top")
              }
            >
              <img
                src={`/annotations/${
                  tab === "shimmer" ? "ys1" : tab === "images" ? "p1" : "c1"
                }.svg`}
                alt="step-1"
              />
              <p className={"font-12 m-0 p-0 text-primary " + (tab === "images" ? "fw-bold" : "")}>
                Data
              </p>
            </div>
          )}

          <img
            src={
              (!["shimmer", "images"].includes(tab) || image_id) && !isRole(user, "annotator")
                ? "/annotations/line.svg"
                : "/annotations/dot.svg"
            }
            alt=""
            className="mb-3"
          />

          {!["shimmer", "images"].includes(tab) || image_id ? (
            <div
              className="text-center mx-2 cr-p"
              onClick={() =>
                changeImage(router.pathname.replace("[uuid]", router.query.uuid) + `?annotate#top`)
              }
            >
              <img src={`/annotations/${tab === "annotate" ? "p2" : "c2"}.svg`} alt="step-3" />
              <p
                className={"font-12 m-0 p-0 text-primary " + (tab === "annotate" ? "fw-bold " : "")}
              >
                Annotate
              </p>
            </div>
          ) : (
            <OverlayTrigger
              overlay={<Tooltip id="tooltip-engine">Upload images to annotate</Tooltip>}
            >
              <div className="text-center mx-2 cr-p">
                <img src="/annotations/ys2.svg" alt="step-3" />
                <p className="font-12 m-0 p-0 text-muted">Annotate</p>
              </div>
            </OverlayTrigger>
          )}

          <img
            src={
              (["train", "evaluate"].includes(tab) || (image_id && unann === 0)) &&
              !isRole(user, "annotator")
                ? "/annotations/line.svg"
                : "/annotations/dot.svg"
            }
            alt=""
            className="mb-3"
          />

          {(["train", "evaluate"].includes(tab) || (image_id && unann === 0)) &&
          !isRole(user, "annotator") ? (
            <div
              className="text-center mx-2 cr-p"
              onClick={() =>
                changeImage(router.pathname.replace("[uuid]", router.query.uuid) + `?train#top`)
              }
            >
              <img src={`/annotations/${tab === "train" ? "p3" : "c3"}.svg`} alt="step-3" />
              <p className={"font-12 m-0 p-0 text-primary " + (tab === "train" ? "fw-bold " : "")}>
                Train
              </p>
            </div>
          ) : (
            <OverlayTrigger
              overlay={
                <Tooltip id="tooltip-engine">
                  {isRole(user, "annotator")
                    ? "You don't have access to train model"
                    : "Annotate all images to train model"}
                </Tooltip>
              }
            >
              <div className="text-center mx-2 cr-p">
                <img src="/annotations/ys3.svg" alt="step-3" />
                <p className="font-12 m-0 p-0 text-muted">Train</p>
              </div>
            </OverlayTrigger>
          )}

          <img
            src={
              (["evaluate"].includes(tab) || status === "Live") &&
              (user ? userAccess(user, "test_model") : true)
                ? "/annotations/line.svg"
                : "/annotations/dot.svg"
            }
            alt=""
            className="mb-3"
          />

          {(["evaluate"].includes(tab) || status === "Live") &&
          (user ? userAccess(user, "test_model") : true) ? (
            <div
              className="text-center cr-p"
              onClick={() =>
                changeImage(router.pathname.replace("[uuid]", router.query.uuid) + `?evaluate#top`)
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

export default AnnotationNav;
