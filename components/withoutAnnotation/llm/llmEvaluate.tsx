import AiNavBar from "components/AiAssistant/NavBar";
import Router from "next/router";
import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Document, Page, pdfjs } from "react-pdf";
import AiAssitantService from "services/aiAssistant";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import Typewriter from "typewriter-effect/dist/core";
import ModelTrainService from "services/model.train.service";
import { toast } from "react-toastify";
import CustomModalNav from "@components/navigation/CustomModalNav";

const trainService = new ModelTrainService();

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function LLMEvaluate({ user: profileData, router }) {
  const [stepper, setStepper] = useState("step-1");
  const [data, setData] = useState([]);
  const [question, setQuestion] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const [loadingState, setLoadingState] = useState("start");
  const [previewModel, setPreviewModel] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [numPages, setNumPages] = useState(null);
  const { uuid } = router.query;
  const [details, setDetails] = useState<any>({
    loading: true,
    model_name: "",
    categories: [],
    status: "Draft",
  });

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const previewPdf = (file) => {
    setFileUrl(file);
    setPreviewModel(true);
  };
  useEffect(() => {
    const getDetails = (uuid) =>
      trainService
        .getModelDetails(uuid)
        .then((res) => {
          setDetails({
            loading: false,
            model_name: res.name,
            id: res.id,
            categories: [],
            status: res.status,
          });
        })
        .catch((e) => {
          toast.error(e);
          router.replace("/my-models");
        });
    if (uuid && uuid !== "") {
      getDetails(uuid);
    }
  }, [uuid]);

  const regenerateResp = () => {
    const actualData = data;
    const tempData = {
      id: data.length,
      question: lastQuestion,
    };

    actualData[actualData.length - 1] = tempData;

    setData(actualData);
    Router.push(`#${tempData.id}`);
    setLoadingState("generating response");
    var app = document.getElementById(`responseText${tempData.id}`);
    var typewriter = new Typewriter(app, {
      loop: false,
      delay: 50,
    });
    typewriter.typeString("").pauseFor(300).pauseFor(1000).start();
    trainService
      .predictModel(details?.id, { input_url: lastQuestion })
      .then((response) => {
        const actualData = data;
        const removedContent = ["N/A", "None", "None.", ""];

        const filteredFiles = response.result.result.sources.filter(
          (filee) => !removedContent.some((item) => item === filee)
        );
        const tempData1 = {
          id: data.length + 1,
          question: lastQuestion,
          responseText: response.result.result.answer,
          tags: convertToTags(filteredFiles),
          files: filteredFiles,
        };
        actualData[data.length - 1] = tempData1;

        typewriter
          .pauseFor(500)
          .typeString(response.result.result.answer)
          .pauseFor(300)
          .pauseFor(1000)
          .start();

        setData(actualData);
        setLoadingState("re-generate response");
      })
      .catch((error) => {
        setLoadingState("re-generate response");
        typewriter
          .typeString("We are sorry, the server is down at this moment!")
          .pauseFor(300)
          .pauseFor(1000)
          .start();
      })
      .finally(() => {});
  };

  const downloadFile = (url) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const parts = url.split("/");
        const FileName = parts[parts.length - 1];
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("target", "_blank");
        console.log(url, "kln urlllllllll");
        link.download = FileName ? FileName : "Source file";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  function findNumbersInString(inputString) {
    const regex = /\d+(\.\d+)?/g; // Regular expression to match numbers
    const numbers = inputString.match(regex);
    return numbers ? numbers : "";
    // return numbers ? numbers.map(Number) : [];
  }

  const convertToTags = (files) => {
    let allTags = [];

    if (Array.isArray(files)) {
      files?.map((file) => {
        const parts = file.split("/");
        allTags.push(parts[parts.length - 1]);
      });
    }

    const finalTags = [...new Set(allTags)];
    return finalTags;
  };
  const handleKeyDown = async (event, buttonClick) => {
    if (buttonClick === "button" || (event.key === "Enter" && !event.shiftKey)) {
      setStepper("step-2");
      setLastQuestion(question);
      setLoadingState("searching the imformation");
      const actualData = data;
      const tempData = {
        id: data.length + 1,
        question: question,
      };
      actualData.push(tempData);

      setData(actualData);
      Router.push(`#${tempData.id}`);
      setQuestion("");
      setTimeout(function () {
        setQuestion("");
        var app = document.getElementById(`responseText${tempData.id}`);

        var typewriter = new Typewriter(app, {
          loop: false,
          delay: 50,
        });
        typewriter.typeString("").pauseFor(300).pauseFor(1000).start();

        trainService
          .predictModel(details?.id, { input_url: question })
          .then((response) => {
            setLoadingState("generating response");
            const actualData = data;
            actualData.pop();
            typewriter.typeString(response.result.result.answer).pauseFor(300).start();

            const removedContent = ["N/A", "None", "None.", ""];

            const filteredFiles = response.result.result.sources.filter(
              (filee) => !removedContent.some((item) => item === filee)
            );

            const tempData = {
              id: data.length + 1,
              question: question,
              responseText: response.result.result.answer,
              tags: convertToTags(filteredFiles),
              files: filteredFiles,
            };
            actualData.push(tempData);

            setData(actualData);
          })
          .catch((error) => {
            setLoadingState("re-generate response");
            typewriter
              .pauseFor(500)
              .typeString("We are sorry, the server is down at this moment!")
              .pauseFor(300)
              .pauseFor(1000)
              .start();
          })
          .finally(() => {
            setLoadingState("re-generate response");
          });
      }, 1000);
    }
  };

  function isValidURL(url) {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    console.log(urlPattern.test(url), "urlPattern.test(url");
    return urlPattern.test(url);
  }
  const uploadImages = (path: any) => router.replace(path);
  return (
    <>
      <div className="ai-bg min-vh-100   overflow-auto" style={{ height: "100px" }}>
        <div className="py-3 my-5 mx-4 bg-white">
          <div className={`m-4  ${stepper === "step-2" ? "bg-white" : ""}`}>
            <CustomModalNav {...{ router, uploadImages, details }} />
            <hr id="divider" style={{ marginTop: "6px", marginBottom: "6px" }} />
            {stepper === "step-1" ? (
              <div className="py-5 my-5">
                <p className="mb-0 font-40 text-center">I am your AI Assistant</p>
                <p className="mb-0 ai-sub-text text-center">
                  Unlock the power of generative AI with your data
                </p>
                <p className="mb-0 py-2 ai-description text-center w-75  w-sm-100 w-md-50  m-auto">
                  I am trained on a massive amount of your data.
                </p>
              </div>
            ) : (
              <>
                {data.map((element, idx) => (
                  <div className="pt-5" id={element.id}>
                    <div className="d-flex align-items-start">
                      <img
                        src={
                          profileData?.profile_pic === null
                            ? "/nav-popover/user.svg"
                            : profileData?.profile_pic
                        }
                        width={40}
                        height={40}
                        className="img-fluid"
                      ></img>
                      <div className="ms-2">
                        <span className=" font-size-18">
                          {element.question}
                          {/* What are the major revenue generators of Apple Inc from past three years */}
                        </span>
                      </div>
                    </div>
                    <div style={{ marginLeft: "40px" }} className="my-3">
                      <div
                        id={"responseText" + element.id}
                        style={{ background: "#F7FAFC" }}
                        className="p-3"
                      >
                        {/* {element.responseText} */}
                      </div>
                      {Array.isArray(element.files)
                        ? element.files.map((file) => (
                            <>
                              {!file.match(/\/([^\/]+\.(pdf|txt))$/i) ? (
                                <>
                                  {isValidURL(file) ? (
                                    <a
                                      className="d-inline-block text-truncate my-2"
                                      href={file}
                                      target="_blank"
                                    >
                                      {file.replace("https://deeplobe-ai.s3.amazonaws.com/", "")}
                                    </a>
                                  ) : (
                                    ""
                                  )}
                                </>
                              ) : (
                                <div className="d-flex gap-2 mx-2 my-3">
                                  <img src="/ai-files-icon.svg"></img>
                                  <span className="d-inline-block text-truncate">
                                    {file.replace(
                                      "https://deeplobe-ai.s3.amazonaws.com/media_assets/",
                                      ""
                                    )}
                                  </span>
                                  {file.endsWith(".pdf") ? (
                                    <>
                                      <span
                                        onClick={() => previewPdf(file)}
                                        className=" cursor-pointer badge ai-chips-bg  text-center align-items-center justify-content-center d-flex gap-1"
                                      >
                                        <img src="/ai-preview-icon.svg" className="mx-1" />
                                        Preview
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}

                                  <span
                                    className=" cursor-pointer badge ai-chips-bg  text-center align-items-center justify-content-center d-flex gap-1"
                                    onClick={() => downloadFile(file)}
                                  >
                                    <img src="/ai-download-icon.svg" className="mx-1" />
                                    Download
                                  </span>
                                </div>
                              )}
                            </>
                          ))
                        : " "}
                      {/* tags */}
                      {/* <div className="d-flex my-2">
                        {element.tags?.map((ele) => (
                          <span className="ai-tags py-1 px-3 m-2 font-14">{ele}</span>
                        ))}
                      </div> */}
                    </div>
                    {idx < data.length - 1 && (
                      <hr style={{ borderTop: "dashed 2px" }} className="m-0" />
                    )}
                  </div>
                ))}
              </>
            )}
            {/* <div className="overflow-auto" style={{ height: "100px" }}> */}
            <div className={`py-2 ${stepper !== "step-1" ? "postion-sticky-ai" : ""}`}>
              <div className="text-end font-14 px-1 py-2">
                {loadingState === "searching the imformation" ? (
                  <span style={{ color: "#616161" }}> Searching the information..</span>
                ) : loadingState === "generating response" ? (
                  <>
                    <span className="px-2" style={{ color: "#616161" }}>
                      {" "}
                      Generating response...
                    </span>
                    {/* <img src="/ai-cancel-icon.svg" />{" "} */}
                  </>
                ) : loadingState === "stop generating response" ? (
                  <>
                    <span className="px-2" style={{ color: "#616161" }}>
                      {" "}
                      Stop Generating Response...
                    </span>
                    {/* <img src="/ai-cancel-icon.svg" />{" "} */}
                  </>
                ) : loadingState === "re-generate response" ? (
                  <>
                    <span style={{ color: "#616161" }}> Re-generate Response</span>
                    <img
                      onClick={regenerateResp}
                      className="cursor-pointer px-2"
                      src="/ai-regenerate-icon.svg"
                    />{" "}
                  </>
                ) : (
                  ""
                )}
                <InputGroup className="mb-3 ai-ask-input my-2">
                  <Form.Control
                    placeholder="What can I help you with?"
                    aria-describedby="basic-addon2"
                    as="textarea"
                    aria-label="With textarea"
                    className="py-2 ai-input"
                    style={{ resize: "none" }}
                    onKeyDown={(e) => {
                      handleKeyDown(e, "onEnter");
                    }}
                    onChange={(e) => setQuestion(e.target.value)}
                    value={question}
                  />
                  <Button
                    variant="outline-secondary"
                    id="ai-send-button"
                    onClick={(e) => handleKeyDown(e, "button")}
                  >
                    <img src="/ai-send-icon.svg"></img>
                  </Button>
                </InputGroup>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>

      <Modal
        onHide={() => {
          setPreviewModel(false);
        }}
        show={previewModel}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <div className="pdf-div d-flex flex-column align-items-center justify-content-center">
            <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
              {Array.apply(null, Array(numPages))
                .map((x, i) => i + 1)
                .map((page, id) => (
                  <Page key={id} pageNumber={page} renderTextLayer={false} />
                ))}
            </Document>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
