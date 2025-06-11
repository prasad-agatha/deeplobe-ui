import MainLayout from "layouts/MainLayout";
import Upload from "components/withoutAnnotation/Upload";
import Train from "components/withoutAnnotation/Train";
import Evaluate from "components/withoutAnnotation/Evaluate";

const WithoutAnnotation = ({ user, router, Router }: any) => {
  return (
    <MainLayout>
      <>
        {router?.query?.uuid ? (
          router?.query?.evaluate !== undefined ? (
            <Evaluate {...{ user, router }} />
          ) : router?.query?.train !== undefined ? (
            <Train {...{ user, router }} />
          ) : (
            <Upload {...{ router, Router }} />
          )
        ) : (
          <></>
        )}
      </>
    </MainLayout>
  );
};

export default WithoutAnnotation;
