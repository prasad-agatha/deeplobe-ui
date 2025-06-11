import WithoutAnnotation from "@components/withoutAnnotation";
import MainLayout from "layouts/MainLayout";
import Upload from "components/withoutAnnotation/llm/llmUpload";
import LLMTrain from "components/withoutAnnotation/llm/llmtrain";
import LLMEvaluate from "components/withoutAnnotation/llm/llmEvaluate";

const LLM = ({ user, details, router, Router }: any) => {
  return (
    <MainLayout>
      <>
        {router?.query?.uuid ? (
          router?.query?.evaluate !== undefined ? (
            <LLMEvaluate {...{ user, router }} />
          ) : router?.query?.train !== undefined ? (
            <LLMTrain {...{ user, router }} />
          ) : (
            <Upload {...{ user, details, router, Router }} />
          )
        ) : (
          <></>
        )}
      </>
    </MainLayout>
  );
};

export default LLM;
