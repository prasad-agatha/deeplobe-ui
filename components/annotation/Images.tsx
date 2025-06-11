import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import { OverlayTrigger, Spinner, Tab, Tabs, Tooltip } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

import AnnotationNav from "@components/navigation/AnnotationNav";
import DeleteImage from "@components/modals/DeleteImage";
import { Shimmer } from "components/annotation";
import { getLabelName, getModelType, isRole } from "common_functions/functions";

import AnnotationService from "services/annotation.service";

const annotationService = new AnnotationService();

const Images = ({ user, details, router }) => {
  const [render, setRender] = useState<any>(false);
  const [load, setLoad] = useState(false);
  const [delImg, setDelImg] = useState("");
  const [state, setState] = useState<any>({
    load: true,
    type: "unannotated",
    page: 1,
    pages: 1,
    images: [],
  });

  useEffect(() => {
    const getDetails = async () => {
      const ty = `images?model_type=${getModelType(router.pathname)}&${state.type}=true&page=${
        state.page
      }&per_page=50`;
      annotationService
        .getModelAnnotations(router.query.uuid, ty)
        .then((res) => {
          setState({
            ...state,
            load: false,
            ...res,
            images: [...state.images, ...res.images],
          });
        })
        .catch((e) => toast.error(e));
    };
    getDetails();
  }, [render]);

  const deleteImage = () => {
    if (!load) {
      setLoad(true);
      annotationService
        .deleteModelAnnotations(
          router.query.uuid,
          `image?model_type=${getModelType(router.pathname)}&id=${delImg}`
        )
        .then(() => {
          setState((pD) => {
            return {
              ...pD,
              images: _.filter(pD.images, (e) => e.id !== delImg),
            };
          });
          router.replace(router.pathname.replace("[uuid]", router.query.uuid) + `?annotate#top`);
        })
        .catch(() => {
          toast.error("Error deleting image");
        })
        .finally(() => {
          setLoad(false);
          setDelImg("");
        });
    }
  };

  const changeImage = (path: any) => router.replace(path);

  return (
    <div className="mainc container-fluid flex-grow-1" id="top">
      <div className="border border-light rounded bg-white mb-5 p-4" style={{ minHeight: "100%" }}>
        <AnnotationNav {...{ user, router, changeImage, details }} />
        <hr id="divider" style={{ marginTop: "6px", marginBottom: "6px" }} />

        <Tabs
          id="controlled-tab-example"
          activeKey={state.type}
          onSelect={(k) => {
            setState({ ...state, load: true, type: k, page: 1, images: [] });
            setRender(!render);
          }}
          className="border-0 color font-18"
        >
          {["unannotated", "annotated"].map((e: any, id: any) => (
            <Tab eventKey={e} title={`${getLabelName(e)} (${details[`${e}_count`]})`} key={id}>
              {state.images.length > 0 ? (
                <InfiniteScroll
                  dataLength={state.images.length}
                  next={() => {
                    setRender(!render);
                    setState({ ...state, page: state.page + 1 });
                  }}
                  hasMore={state.page < state.pages}
                  loader={<p className="text-center">Loading...</p>}
                  height={`min("max-content",375)`}
                  className="w-100 text-center block-background py-3"
                >
                  {state.images.map((e: any, id: any) => (
                    <div
                      onClick={() =>
                        router.replace(
                          router.pathname.replace("[uuid]", router.query.uuid) +
                            `?annotate=${e.id}#top`
                        )
                      }
                      className="relative cr-p"
                      key={id}
                    >
                      <img src={e.url} alt="img" className="ann-img cr-p" />

                      {user && !isRole(user, "annotator") && (
                        <img
                          src="/images/delete-cross-icon.svg"
                          alt="delete-icon"
                          className="cr-p"
                          width={20}
                          style={{ position: "absolute", marginLeft: "-20px" }}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setDelImg(e.id);
                          }}
                        />
                      )}
                      <p className="font-10 text-truncate text-center mb-0 p-1">{e.file_name}</p>
                    </div>
                  ))}
                </InfiniteScroll>
              ) : (
                <div className="no-img py-3 block-background">
                  {state.load ? (
                    <>
                      <Spinner animation="border" className="me-2 sp-wh" />
                      Loading
                    </>
                  ) : (
                    `No ${getLabelName(e)} Images`
                  )}
                </div>
              )}
            </Tab>
          ))}
        </Tabs>

        <div className="d-flex justify-content-center p-0 mt-4">
          <button
            className={isRole(user, "annotator") ? "d-none" : "btn btn-sm border-0 me-5"}
            onClick={() =>
              router.replace(router.pathname.replace("[uuid]", router.query.uuid) + "#top")
            }
          >
            Back
          </button>
          {details.image_id ? (
            <button
              type="button"
              className="btn btn-primary font-14 py-3 px-5"
              onClick={() =>
                router.replace(
                  router.pathname.replace("[uuid]", router.query.uuid) +
                    `?annotate=${details.image_id}#top`
                )
              }
            >
              Continue
            </button>
          ) : (
            <OverlayTrigger
              overlay={<Tooltip id="tooltip-engine">Annotate images to contine</Tooltip>}
            >
              <div style={{ opacity: "0.65" }} className="btn btn-primary font-14 py-3 px-5 cr-d">
                Continue
              </div>
            </OverlayTrigger>
          )}
        </div>
      </div>

      <DeleteImage {...{ load, deleteImage }} show={delImg} setShow={setDelImg} />
    </div>
  );
};

export default Images;
