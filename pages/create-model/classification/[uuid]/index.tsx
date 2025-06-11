import WithoutAnnotation from "@components/withoutAnnotation";

const Classification = ({ user, router, Router }: any) => {
  return <WithoutAnnotation {...{ user, router, Router }} />;
};

export default Classification;
