// **************** Internal ************************

// React internal imports
import React, { FC } from "react";
//Components
import Annotation from "components/withAnnotation";

const InstanceSegmentation: FC = ({ user, router, Router }: any) => {
  return <Annotation {...{ user, router, Router }} />;
};

export default InstanceSegmentation;
