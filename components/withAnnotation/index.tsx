import MainLayout from "layouts/MainLayout";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Shimmer, Upload, Images, Annotate, Train, Evaluate } from "@components/annotation";
import { getModelType, isRole, userAccess } from "common_functions/functions";

import AnnotationService from "services/annotation.service";
import ModelTrainService from "services/model.train.service";

const trainService = new ModelTrainService();
const annotationService = new AnnotationService();

const Annotation = ({ user, router, Router }: any) => {
  const [details, setDetails] = useState<any>({
    load: true,
    model_name: "",
    annotated_count: 0,
    unannotated_count: 0,
    image_id: "",
  });
  const { uuid, annotate, train, evaluate } = router.query;

  useEffect(() => {
    if (uuid && isRole(user, "annotator") && !details.load && !details.image_id) {
      toast.error("No images to annotate");
      router.replace("/my-models");
    }
    if (
      uuid &&
      ((isRole(user, "annotator") &&
        (evaluate !== undefined || train !== undefined || annotate === undefined) &&
        details.image_id) ||
        (user && !userAccess(user, "test_model") && evaluate !== undefined))
    )
      router.replace(router.pathname.replace("[uuid]", router.query.uuid) + `?annotate#top`);
  }, [details, user, router.query]);

  useEffect(() => {
    const getDetails = async () => {
      const ty = `details?model_type=${getModelType(router.pathname)}`;
      annotationService
        .getModelAnnotations(uuid, ty)
        .then((res) => {
          setDetails({ ...details, load: false, ...res });
          if (
            !res.image_id &&
            evaluate === undefined &&
            (train !== undefined || annotate !== undefined)
          )
            router.replace(router.pathname.replace("[uuid]", router.query.uuid));
        })
        .catch((e) => {
          toast.error(e);
          router.replace("/my-models");
        });
    };
    if (uuid) getDetails();
  }, [router.query]);

  return (
    <MainLayout>
      <>
        {uuid ? (
          evaluate !== undefined ? (
            <Evaluate {...{ user, router }} />
          ) : train !== undefined ? (
            <Train {...{ user, details, setDetails, router }} />
          ) : annotate !== undefined ? (
            !Math.floor(annotate) || Number(annotate) < 1 ? (
              <Images {...{ user, details, router }} />
            ) : (
              <Annotate {...{ user, router, Router }} />
            )
          ) : (
            <Upload {...{ user, details, router, Router }} />
          )
        ) : (
          <Shimmer {...{ user, router }} />
        )}
      </>
    </MainLayout>
  );
};

export default Annotation;
