import AiNavBar from "components/AiAssistant/NavBar";
import Router from "next/router";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Document, Page, pdfjs } from "react-pdf";
import AiAssitantService from "services/aiAssistant";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import Head from "next/head";
import Typewriter from "typewriter-effect/dist/core";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const AiService = new AiAssitantService();

// loading state codes
// start
// searching the imformation
// generating response
// stop generating response
// re-generate response
const data = [];
export default function AiAssistant({ loginStatus, user: profileData, mutate }) {
  console.log(profileData, "{ loginStatus, user: profileData, mutate }");
  const [stepper, setStepper] = useState("step-1");
  const [data, setData] = useState([]);
  const [question, setQuestion] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const [loadingState, setLoadingState] = useState("start");
  const [previewModel, setPreviewModel] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const previewPdf = (file) => {
    setFileUrl(file);
    setPreviewModel(true);
  };

  const regenerateResp = () => {
    const actualData = data;
    const tempData = {
      id: data.length,
      question: lastQuestion,
    };

    actualData[actualData.length - 1] = tempData;
    // console.log(actualData, "temp actual data", tempData);

    setData(actualData);
    Router.push(`#${tempData.id}`);
    const payload = { text: lastQuestion };

    setLoadingState("generating response");
    var app = document.getElementById(`responseText${tempData.id}`);
    var typewriter = new Typewriter(app, {
      loop: false,
      delay: 50,
    });
    typewriter.typeString("").pauseFor(300).pauseFor(1000).start();
    AiService.SearchQuery(payload)
      .then((response) => {
        console.log(response, "ai response");
        const actualData = data;

        const tempData1 = {
          id: data.length,
          question: lastQuestion,
          responseText: response.text,
          tags: convertToTags(response.files) || ["10k"],
          files: response.files,
        };
        actualData[data.length - 1] = tempData1;

        typewriter.pauseFor(500).typeString(response.text).pauseFor(300).pauseFor(1000).start();
        console.log("after res", actualData, tempData1);

        setData(actualData);
        setLoadingState("re-generate response");
      })
      .catch((error) => {
        console.log(error, "error");
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
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("target", "_blank");
        link.download = "referenceFile";
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
    let allTags = ["10k"];
    files.map((file) => {
      let actualString = file.replace("https://deeplobe-ai.s3.amazonaws.com/llms/", "");
      let numbers = findNumbersInString(actualString);
      const regex = /\d+(\.\d+)?/g; // Regular expression to match numbers
      const replacedString = actualString.replace(regex, " ").replace(".pdf", "").replace("-", "");
      let year;
      if (numbers[0].length === 2) {
        year = "20" + numbers[0];
      } else {
        year = numbers[0];
      }
      // const tags = [replacedString, year];
      allTags.push(replacedString);
      allTags.push(year);
    });
    console.log([...new Set(allTags)], "allTags");
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
      const payload = { text: question };
      setQuestion("");
      setTimeout(function () {
        setQuestion("");
        var app = document.getElementById(`responseText${tempData.id}`);
        // if (app) {
        console.log(app, "appp");
        var typewriter = new Typewriter(app, {
          loop: false,
          delay: 50,
        });
        typewriter.typeString("").pauseFor(300).pauseFor(1000).start();

        AiService.SearchQuery(payload)
          .then((response) => {
            setLoadingState("generating response");
            const actualData = data;
            actualData.pop();

            typewriter.typeString(response.text).pauseFor(300).start();

            const tempData = {
              id: data.length + 1,
              question: question,
              responseText: response.text,
              tags: convertToTags(response.files) || ["10k"],
              files: response.files,
            };
            actualData.push(tempData);

            setData(actualData);
          })
          .catch((error) => {
            console.log(error, "error");
            setLoadingState("re-generate response");
            typewriter
              .pauseFor(500)
              .typeString("We are sorry, the server is down at this moment!")
              .pauseFor(300)
              .pauseFor(1000)
              .start();
            // typewriter.stop();
          })
          .finally(() => {
            console.log("finally");
            setLoadingState("re-generate response");
            // setQuestion("");
            // typewriter.stop();
          });
      }, 1000);
    }
  };
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_BRAND}</title>
        <link rel="icon" href={`${process.env.NEXT_PUBLIC_BRAND_FAVICON}`} />
      </Head>
      <div className="ai-bg min-vh-100   overflow-auto" style={{ height: "100px" }}>
        <div className="dashboard-top-bar ">
          <AiNavBar />
        </div>
        <div className="container  py-3">
          <div className={` my-5 px-5 mx-5   ${stepper === "step-2" ? "bg-white" : ""}`}>
            {stepper === "step-1" ? (
              <div className="py-5">
                <p className="mb-0 font-40 text-center">I am your AI Assistant</p>
                <p className="mb-0 ai-sub-text text-center">
                  Unlock the power of generative AI with our SEC Filing Chatbot
                </p>
                <p className="mb-0 py-2 ai-description text-center w-75  w-sm-100 w-md-50  m-auto">
                  I am trained on a massive amount of Financial data, but I am still under
                  development. I may not always understand your requests perfectly, but I will try
                  my best.
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
                      {element.files?.map((file) => (
                        <div className="d-flex gap-2 mx-2 my-3">
                          <img src="/ai-files-icon.svg"></img>
                          <span className="d-inline-block text-truncate">
                            {file.replace("https://deeplobe-ai.s3.amazonaws.com/llms/", "")}
                          </span>
                          <span
                            onClick={() => previewPdf(file)}
                            className=" cursor-pointer badge ai-chips-bg  text-center align-items-center justify-content-center d-flex gap-1"
                          >
                            <img src="/ai-preview-icon.svg" className="mx-1" />
                            Preview
                          </span>
                          <span
                            className=" cursor-pointer badge ai-chips-bg  text-center align-items-center justify-content-center d-flex gap-1"
                            onClick={() => downloadFile(file)}
                          >
                            <img src="/ai-download-icon.svg" className="mx-1" />
                            Download
                          </span>
                        </div>
                      ))}
                      {/* tags */}
                      <div className="d-flex my-2">
                        {element.tags?.map((ele) => (
                          <span className="ai-tags py-1 px-3 m-2 font-14">{ele}</span>
                        ))}
                      </div>
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
