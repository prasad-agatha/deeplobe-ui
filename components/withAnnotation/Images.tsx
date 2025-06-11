import React, { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import _ from "lodash";
import Paginate from "./paginator";

import AnnotationService from "services/annotation.service";
import { getModelType, isRole } from "common_functions/functions";
import { ShimmerImages } from "@components/annotation";
import { toast } from "react-toastify";
import DeleteImage from "@components/modals/DeleteImage";

const annotationService = new AnnotationService();

const Images = ({ user, details, changeImage, router }) => {
  const [show, setShow] = useState("");
  const [page, setPage] = useState(Math.floor(details.index / 10) + 1);
  const [state, setState] = useState({ pages: 1, images: [], load: true });
  const [load, setLoad] = useState(false);
  const [render, setRender] = useState(false);
  // console.log(details);

  useEffect(() => {
    const getDetails = async () => {
      const ty = `images?model_type=${getModelType(
        router.pathname
      )}&all=true&page=${page}&per_page=10`;
      annotationService
        .getModelAnnotations(router.query.uuid, ty)
        .then((res) => setState({ ...res, load: false }));
    };
    getDetails();
  }, [page, render]);

  useEffect(() => {
    if (details?.id) {
      const element = document.getElementById(details.id);
      if (element)
        element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      else if (state.images.length > 0) {
        const i = document.getElementById(state.images[0].id);
        if (i) i.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
    }
  }, [state.images, details?.id]);

  useEffect(() => {
    if (details?.id && Math.floor(details.index / 10) + 1 !== page)
      setPage(Math.floor(details.index / 10) + 1);
    setRender(!render);
  }, [details?.id]);

  const deleteImage = () => {
    if (!load) {
      setLoad(true);
      annotationService
        .deleteModelAnnotations(
          router.query.uuid,
          `image?model_type=${getModelType(router.pathname)}&id=${show}`
        )
        .then(() => {
          if (details?.id === show)
            changeImage(
              router.pathname.replace("[uuid]", router.query.uuid) +
                `?annotate=${details?.next_id}#top`
            );
          else setRender(!render);
        })
        .catch(() => {
          toast.error("Error deleting image");
          setRender(!render);
        })
        .finally(() => {
          setLoad(false);
          setShow("");
        });
    }
  };

  const annotatedImage = (item: any) => {
    return item.annotated;
    // if (details?.id === item.id) return details.annotations.length > 0;
    // else return item.annotated;
  };

  if (state.load) return <ShimmerImages />;

  return (
    <div style={{ width: "100px", minWidth: "100px" }}>
      <div className="overflow-auto w-100 pb-3 ann-hght">
        {state.images.map((item: any, index: any) => (
          <div key={index} className="pt-3 d-flex justify-content-center" id={item.id}>
            <div
              className={`${
                details?.id === item.id ? "selected" : "not-selected"
              } text-center cr-p`}
              onClick={() =>
                changeImage(
                  router.pathname.replace("[uuid]", router.query.uuid) + `?annotate=${item.id}#top`
                )
              }
              key={index}
              style={{ width: "80px" }}
            >
              <img
                className="image-fluid"
                src={item.url}
                alt="Image"
                style={{ height: "60px", width: "75px" }}
              />
              {annotatedImage(item) && (
                <div className="overlay d-flex justify-content-center align-items-center">
                  <i
                    className="fa fa-check-circle"
                    style={{ marginTop: "-60px", color: "#6152D9" }}
                  ></i>
                </div>
              )}
              {user && state.images.length > 1 && !isRole(user, "annotator") && (
                <div className="overlay d-flex justify-content-center align-items-center">
                  <img
                    src="/images/delete-cross-icon.svg"
                    alt="delete-icon"
                    className="cursor-pointer"
                    style={{ marginTop: "-126px", marginLeft: "75px", color: "#DC3545" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShow(item.id);
                    }}
                  />
                </div>
              )}

              <div className="rounded-bottom border" style={{ backgroundColor: "#E0E0E0" }}>
                <p className="font-10 text-truncate text-center pt-1 mb-1">{item.file_name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Paginate {...{ state, page, setPage }} />
      <DeleteImage {...{ load, show, setShow, deleteImage }} />
    </div>
  );
};
export default Images;
