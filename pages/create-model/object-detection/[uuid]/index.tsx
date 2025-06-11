import Annotation from "components/withAnnotation";

const ObjectDetection = ({ user, router, Router }: any) => {
  return <Annotation {...{ user, router, Router }} />;
};

export default ObjectDetection;
