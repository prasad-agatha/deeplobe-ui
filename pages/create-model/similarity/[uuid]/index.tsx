import WithoutAnnotation from "@components/withoutAnnotation";

const Similarity = ({ user, router, Router }: any) => {
  return <WithoutAnnotation {...{ user, router, Router }} />;
};

export default Similarity;
