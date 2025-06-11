// **************** Internal ************************

// React internal imports
import React, { FC } from "react";
//Components
import Annotation from "components/withAnnotation";

const SemanticSegmentation: FC = ({ user, router, Router }: any) => {
  return <Annotation {...{ user, router, Router }} />;
};

export default SemanticSegmentation;
