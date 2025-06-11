import React from "react";
import { Accordion, Card, Form } from "react-bootstrap";
import { Image, Tab, Tabs } from "react-bootstrap";
import { copyToClipBoard } from "common_functions/functions";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  custom_Imageclassification_response,
  custom_image_similarity_response,
  custom_Semantic_segmentation_response,
  custom_Instance_segmentation_response,
  custom_Optical_character_recognition_response,
  custom_Image_tagging_response,
  pretrained_pii_extractor_response,
  pretrained_Sentiment_analysis_response,
  pretrained_Image_similarity_response,
  pretrained_Facial_detection_response,
  pretrained_Demographic_recognition_response,
  pretrained_Facial_expression_response,
  pretrained_Pose_detection_response,
  pretrained_Text_moderation_response,
  pretrained_People_vehicle_detection_response,
  pretrained_Wound_detection_response,
} from "common_functions/sample_code_data";
// toasts
import { toast } from "react-toastify";
import Link from "next/link";

const sample_code_options = [
  { id: 1, name: "Curl" },
  { id: 2, name: "Python" },
  { id: 3, name: "Node.js" },
];

//toast configuration
toast.configure();

const NewSampleCodeAccordian = ({
  isPretrained,
  isImageInput,
  url1,
  url2,
  url3,
  modelName,
  content_type,
  curl_payload,
  python_payload,
  nodejs_payload,
  data_format,
  number_of_files,
}) => {
  const theme = {
    hljs: {
      display: "block",
      overflowX: "auto",
      // background: "#222323",
      background: "#1e1e3f",
      color: "#fff",
      borderRadius: "4px",
      fontFamily: "monospace",
    },
  };

  const syntaxHighlight = (text) => {
    return (
      <div className="relative d-flex flex-column">
        <SyntaxHighlighter language="javascript" style={theme} wrapLongLines>
          {text}
        </SyntaxHighlighter>
      </div>
    );
  };
  const [activeKey, setActiveKey] = React.useState("1");
  const [code_options, setCode_options] = React.useState(1);
  const [key, setKey] = React.useState("Curl");
  const url = url1 + url2 + url3;
  const save_to_clipboard = () => {
    if (key === "Curl") {
      if (data_format === "formdata") {
        if (number_of_files === 2) {
          copyToClipBoard(
            ` curl -X POST '${url}'  \\
                -F '${curl_payload}'  \\
                -F 'file=@file2.jpg'  \\
                -H  'APIKEY: REPLACE_API_KEY'
            `
          );
        } else {
          copyToClipBoard(
            ` curl -X POST '${url}'   \\
                -F  '${curl_payload}'  \\
                -H  'APIKEY: REPLACE_API_KEY'  
            `
          );
        }
      } else {
        copyToClipBoard(
          ` curl -X POST '${url}'   \\
              -d  '${curl_payload}'  \\
              -H  'Content-Type:${content_type}'  \\
              -H  'APIKEY: REPLACE_API_KEY'  
          `
        );
      }
    } else if (key === "Python") {
      if (data_format === "formdata") {
        copyToClipBoard(
          `import requests
url = "${url}"
payload = ${python_payload}
headers = {
  "APIKEY" : "REPLACE_API_KEY"
}
response = requests.post(url, headers=headers,  files=payload)
print(response)`
        );
      } else {
        copyToClipBoard(
          `import requests
url = "${url}"
payload = ${python_payload}
headers = {
      "APIKEY" : "REPLACE_API_KEY",
      "Content-Type" : "${content_type}"
}
response = requests.post(url, headers=headers,  json=payload)
print(response)`
        );
      }
    } else if (key === "Node.js") {
      if (data_format === "formdata") {
        if (number_of_files === 2) {
          copyToClipBoard(
            ` var request = require('request')
const form_data = new FormData();
form_data.apppend('file', file1)
form_data.apppend('file', file2)
const options = {
      url : "${url}",
      body : form_data,
      headers : {
          "APIKEY" : "REPLACE_API_KEY"
      }
}
request.post(options, function(err, httpResponse, body) {
      console.log(body)
} ) ;`
          );
        } else if (number_of_files === 1) {
          copyToClipBoard(
            `var request = require('request')
const form_data = new FormData()
form_data.apppend('file', file)
const options = {
      url : "${url}",
      body : form_data,
      headers : {
          "APIKEY" : "REPLACE_API_KEY"
      }
}
request.post(options, function(err, httpResponse, body) {
      console.log(body)
});`
          );
        }
      } else {
        copyToClipBoard(
          `var request = require('request')
const payload = ${nodejs_payload}
const options = {
  url: "${url}",
  body: JSON.stringify(payload),
  headers: {
    "APIKEY" : "REPLACE_API_KEY",
    "Content-Type" : "application/json"
  },
};
request.post(options, function (err, httpResponse, body) {
  console.log(body);
});
        
           `
        );
      }
    }

    toast.success("Copied!");
  };
  return (
    <div
      className={`block-background py-3 px-2 ${isImageInput ? "mx-3" : ""} ${
        isPretrained ? "" : "my-3"
      }`}
    >
      {/* <Accordion defaultActiveKey="1" activeKey={activeKey}> */}
      <Card className="border-0">
        <Card.Header className="block-background" style={{ border: "None" }}>
          <div className="d-flex flex-wrap justify-content-between"></div>
        </Card.Header>
        <Card.Body
          className="font-14 code-bg p-0"
          style={{ borderRadius: "12px", lineHeight: "25.5px" }}
        >
          <div
            className="flex-between px-3"
            id="sample_code_div"
            style={{ backgroundColor: "#353740", borderRadius: "8px" }}
          >
            <Tabs
              id="samplecode-tab-example"
              activeKey={key}
              onSelect={(k: any) => {
                console.log(k, "key", key);
                setKey(k);
              }}
              className="font-12 font-weight-400"
            >
              {sample_code_options.map((e: any, id: any) => (
                <Tab eventKey={e.name} title={e.name} className="m-1" key={id}></Tab>
              ))}
            </Tabs>
            {key !== "Response" ? (
              <img
                src="/images/copy-icon2.svg"
                alt="copy-icon"
                className="ms-auto my-0"
                style={{ cursor: "pointer" }}
                width={20}
                height={20}
                onClick={save_to_clipboard}
              />
            ) : (
              ""
            )}
          </div>
          <div className="p-3 overflow-auto" style={{ fontFamily: "monospace" }}>
            {key === "Curl" ? (
              <>
                {data_format === "formdata" ? (
                  <>
                    {number_of_files === 2 ? (
                      <>
                        {" "}
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">1</small>
                          curl&nbsp;&nbsp;-X&nbsp;&nbsp;POST&nbsp;&nbsp;
                          <span className="code-purple ">'{url1}</span>
                          <span className="code-red">{url2}</span>
                          <span className="code-purple">{url3}'&nbsp;&nbsp;</span>
                          <span className="code-blue">\</span>
                        </p>
                        <p className="my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">2</small>
                          <span className="code-red" style={{ visibility: "hidden" }}>
                            curl&nbsp;&nbsp;-X&nbsp;&nbsp;POST&nbsp;&nbsp;
                          </span>
                          <span className="code-red">
                            -{data_format === "formdata" ? "F" : "d"}
                          </span>
                          <span className="code-green">
                            &nbsp;&nbsp;'{curl_payload}'&nbsp;&nbsp;
                          </span>
                          <span className="code-blue">\</span>
                        </p>
                        <p className="my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">3</small>
                          <span className="code-red" style={{ visibility: "hidden" }}>
                            curl&nbsp;&nbsp;-X&nbsp;&nbsp;POST&nbsp;&nbsp;
                          </span>
                          <span className="code-red">
                            -{data_format === "formdata" ? "F" : "d"}
                          </span>
                          <span className="code-green">
                            &nbsp;&nbsp;'file=@file2.jpg'&nbsp;&nbsp;
                          </span>
                          <span className="code-blue">\</span>
                        </p>
                        <p className="text-light my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">4</small>
                          <span className="code-red" style={{ visibility: "hidden" }}>
                            curl&nbsp;&nbsp;-X&nbsp;&nbsp;POST&nbsp;&nbsp;
                          </span>
                          <span className="code-red">-H</span>
                          <span className="code-green">&nbsp;&nbsp;'APIKEY: </span>
                          <span className="code-red">REPLACE_API_KEY</span>
                          <span className="code-green">'&nbsp;&nbsp;</span>
                          {/* <span className="code-blue">\</span> */}
                        </p>
                      </>
                    ) : number_of_files === 1 ? (
                      <>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">1</small>
                          curl&nbsp;&nbsp;-X&nbsp;&nbsp;POST&nbsp;&nbsp;
                          <span className="code-purple ">'{url1}</span>
                          <span className="code-red">{url2}</span>
                          <span className="code-purple">{url3}'&nbsp;&nbsp;</span>
                          <span className="code-blue">\</span>
                        </p>
                        <p className="my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">2</small>
                          <span className="code-red" style={{ visibility: "hidden" }}>
                            curl&nbsp;&nbsp;-X&nbsp;&nbsp;POST&nbsp;&nbsp;
                          </span>
                          <span className="code-red">
                            -{data_format === "formdata" ? "F" : "d"}
                          </span>
                          <span className="code-green">
                            &nbsp;&nbsp;'{curl_payload}'&nbsp;&nbsp;
                          </span>
                          <span className="code-blue">\</span>
                        </p>

                        <p className="text-light my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">3</small>
                          <span className="code-red" style={{ visibility: "hidden" }}>
                            curl&nbsp;&nbsp;-X&nbsp;&nbsp;POST&nbsp;&nbsp;
                          </span>
                          <span className="code-red">-H</span>
                          <span className="code-green">&nbsp;&nbsp;'APIKEY: </span>
                          <span className="code-red">REPLACE_API_KEY</span>
                          <span className="code-green">'&nbsp;&nbsp;</span>
                          {/* <span className="code-blue">\</span> */}
                        </p>
                      </>
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  <>
                    <p className="code-blue my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">1</small>
                      curl&nbsp;&nbsp;-X&nbsp;&nbsp;POST&nbsp;&nbsp;
                      <span className="code-purple ">'{url1}</span>
                      <span className="code-red">{url2}</span>
                      <span className="code-purple">{url3}'&nbsp;&nbsp;</span>
                      <span className="code-blue">\</span>
                    </p>
                    <p className="my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">2</small>
                      <span className="code-red" style={{ visibility: "hidden" }}>
                        curl&nbsp;&nbsp;-X&nbsp;&nbsp;POST&nbsp;&nbsp;
                      </span>
                      <span className="code-red">-{data_format === "formdata" ? "F" : "d"}</span>
                      <span className="code-green">&nbsp;&nbsp;'{curl_payload}'&nbsp;&nbsp;</span>
                      <span className="code-blue">\</span>
                    </p>
                    <p className="my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">3</small>
                      <span className="code-red" style={{ visibility: "hidden" }}>
                        curl&nbsp;&nbsp;-X&nbsp;&nbsp;POST&nbsp;&nbsp;
                      </span>
                      <span className="code-red">-H</span>
                      <span className="code-green">
                        &nbsp;&nbsp;'Content-Type: {content_type}'&nbsp;&nbsp;
                      </span>
                      <span className="code-blue">\</span>
                    </p>

                    <p className="text-light my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">4</small>
                      <span className="code-red" style={{ visibility: "hidden" }}>
                        curl&nbsp;&nbsp;-X&nbsp;&nbsp;POST&nbsp;&nbsp;
                      </span>
                      <span className="code-red">-H</span>
                      <span className="code-green">&nbsp;&nbsp;'APIKEY: </span>
                      <span className="code-red">REPLACE_API_KEY</span>
                      <span className="code-green">'&nbsp;&nbsp;</span>
                      {/* <span className="code-blue">\</span> */}
                    </p>
                  </>
                )}
              </>
            ) : key === "Python" ? (
              <>
                {data_format === "formdata" ? (
                  <>
                    {" "}
                    <p className="code-blue my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">1</small>
                      import requests
                    </p>
                    <p className="code-blue my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">2</small>
                      url &#61; <span className="code-purple ">"{url1}</span>
                      <span className="code-red">{url2}</span>
                      <span className="code-purple me-3">{url3}"</span>
                    </p>
                    <p className="code-blue my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">3</small>
                      payload &#61; {python_payload}
                    </p>
                    <p className="code-blue my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">4</small>
                      headers = &#123;{" "}
                    </p>
                    <p className="code-blue my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">5</small>
                      &nbsp;&nbsp;&nbsp;&nbsp; "APIKEY" :
                      <span className="code-red"> "REPLACE_API_KEY"</span>
                    </p>
                    {/* <p className="code-blue my-0 font-mono text-nowrap pe-3">
                  <small className="code-numbers me-3 my-0">6</small>
                  &nbsp;&nbsp;&nbsp;&nbsp; "Content-Type" : "{content_type}",
                </p> */}
                    <p className="code-blue my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">6</small>
                      &nbsp; &#125;
                    </p>
                    <p className="code-blue my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">7</small>
                      response = requests.post(url, headers=headers, files=payload)
                    </p>
                    <p className="code-blue my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">8</small>
                      print(response)
                    </p>
                  </>
                ) : (
                  <>
                    {" "}
                    <p className="code-blue my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">1</small>
                      import requests
                    </p>
                    <p className="code-blue my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">2</small>
                      url &#61; <span className="code-purple ">"{url1}</span>
                      <span className="code-red">{url2}</span>
                      <span className="code-purple me-3">{url3}"</span>
                    </p>
                    <p className="code-blue my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">3</small>
                      payload &#61; {python_payload}
                    </p>
                    <p className="code-blue my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">4</small>
                      headers = &#123;{" "}
                    </p>
                    <p className="code-blue my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">5</small>
                      &nbsp;&nbsp;&nbsp;&nbsp; "APIKEY" :
                      <span className="code-red"> "REPLACE_API_KEY"</span>,
                    </p>
                    <p className="code-blue my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">6</small>
                      &nbsp;&nbsp;&nbsp;&nbsp; "Content-Type" : "{content_type}"
                    </p>
                    <p className="code-blue my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">7</small>
                      &nbsp; &#125;
                    </p>
                    <p className="code-blue my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">8</small>
                      response = requests.post(url, headers=headers, json=payload)
                    </p>
                    <p className="code-blue my-0 font-mono text-nowrap pe-3">
                      <small className="code-numbers me-3 my-0">9</small>
                      print(response)
                    </p>
                  </>
                )}
              </>
            ) : key === "Node.js" ? (
              <>
                {data_format === "formdata" ? (
                  <>
                    {number_of_files === 1 ? (
                      <>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">1</small>
                          <span className="code-white"> var request </span> ={" "}
                          <span className="code-yellow">require</span>&#40;'request'&#41;
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">2</small>
                          <span className="code-white"> const form_data</span> &#61; new
                          FormData&#40;&#41;
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">3</small>
                          <span className="code-white"> form_data.apppend</span>&#40;'file',
                          file&#41;
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">4</small>
                          <span className="code-white"> const options</span> &#61; &#123;
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">5</small>
                          &nbsp;&nbsp; &nbsp;&nbsp; url &#58; &#34;
                          <span className="code-purple">{url1}</span>
                          <span className="code-red">{url2}</span>
                          <span className="code-purple">{url3}</span>
                          &#34;{","}
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">6</small>
                          &nbsp;&nbsp; &nbsp;&nbsp; body &#58;
                          <span className="code-white"> form_data</span>,
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">7</small>
                          &nbsp;&nbsp; &nbsp;&nbsp; headers &#58; &#123;
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">8</small>
                          &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; "APIKEY" &#58;
                          <span className="code-red"> "REPLACE_API_KEY"</span>
                        </p>

                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">9</small>
                          &nbsp;&nbsp; &nbsp;&nbsp; &#125;
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">10</small>
                          &#125;
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">11</small>
                          <span className="code-white"> request</span>.
                          <span className="code-yellow">post</span>&#40;
                          <span className="code-white">options</span>, function&#40;err,
                          httpResponse, body&#41; &#123;
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">12</small>
                          &nbsp;&nbsp; &nbsp;&nbsp; console.<span className="code-yellow">log</span>
                          &#40;body&#41;
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">13</small>
                          &#125;&#41;&#59;
                        </p>
                      </>
                    ) : number_of_files === 2 ? (
                      <>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">1</small>
                          <span className="code-white"> var request </span> ={" "}
                          <span className="code-yellow">require</span>&#40;'request'&#41;
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">2</small>
                          <span className="code-white"> const form_data</span> &#61; new
                          FormData&#40;&#41;
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">3</small>
                          <span className="code-white"> form_data.apppend</span>&#40;'file',
                          file1&#41;
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">4</small>
                          <span className="code-white"> form_data.apppend</span>&#40;'file',
                          file2&#41;
                        </p>

                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">5</small>
                          <span className="code-white"> const options</span> &#61; &#123;
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">6</small>
                          &nbsp;&nbsp; &nbsp;&nbsp; url &#58; &#34;
                          <span className="code-purple">{url1}</span>
                          <span className="code-red">{url2}</span>
                          <span className="code-purple">{url3}</span>
                          &#34;{","}
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">7</small>
                          &nbsp;&nbsp; &nbsp;&nbsp; body &#58;
                          <span className="code-white"> form_data</span>,
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">8</small>
                          &nbsp;&nbsp; &nbsp;&nbsp; headers &#58; &#123;
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">9</small>
                          &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; "APIKEY" &#58;
                          <span className="code-red"> "REPLACE_API_KEY"</span>
                        </p>

                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">10</small>
                          &nbsp;&nbsp; &nbsp;&nbsp; &#125;
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">11</small>
                          &#125;
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">12</small>
                          <span className="code-white"> request</span>.
                          <span className="code-yellow">post</span>&#40;
                          <span className="code-white">options</span>, function&#40;err,
                          httpResponse, body&#41; &#123;
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">13</small>
                          &nbsp;&nbsp; &nbsp;&nbsp; console.<span className="code-yellow">log</span>
                          &#40;body&#41;
                        </p>
                        <p className="code-blue my-0 font-mono text-nowrap pe-3">
                          <small className="code-numbers me-3 my-0">14</small>
                          &#125;&#41;&#59;
                        </p>
                      </>
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  <>
                    <>
                      <p className="code-blue my-0 font-mono text-nowrap pe-3">
                        <small className="code-numbers me-3 my-0">1</small>
                        <span className="code-white"> var request </span> ={" "}
                        <span className="code-yellow">require</span>&#40;'request'&#41;
                      </p>
                      <p className="code-blue my-0 font-mono text-nowrap pe-3">
                        <small className="code-numbers me-3 my-0">2</small>
                        <span className="code-white"> const payload</span> &#61; {nodejs_payload}
                      </p>
                      <p className="code-blue my-0 font-mono text-nowrap pe-3">
                        <small className="code-numbers me-3 my-0">3</small>
                        <span className="code-white"> const options</span> &#61; &#123;
                      </p>
                      <p className="code-blue my-0 font-mono text-nowrap pe-3">
                        <small className="code-numbers me-3 my-0">4</small>
                        &nbsp;&nbsp; &nbsp;&nbsp; url &#58; &#34;
                        <span className="code-purple">{url1}</span>
                        <span className="code-red">{url2}</span>
                        <span className="code-purple">{url3}</span>
                        &#34;{","}
                      </p>
                      <p className="code-blue my-0 font-mono text-nowrap pe-3">
                        <small className="code-numbers me-3 my-0">5</small>
                        &nbsp;&nbsp; &nbsp;&nbsp; body &#58; JSON.
                        <span className="code-yellow">stringify</span>&#40;
                        <span className="code-white">payload</span>&#41;,
                      </p>
                      <p className="code-blue my-0 font-mono text-nowrap pe-3">
                        <small className="code-numbers me-3 my-0">6</small>
                        &nbsp;&nbsp; &nbsp;&nbsp; headers &#58; &#123;
                      </p>
                      <p className="code-blue my-0 font-mono text-nowrap pe-3">
                        <small className="code-numbers me-3 my-0">7</small>
                        &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; "APIKEY" &#58;
                        <span className="code-red"> "REPLACE_API_KEY"</span>
                        {","}
                      </p>
                      <p className="code-blue my-0 font-mono text-nowrap pe-3">
                        <small className="code-numbers me-3 my-0">8</small>
                        &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; "Content-Type" &#58;
                        <span className="code-green"> "{content_type}"</span>
                      </p>
                      <p className="code-blue my-0 font-mono text-nowrap pe-3">
                        <small className="code-numbers me-3 my-0">9</small>
                        &nbsp;&nbsp; &nbsp;&nbsp; &#125;
                      </p>
                      <p className="code-blue my-0 font-mono text-nowrap pe-3">
                        <small className="code-numbers me-3 my-0">10</small>
                        &#125;
                      </p>
                      <p className="code-blue my-0 font-mono text-nowrap pe-3">
                        <small className="code-numbers me-3 my-0">11</small>
                        <span className="code-white"> request</span>.
                        <span className="code-yellow">post</span>&#40;
                        <span className="code-white">options</span>, function&#40;err, httpResponse,
                        body&#41; &#123;
                      </p>
                      <p className="code-blue my-0 font-mono text-nowrap pe-3">
                        <small className="code-numbers me-3 my-0">12</small>
                        &nbsp;&nbsp; &nbsp;&nbsp; console.<span className="code-yellow">log</span>
                        &#40;body&#41;
                      </p>
                      <p className="code-blue my-0 font-mono text-nowrap pe-3">
                        <small className="code-numbers me-3 my-0">13</small>
                        &#125;&#41;&#59;
                      </p>
                    </>
                  </>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewSampleCodeAccordian;
