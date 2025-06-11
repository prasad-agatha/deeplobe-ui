import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import shortid from "shortid";
import { Image, Modal, OverlayTrigger, Popover, Spinner, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import useSWR from "swr";
import _ from "lodash";
import CreatableSelect from "react-select/creatable";
import ModelService from "services/model.service";
import InviteAnnotator from "components/page_elements/inviteAnnotator";
const modelService = new ModelService();

import {
  createSelectStyles,
  getBlob,
  getColor,
  getModelType,
  isRole,
} from "common_functions/functions";
import AnnotationNav from "@components/navigation/AnnotationNav";
import ToolBar from "@components/withAnnotation/AnnotationToolbar";
import Labels from "@components/withAnnotation/Labels";
import Images from "@components/withAnnotation/Images";
import { ShimmerImages, ShimmerToolBar } from "@components/annotation";

import AnnotationService from "services/annotation.service";
import LeavePageModal from "@components/modals/LeavePage";
// import InviteAnnotator from "@components/page_elements/inviteAnnotator";

const annotationService = new AnnotationService();

const RectangleKonva = dynamic(() => import("components/withAnnotation/RectangleKonva"), {
  ssr: false,
});
const PolygonKonva = dynamic(() => import("components/withAnnotation/PolygonKonva"), {
  ssr: false,
});

const getBbox = (bbox) => {
  const x = bbox[0];
  const y = bbox[1];
  const w = bbox[2];
  const h = bbox[3];
  return [w > 0 ? x : x + w, h > 0 ? y : y + h, w > 0 ? w : -w, h > 0 ? h : -h];
};
const getCoords = (newAnnotation) => {
  const bbox = getBbox(newAnnotation.bbox);
  const coords = [
    [bbox[0], bbox[1]],
    [bbox[0] + bbox[2], bbox[1]],
    [bbox[0] + bbox[2], bbox[1] + bbox[3]],
    [bbox[0], bbox[1] + bbox[3]],
  ];
  return {
    ...newAnnotation,
    bbox,
    coords,
    value: newAnnotation?.value?.trim() ? newAnnotation.value : "",
  };
};
const getInitialDetails = () => {
  return {
    load: true,
    model_name: "",
    width: 80,
    height: 80,
    selectedShape: null,
    mouseDown: false,
    isMouseOverStartPoint: false,
    annotations: [],
    newAnnotation: null,
    status: "Draft",
    image_id: "",
  };
};
const Annotate = ({ user, router, Router }: any) => {
  const polygonTool = ["segmentation", "instance"].includes(getModelType(router.pathname));
  const [details, setDetails] = useState<any>(getInitialDetails());
  const [curMousePos, setCurMousePos] = useState<any>(null);
  const [his, setHis] = useState<any>([]);
  const [hs, setHs] = useState(0);
  const [dms, setDms] = useState<any>({ width: 80, height: 80 });
  const [stageRef, setStageRef] = useState<any>(null);
  const [render, setRender] = useState(true);
  const [label, setLabel] = useState<any>({ name: "", color: "#000000", id: -1, count: 0 });
  const [save, setSave] = useState("");
  const [showModal, setShowModal] = useState("");
  const [state, setState] = useState<any>({ stop: false, redirect: "" });
  const [modal, setModal] = useState<any>({ show: false, data: null, load: false });
  const [finish, setFinish] = useState<any>(false);
  const [annotationInvitation, setAnnotationInvitation] = useState(false);
  const [paddleOcr, setPaddleOcr] = useState(false);
  const [models, setModels] = useState([]);

  const [inside, setInside] = useState(-1);
  const tempRef: any = useRef();

  useEffect(() => {
    const details = async () => {
      const r = await modelService.getallModels("&personal=true&exclude=true");
      setModels(r);
    };
    details();
  }, []);

  useEffect(() => {
    const getDetails = async () => {
      const annotate = router.query.annotate;
      const image_id = !Math.floor(annotate) || Number(annotate) < 1 ? "true" : annotate;
      // console.log(image_id);
      const ty = `image?model_type=${getModelType(router.pathname)}&image_id=${image_id}`;
      setRender(true);
      setStageRef(null);
      // console.log("API IMAGE");
      annotationService
        .getModelAnnotations(router.query.uuid, ty)
        .then((res) => {
          // console.log(his, details, showModal, "1");
          setDetails({ ...getInitialDetails(), load: false, ...res, image_id: res.id });
          setHis([{ ...getInitialDetails(), load: false, ...res }]);
          setHs(1);
        })
        .catch(() => router.replace(router.pathname.replace("[uuid]", router.query.uuid)))
        .finally(() => setRender(false));
    };
    if (showModal !== "step1" && his.length < 2) getDetails();
  }, [router.query, finish]);

  const ty = `categories?model_type=${getModelType(router.pathname)}`;
  const { data: labels, mutate: mutateLabels } = useSWR(
    `annotation-details/${router.query.uuid}/${ty}`,
    async () => {
      const res = await annotationService.getModelAnnotations(router.query.uuid, ty);
      return res.categories;
    }
  );

  const mutate = () => {
    mutateLabels();
  };

  useEffect(() => {
    if (
      labels &&
      labels.length > 0 &&
      (label.id < 0 || _.filter(labels, (lb) => lb.id === label.id).length === 0)
    )
      setLabel(labels[0]);
    else if (labels && labels.length === 0)
      setLabel({ name: "", color: "#000000", id: -1, count: 0 });
  }, [labels]);

  useEffect(() => {
    setState({ ...state, stop: his.length > 1 });
  }, [his]);
  // console.log(modal, "MODAL");

  const message = "Are you sure? Changes you made may not be saved.";
  useEffect(() => {
    if (state.stop && !state.redirect) {
      let isWarned = false;

      const routeChangeStart = (url: string) => {
        if (!url.includes(Router.pathname.replace("[uuid]", Router.query.uuid)) && !isWarned) {
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
          changeImage("");
          const event = e || window.event;
          event.returnValue = message;
          return message;
        }
        return null;
      };

      Router.events.on("routeChangeStart", routeChangeStart);
      window.addEventListener("beforeunload", beforeUnload);
      Router.beforePopState(({ url }) => {
        if (!url.includes(Router.pathname.replace("[uuid]", Router.query.uuid)) && !isWarned) {
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
    if (showModal === "step1" && state.redirect) changeImage(state.redirect);
  };

  const popover = (
    <Popover id="popover-basic" className="share-popover">
      <div className="flex-between p-3" style={{ maxWidth: "261px" }}>
        <h6 className="txt-lgray">Need professional help?</h6>
        <p className="font-12 txt-lgray">
          Get your annotation task done by experienced labelling team at affordable price while
          maintaining high quality output.
        </p>
        <Link href="/contact-us?name=api" passHref>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary font-12 w-100"
            style={{ borderRadius: "6px" }}
            onClick={() => document.body.click()}
          >
            Hire Professionals for Annotation
          </a>
        </Link>
      </div>
    </Popover>
  );

  const zoomStage = (event, index) => {
    event.preventDefault();
    let scaleBy = 1.25;
    if (stageRef !== null) {
      const stage = stageRef;
      const oldScale = stage.scaleX();
      const { x: pointerX, y: pointerY } = { x: 0, y: 0 };
      const mousePointTo = {
        x: (pointerX - stage.x()) / oldScale,
        y: (pointerY - stage.y()) / oldScale,
      };
      const newScale = index === 3 ? oldScale * scaleBy : oldScale / scaleBy;
      stage.scale({ x: newScale, y: newScale });
      const newPos = {
        x: pointerX - mousePointTo.x * newScale,
        y: pointerY - mousePointTo.y * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
      const image_obj = new window.Image();
      image_obj.src = details.url;
      image_obj.onload = () => {
        // console.log("2");
        setDms((pD) => {
          return {
            ...pD,
            width: index === 3 ? dms.width * scaleBy : dms.width / scaleBy,
            height: index === 3 ? dms.height * scaleBy : dms.height / scaleBy,
          };
        });
      };
    }
  };
  const defaultZoom = () => {
    if (stageRef !== null) {
      stageRef.scale({ x: 1, y: 1 });
      stageRef.position({ x: 0, y: 0 });
      stageRef.batchDraw();
    }
  };

  const getMousePos = (stage) => {
    return [
      stage.getPointerPosition().x / stage.getStage().scaleX(),
      stage.getPointerPosition().y / stage.getStage().scaleX(),
    ];
  };

  const handleMouseDown = (event) => {
    const { selectedShape, annotations, newAnnotation, isMouseOverStartPoint } = details;

    if (!polygonTool) {
      if (!selectedShape && !newAnnotation) {
        // console.log(label, "3");

        setDetails((pD) => {
          const stage = event.target.getStage();
          const oldScale = stage.scaleX();
          const { x, y } = event.target.getStage().getPointerPosition();
          const new_anno = {
            bbox: [x / oldScale, y / oldScale, 0, 0],
            image_id: details.id,
            category_id: label.id,
            id: shortid.generate(),
          };
          const annotations = pD.annotations;
          if (modal.show) {
            annotations.pop();
            setModal({ show: false, data: null, load: false });
          }
          return { ...pD, annotations, newAnnotation: new_anno, mouseDown: true };
        });
      }
    } else {
      const stage = event.target.getStage();
      const cl_annotations = _.cloneDeep(annotations);
      const index = _.findIndex(cl_annotations, { isFinished: false });
      if (event.target.className === "Image" && event.target.name() === "delete") {
        setDetails((pD) => {
          const new_ans = _.filter(cl_annotations, (e) => e.id !== event.target.id());
          const dtls = { ...pD, annotations: new_ans };
          setHis((pH) => pH.splice(0, hs).concat([dtls]));
          console.log("change hs");
          setHs((pHs) => pHs + 1);
          return dtls;
        });
      }
      if (index < 0) {
        if (event.target.className !== "Image") return;
        if (event.target.name()) return;
        const mousePos = getMousePos(stage);
        setDetails((pD) => {
          if (modal.show) {
            cl_annotations.pop();
            setModal({ show: false, data: null, load: false });
          }
          const new_ans = [
            ...cl_annotations,
            {
              segmentation: [mousePos],
              image_id: details.id,
              category_id: label.id,
              id: shortid.generate(),
              isFinished: false,
            },
          ];
          const dtls = { ...pD, annotations: new_ans };
          setHis((pH) => pH.splice(0, hs).concat([dtls]));
          console.log("change hs");
          setHs((pHs) => pHs + 1);
          return dtls;
        });
      } else {
        const newPos = getMousePos(stage);
        const { segmentation, isFinished } = cl_annotations[index];

        if (isFinished) return;
        const newPoints = [...segmentation, newPos];
        if (!isFinished) cl_annotations[index]["segmentation"] = newPoints;
        if (isMouseOverStartPoint && newPoints.length >= 3) {
          cl_annotations[index]["isFinished"] = true;
          cl_annotations[index]["segmentation"].pop();
          cl_annotations[index]["segmentation"] = [...segmentation, segmentation[0]];
        }
        setDetails((pD) => {
          const new_ans = [...cl_annotations];
          const dtls = { ...pD, annotations: new_ans };
          const lb = label.id === -1 ? null : label;
          if (isMouseOverStartPoint && newPoints.length >= 3)
            setModal({ show: true, data: { typ: "polygon", index, dtls }, label: lb, load: false });
          // setHis((pH) => pH.splice(0, hs).concat([dtls]));
          // console.log("change hs");
          // setHs((pHs) => pHs + 1);
          return dtls;
        });
      }
    }
  };
  // console.log(details, hs, his, "HIS");
  const handleMouseMove = (event) => {
    const { selectedShape, newAnnotation, annotations, mouseDown } = details;
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);
    let setPos = false;
    if (!polygonTool) {
      if (mouseDown) {
        if (!annotations[annotations.length]) {
          if (!selectedShape && newAnnotation) {
            const sx = newAnnotation.bbox[0];
            const sy = newAnnotation.bbox[1];
            // the function will return pointer position relative to the passed node
            const transform = event.target.getStage().getAbsoluteTransform().copy();
            // to detect relative position we need to invert transform
            transform.invert();

            // get pointer (say mouse or touch) position
            const pos = event.target.getStage().getStage().getPointerPosition();

            // now we find relative point
            const { x, y } = transform.point(pos);
            const new_anno = {
              bbox: [sx, sy, x - sx, y - sy],
              image_id: details.id,
              category_id: label.id,
              id: newAnnotation.id,
            };
            console.log("4");
            setPos = true;
            setDetails((pD) => {
              return { ...pD, newAnnotation: new_anno };
            });
          }
        }
      }
    }
    if (!setPos) setCurMousePos(mousePos);
  };

  const handleMouseUp = () => {
    const { selectedShape, newAnnotation, mouseDown } = details;

    if (!polygonTool) {
      if (mouseDown) {
        if (!selectedShape && newAnnotation) {
          // console.log("6");
          if (!newAnnotation.bbox[2] || !newAnnotation.bbox[3])
            setDetails((pD) => {
              return { ...pD, newAnnotation: null, mouseDown: false };
            });
          else createAnnotation();
        }
      }
    }
  };

  const handleMouseOverStartPoint = (event, item) => {
    if (item.isFinished || item.length < 3) return;
    event.target.scale({ x: 2, y: 2 });
    setDetails((pD) => {
      return { ...pD, isMouseOverStartPoint: true };
    });
  };

  const handleMouseOutStartPoint = (event) => {
    event.target.scale({ x: 1, y: 1 });
    setDetails((pD) => {
      return { ...pD, isMouseOverStartPoint: false };
    });
  };

  const handleMouseEnter = (event) => {
    event.target.getStage().container().style.cursor = "crosshair";
  };

  const createAnnotation = () => {
    const { annotations, newAnnotation } = details;
    const cl_annotations = _.cloneDeep(annotations);
    // console.log("7");
    setDetails((pD) => {
      const nw_ans = _.uniqWith([...cl_annotations, getCoords(newAnnotation)], _.isEqual);
      const dtls = { ...pD, annotations: nw_ans, newAnnotation: null, mouseDown: false };
      const lb = label.id === -1 ? null : label;
      setModal({ show: true, data: { typ: "rectangle", dtls }, label: lb, load: false });
      if (getModelType(router.pathname) === "ocr") {
        setPaddleOcr(true);
        annotationService
          .ocrTextDetection({
            image_url: pD.url,
            coords: getCoords(newAnnotation)
              .bbox.map((e) => Math.round(e))
              .join(","),
          })
          .then((res) =>
            setModal((mD) => {
              return { ...mD, field: res?.text };
            })
          )
          .finally(() => setPaddleOcr(false));
      }
      // setHis((pH) => pH.splice(0, hs).concat([dtls]));
      // console.log("change hs");
      // setHs((pHs) => pHs + 1);
      return dtls;
    });
  };

  const deleteAnnotation = (key: any) => {
    const { annotations } = details;
    const cl_annotations = _.cloneDeep(annotations);
    // console.log("8");
    setDetails((pD) => {
      const new_ans = _.filter(cl_annotations, (e) => e.id !== key);
      const dtls = { ...pD, annotations: new_ans, newAnnotation: null, mouseDown: false };
      setHis((pH) => pH.splice(0, hs).concat([dtls]));
      console.log("change hs");
      setHs((pHs) => pHs + 1);
      return dtls;
    });
  };

  const updateAnnotation = (newAttrs, i, type?: any) => {
    const { annotations } = details;
    const cl_annotations = _.cloneDeep(annotations);
    cl_annotations[i] = getCoords({ ...cl_annotations[i], ...newAttrs });
    // console.log("9");
    setDetails((pD) => {
      const new_ans = cl_annotations;
      const dtls = { ...pD, annotations: new_ans, newAnnotation: null, mouseDown: false };
      if (type !== "no-hs") {
        setHis((pH) => pH.splice(0, hs).concat([dtls]));
        console.log("change hs");
        setHs((pHs) => pHs + 1);
      }
      return dtls;
    });
  };

  const clearLabelModel = () => {
    setDetails((pD) => {
      // console.log(modal, "DRRR");
      const annotations = modal.data.dtls.annotations;
      annotations.pop();
      setModal({ show: false, data: null, load: false });
      return { ...modal.data.dtls, annotations };
    });
  };
  const createLabel = async () => {
    if (modal.load) return;
    // console.log(modal);
    if (!modal.label?.name.trim()) toast.error("Enter Label name");
    if (!modal.label?.name.trim()) return;
    setModal({ ...modal, load: true });
    let tempLabelId = modal.label.id;
    try {
      if (modal.label?.new) {
        const jsonse = {
          categories: [{ name: modal.label.name, color: getColor() }],
        };
        const formdata = new FormData();
        formdata.append("annotation_file", getBlob(jsonse), "Annotate.json");
        const res = await annotationService.createAnnotations(
          router.query.uuid,
          "category",
          getModelType(router.pathname),
          formdata
        );
        tempLabelId = res.msg.id;
        mutate();
      }
      setDetails((pD) => {
        const annotations = modal.data.dtls.annotations;
        annotations[annotations.length - 1].category_id = tempLabelId;
        if (getModelType(router.pathname) === "ocr")
          annotations[annotations.length - 1].value = modal?.field || "";
        const dtls = { ...modal.data.dtls, annotations };
        setHis((pH) => pH.splice(0, hs).concat([dtls]));
        setHs((pHs) => pHs + 1);
        setModal({ show: false, data: null, load: false });
        return { ...dtls };
      });
    } catch (e) {
      toast.error(e);
      setModal({ ...modal, load: false });
    }
  };
  const changeImage = (path: any, typ?: any) => {
    if (his.length > 1) {
      const { annotations } = details;
      const save_ans = polygonTool ? _.filter(annotations, (e) => e.isFinished) : annotations;
      const jsonse = { annotations: _.filter(save_ans, (e) => e?.image_id), image_id: details.id };
      const formdata = new FormData();
      formdata.append("annotation_file", getBlob(jsonse), "Annotate.json");
      setSave("Saving");
      annotationService
        .createAnnotations(router.query.uuid, "annotation", getModelType(router.pathname), formdata)
        .then((res) => {
          setSave("");
          mutate();
          setHis([]);
          setHs(0);
          setShowModal("");
          if (typ === "finish") setFinish(!finish);
          // console.log(hs, his, "HISS");
          router.replace(path);
        })
        .catch((e) => {
          setSave("");
          toast.error(e);
        });
    } else if (path) router.replace(path);
  };
  // const inviteAnnotator = () => {};
  const onMouseOver = (i) => {
    setInside(i);
    clearTimeout(tempRef.current);
    tempRef.current = null;
  };
  const onMouseOut = () => {
    tempRef.current = setTimeout(() => {
      setInside(-1);
    }, 500);
  };

  useEffect(() => {
    document.onkeydown = function (evt: any) {
      evt = evt || window.event;
      if (evt.key === "Escape" && polygonTool) {
        setDetails((pD) => {
          const { annotations: anns } = pD;
          if (anns.length > 0 && !anns[anns.length - 1]["isFinished"]) {
            anns.pop();
            setHis((pH) => {
              pH.pop();
              return pH;
            });
            setHs((pHs) => pHs - 1);
            return { ...pD, annotations: anns };
          } else return { ...pD };
        });
      }
    };
  }, []);

  return (
    <div className="mainc container-fluid" id="top">
      <div className="border border-light rounded bg-white mb-5 p-4">
        <AnnotationNav {...{ user, router, changeImage, details }} />
        <hr id="divider" style={{ marginTop: "6px", marginBottom: "6px" }} />
        <div className="flex-between mt-3">
          <p className="font-weight-600 txt-lgray">
            <span
              className="text-primary cr-p"
              onClick={() =>
                router.replace(
                  router.pathname.replace("[uuid]", router.query.uuid) + `?annotate#top`
                )
              }
            >
              &#8592;
            </span>{" "}
            Annotation tool
          </p>

          <p className="font-14 txt-lgray">
            <span className="mx-2">{`Annotated: ${details.annotated_count || 0} of ${
              details.annotated_count + details.unannotated_count || 0
            } Images`}</span>
            {user?.current_workspace_details?.role === "owner" && (
              <span className="font-12 mx-4 cr-p" onClick={() => setAnnotationInvitation(true)}>
                <Image src="/plus-circle.svg" className="mx-2 cr-p" />
                Invite Annotator
              </span>
            )}

            <OverlayTrigger
              rootClose
              trigger="click"
              placement="bottom"
              overlay={popover}
              transition
            >
              <span className="font-12 cr-p">
                <img src="/alert-circle.svg" alt="alert" className="mx-2 cr-p" />
                Need Help?
              </span>
            </OverlayTrigger>
          </p>
        </div>
        <div className="d-flex">
          <div style={{ width: "100px", minWidth: "100px" }}>
            {details?.id ? (
              <Images {...{ user, details, changeImage, router }} />
            ) : (
              <ShimmerImages />
            )}
          </div>
          <div className="w-100 overflow-auto mx-2 relative">
            {modal.show && (
              <div className="label-model">
                <h6 className="text-primary fw-bold modal-title font-14">Label Editor</h6>
                <h6 className="my-1 font-12">Label</h6>
                <CreatableSelect
                  isClearable
                  onChange={(e: any) =>
                    setModal({
                      ...modal,
                      label:
                        e && e.label.trim() !== ""
                          ? { name: e.label, id: e.value, new: e?.__isNew__ }
                          : null,
                    })
                  }
                  options={
                    Array.isArray(labels)
                      ? labels.map((e) => {
                          return { label: e.name, value: e.id };
                        })
                      : []
                  }
                  value={!modal.label ? null : { label: modal.label.name, value: modal.label.id }}
                  noOptionsMessage={() => null}
                  placeholder={`Enter label`}
                  styles={createSelectStyles}
                />
                {getModelType(router.pathname) === "ocr" && (
                  <>
                    <h6 className="my-1 font-12 relative">
                      Field {paddleOcr && <Spinner animation="border" className="me-2 sp-wh-1" />}
                    </h6>
                    <input
                      className="form-control"
                      type="text"
                      value={modal?.field || ""}
                      placeholder="Enter Field text"
                      onChange={(e) => setModal({ ...modal, field: e.target.value })}
                      style={{ fontSize: "12px" }}
                    />
                  </>
                )}
                <div className="d-flex mt-4">
                  <button className="btn btn-sm ms-auto border-0 font-12" onClick={clearLabelModel}>
                    Cancel
                  </button>
                  <button className="btn btn-primary btn-sm ms-3 font-12" onClick={createLabel}>
                    {modal.load && <Spinner animation="border" className="me-2 sp-wh" />}
                    {` Done`}
                  </button>
                </div>
              </div>
            )}
            {save && (
              <button
                className="btn border-primary text-primary saving-button cr-d"
                style={{ zIndex: "999999", background: "#ebebeb" }}
              >
                <Spinner animation="border" className="me-2 sp-wh" />
                Saving
              </button>
            )}
            <div className="w-100 overflow-auto stage-container ann-hght d-flex">
              <div className="m-auto">
                {polygonTool ? (
                  <PolygonKonva
                    {...{ handleMouseOutStartPoint, handleMouseOverStartPoint }}
                    {...{ details, curMousePos, dms, setDms, labels }}
                    {...{ inside, onMouseOver, onMouseOut }}
                    {...{ handleMouseDown, handleMouseMove, handleMouseEnter }}
                    setDetails={(data: any) => {
                      // console.log("10");
                      setDetails((pD) => {
                        return { ...pD, ...data };
                      });
                    }}
                    stageRef={(ref) => !stageRef && setStageRef(ref)}
                  />
                ) : (
                  <RectangleKonva
                    {...{ details, curMousePos, dms, setDms, labels }}
                    {...{ deleteAnnotation, updateAnnotation }}
                    {...{ handleMouseDown, handleMouseMove, handleMouseUp }}
                    setDetails={(data: any) => {
                      // console.log("10");
                      setDetails((pD) => {
                        return { ...pD, ...data };
                      });
                    }}
                    stageRef={(ref) => !stageRef && setStageRef(ref)}
                  />
                )}
              </div>
            </div>
          </div>

          {!render ? (
            <ToolBar
              router={router}
              polygonTool={polygonTool}
              zoomStage={zoomStage}
              defaultZoom={defaultZoom}
              stageRef={stageRef}
              disU={() => hs === 1}
              disR={() => hs === his.length}
              undo={(e) => {
                e.preventDefault();
                console.log("change hs");
                setHs((pHs) => pHs - 1);
                // console.log(hs, his[hs - 2], "11");
                setDetails((pD) => {
                  return { ...pD, annotations: his[hs - 2].annotations };
                });
              }}
              redo={(e) => {
                e.preventDefault();
                console.log("change hs");
                setHs((pHs) => pHs + 1);
                // console.log("12");
                setDetails(his[hs]);
              }}
              previous={() =>
                changeImage(
                  router.pathname.replace("[uuid]", router.query.uuid) +
                    `?annotate=${details?.prev_id}#top`
                )
              }
              next={() =>
                changeImage(
                  router.pathname.replace("[uuid]", router.query.uuid) +
                    `?annotate=${details?.next_id}#top`
                )
              }
            />
          ) : (
            <ShimmerToolBar polygonTool={polygonTool} />
          )}

          <div className="block-background p-1 w-25 labels-container ann-hght">
            <Labels
              {...{ modal, details, updateAnnotation, labels, label, setLabel, mutate, router }}
              ls={hs === his.length}
            />
          </div>
        </div>
        <div className="d-flex">
          <div style={{ width: "100px", minWidth: "100px" }}></div>
          <div className="w-100 overflow-auto m-2 text-center">
            <button
              className="btn btn-sm border-0 me-5"
              onClick={() =>
                changeImage(router.pathname.replace("[uuid]", router.query.uuid) + `?annotate#top`)
              }
            >
              Back
            </button>

            {(details?.unannotated_count === 0 && details?.annotations.length > 0) ||
            (details?.unannotated_count === 1 &&
              !details?.annotated &&
              details?.annotations.length > 0 &&
              !modal.show) ? (
              <button
                className="btn btn-primary font-14 py-3 px-5"
                onClick={() =>
                  changeImage(
                    isRole(user, "annotator")
                      ? "/my-models"
                      : router.pathname.replace("[uuid]", router.query.uuid) + `?train#top`,
                    "finish"
                  )
                }
              >
                {isRole(user, "annotator") ? "Finish" : "Continue"}
              </button>
            ) : (
              <OverlayTrigger
                overlay={
                  <Tooltip id="tooltip-engine">
                    Annotate all images to {isRole(user, "annotator") ? "finish" : "continue"}
                  </Tooltip>
                }
              >
                <p className="btn btn-primary font-14 py-3 px-5 m-0" style={{ opacity: "0.65" }}>
                  {isRole(user, "annotator") ? "Finish" : "Continue"}
                </p>
              </OverlayTrigger>
            )}
          </div>
          <div className="p-1 w-25" style={{ minWidth: "200px" }}></div>
        </div>
      </div>
      <LeavePageModal {...{ showModal, onClick, onClose, save }} />
      {annotationInvitation && (
        <InviteAnnotator {...{ models, annotationInvitation, setAnnotationInvitation }} />
      )}
    </div>
  );
};

export default Annotate;
