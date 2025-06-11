import React, { useEffect, useState } from "react";
import { Form, Image, Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import { getBlob, getModelType } from "common_functions/functions";

import AnnotationService from "services/annotation.service";
import _ from "lodash";

const annotationService = new AnnotationService();

const getColor = () => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
};
const Labels = ({
  modal,
  details,
  updateAnnotation,
  labels,
  label,
  setLabel,
  mutate,
  router,
  ls,
}: any) => {
  const [addLabel, setAddLabel] = useState(false);
  const [text, setText] = useState("");
  const [show, setShow] = useState<any>(null);
  const [load, setLoad] = useState(false);
  const [categories, setCategories] = useState<any>([]);
  const [deleteprompt, setDeleteprompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState();
  useEffect(() => {
    if (Array.isArray(labels)) setCategories(labels);
  }, [labels]);

  const closeModel = async (mutte: any = false) => {
    setAddLabel(false);
    setText("");
    if (mutte) mutate();
  };

  const addNewLabel = async () => {
    if (!load && text.trim()) {
      setLoad(true);
      const jsonse = { categories: [{ name: text, color: getColor() }] };
      const formdata = new FormData();
      formdata.append("annotation_file", getBlob(jsonse), "Annotate.json");
      annotationService
        .createAnnotations(router.query.uuid, "category", getModelType(router.pathname), formdata)
        .then(() => closeModel(true))
        .catch((e) => toast.error(e))
        .finally(() => setLoad(false));
    }
  };

  const updateLabel = async () => {
    setShow(null);
    let lb = "";
    const updCat = categories.map((e) => {
      if (e.id === show.id) {
        lb = e.name;
        return show;
      }
      return e;
    });
    if (show.name.trim() && lb !== show.name) {
      setCategories(updCat);
      const formdata = new FormData();
      formdata.append("annotation_file", getBlob({ categories: [show] }), "Annotate.json");
      annotationService
        .updateAnnotations(router.query.uuid, "category", getModelType(router.pathname), formdata)
        .catch((e) => toast.error(`Error updating label: ${lb}`))
        .finally(() => mutate());
    }
  };
  console.log(details, "CCCAAATTTT");
  return (
    <div className="d-flex h-100" style={{ overflow: "auto" }}>
      <div className="rounded w-100 m-1 labels-section">
        <div className="pt-1 px-2 h-100">
          <div className="d-flex flex-wrap align-items-center mb-2 ">
            <p className="mb-0">Labels</p>
            {labels && (
              <button
                className="btn btn-sm btn-outline-primary font-12 ms-auto"
                onClick={() => setAddLabel(true)}
              >
                + Add label
              </button>
            )}
          </div>

          <div
            className="bg-white"
            style={{
              height: getModelType(router.pathname) !== "ocr" ? "calc(100% - 45px)" : "25vh",
              overflowY: "auto",
            }}
          >
            {categories.map((item: any, index: any) => {
              return (
                <div
                  onClick={() => setLabel(item)}
                  key={index}
                  className={
                    "rounded m-1 mb-1 p-1 d-flex justify-content-between labels-section align-items-center" +
                    (item.id === label?.id ? " selected" : " not-selected")
                  }
                  style={{ borderLeft: `5px solid ${item.color}` }}
                >
                  {show?.id === item.id ? (
                    <input
                      className="form-control font-12 py-0"
                      type="text"
                      value={show.name}
                      onChange={(e) => setShow({ ...show, name: e.target.value })}
                      onBlur={updateLabel}
                      onKeyDown={(e) => e.code === "Enter" && updateLabel()}
                      autoFocus
                    />
                  ) : (
                    <>
                      <p className="mb-0 p-1 w-100 font-14 text-truncate">{item.name}</p>
                      <p className="font-14 m-0">({item.count})</p>
                      {/* <Image
                        className="mx-2"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShow(item);
                        }}
                        src="/images/edit-icon.svg"
                      /> */}
                      <Image
                        className="mx-2 cr-p"
                        onClick={async (e) => {
                          setDeleteprompt(true);
                          setDeleteItemId(item.id);
                          //   e.preventDefault();
                          //   e.stopPropagation();
                          //   const formdata = new FormData();
                          //   formdata.append(
                          //     "annotation_file",
                          //     getBlob({ categories: [show] }),
                          //     "Annotate.json"
                          //   );
                          //   annotationService
                          //     .deleteModelAnnotations(
                          //       router.query.uuid,
                          //       `category?model_type=${getModelType(router.pathname)}&id=${item.id}`
                          //     )

                          //     .catch((e) => toast.error(`Error deleting label`))
                          //     .finally(() => mutate());
                          //
                        }}
                        width="14"
                        height="14"
                        src="/images/trash-icon.svg"
                      />
                    </>
                  )}
                </div>
              );
            })}

            {categories.length === 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "25vh",
                }}
              >
                <p
                  className="text-center font-14 px-2"
                  style={{ textAlign: "center", color: "#D4D4D4" }}
                >
                  Your labels will be displayed here
                </p>
              </div>
            )}
          </div>

          {getModelType(router.pathname) === "ocr" && (
            <>
              <div className="px-2 py-2 border-top mt-3">Fields</div>
              <div
                style={{
                  borderRadius: 12,
                  backgroundColor: "#FFFFFF",
                  maxHeight: "30vh",
                  overflowY: "auto",
                }}
              >
                {details.annotations
                  .filter((item) => {
                    const annotations = modal?.data?.dtls?.annotations || [{ id: 0 }];
                    return item.id !== annotations[annotations.length - 1]?.id;
                  })
                  .filter((item) => _.find(categories, (e) => e.id === item.category_id)?.name)
                  .map((item, id) => (
                    <div className="d-flex align-items-center p-1 px-2" key={id}>
                      <div
                        className="me-2"
                        style={{
                          // backgroundColor: item.stroke,
                          height: "18px",
                          width: "3px",
                          borderRadius: "2px",
                        }}
                      />
                      <div
                        className="mt-0 text-truncate"
                        style={{ width: "50%", fontSize: "14px" }}
                      >
                        {_.find(categories, (e) => e.id === item.category_id)?.name}
                      </div>
                      <div className="mt-0">
                        <input
                          className="form-control"
                          type="text"
                          value={item.value ? item.value : ""}
                          // autoFocus={ls}
                          onChange={(e) => updateAnnotation({ value: e.target.value }, id, "no-hs")}
                          onBlur={(e) => updateAnnotation({ value: e.target.value }, id)}
                          style={{ fontSize: "12px" }}
                        />
                      </div>
                    </div>
                  ))}
                {details.annotations
                  .filter((item) => {
                    const annotations = modal?.data?.dtls?.annotations || [{ id: 0 }];
                    return item.id !== annotations[annotations.length - 1]?.id;
                  })
                  .filter((item) => _.find(categories, (e) => e.id === item.category_id)?.name)
                  .length === 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "25vh",
                    }}
                  >
                    <p
                      className="text-center font-14 px-2"
                      style={{ textAlign: "center", color: "#D4D4D4" }}
                    >
                      Your fields will be displayed here
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Modal
        size="sm"
        show={addLabel}
        onHide={closeModel}
        keyboard={false}
        animation={false}
        centered
      >
        <Modal.Header className="" style={{ backgroundColor: "white" }}>
          <Modal.Title className="text-primary fw-bold font-20">Add new label</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0 mx-2">
          <Form.Control autoFocus value={text} onChange={(e) => setText(e.target.value)} />
          <div className="d-flex mt-4">
            <button className="btn btn-sm ms-auto border-0" onClick={closeModel}>
              Cancel
            </button>
            <button className="btn btn-primary btn-sm ms-3" onClick={addNewLabel}>
              {load && <Spinner animation="border" className="me-2 sp-wh" />}
              {` Done`}
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        onHide={() => setDeleteprompt(false)}
        keyboard={false}
        show={deleteprompt}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header style={{ backgroundColor: "white" }}>
          <Modal.Title className="text-primary fw-bold font-20">Confirm action</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0 mx-2">
          <p className="font-14 mb-3" style={{ lineHeight: "21px" }}>
            Are you sure? Do you want to delete the label?
          </p>
          <div className="d-flex mt-4">
            <button
              className="btn btn-primary btn-sm"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const formdata = new FormData();
                formdata.append(
                  "annotation_file",
                  getBlob({ categories: [show] }),
                  "Annotate.json"
                );
                setLoading(true);
                annotationService
                  .deleteModelAnnotations(
                    router.query.uuid,
                    `category?model_type=${getModelType(router.pathname)}&id=${deleteItemId}`
                  )

                  .catch((e) => toast.error(`Error deleting label`))
                  .finally(() => {
                    setLoading(false);
                    setDeleteprompt(false);
                    mutate();
                  });
              }}
            >
              {load && <Spinner animation="border" className="me-2 sp-wh" />}
              {` Yes`}
            </button>
            <button className="btn btn-sm ms-3 border-0" onClick={() => setDeleteprompt(false)}>
              No
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default Labels;
