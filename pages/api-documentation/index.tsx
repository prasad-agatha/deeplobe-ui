// **************** Internal ************************

// React internal imports
import React from "react";
// Deeplobe layout import
import MainLayout from "layouts/MainLayout";
import { Image, Tab, Tabs } from "react-bootstrap";
import { copyToClipBoard } from "common_functions/functions";

// ***************** external ************************

//syntax highlighter
import SyntaxHighlighter from "react-syntax-highlighter";
// toasts
import { toast } from "react-toastify";
import NewSampleCodeAccordian from "@components/accordion/newSampleCode";
import {
  custom_Imageclassification_response,
  custom_image_similarity_response,
  custom_Semantic_segmentation_response,
  custom_Instance_segmentation_response,
  custom_Optical_character_recognition_response,
  custom_Image_tagging_response,
  pretrained_pii_extractor_response,
  pretrained_table_extractor_response,
  pretrained_Sentiment_analysis_response,
  pretrained_Image_similarity_response,
  pretrained_Facial_detection_response,
  pretrained_Demographic_recognition_response,
  pretrained_Facial_expression_response,
  pretrained_Pose_detection_response,
  pretrained_Text_moderation_response,
  pretrained_People_vehicle_detection_response,
  pretrained_Wound_detection_response,
  background_removal_response,
} from "common_functions/sample_code_data";

//toast configuration
toast.configure();

const sample_code_options = [
  { id: 1, name: "Curl" },
  { id: 2, name: "Python" },
  { id: 3, name: "Node.js" },
];

const Index = () => {
  const [key, setKey] = React.useState("Curl");
  var url = "https://sample-url";
  // Code block design goes here
  const theme = {
    hljs: {
      display: "block",
      overflowX: "auto",
      padding: "0.5em",
      // background: "#222323",
      background: "#1e1e3f",
      color: "#fff",
      borderRadius: "0px 0px 4px 4px",
      fontFamily: "monospace",
    },
  };

  // Syntax highlight function
  const syntaxHighlight = (text) => {
    return (
      <div className="relative d-flex flex-column ">
        <div className="d-flex w-100 float-right response_copy_div p-2">
          <img
            src="/images/copy-icon2.svg"
            alt="copy-icon"
            className="ms-auto my-0"
            style={{ cursor: "pointer" }}
            width={20}
            height={20}
            onClick={() => save_to_clipboard(text)}
          />
        </div>
        <SyntaxHighlighter language="javascript" style={theme} wrapLongLines>
          {text}
        </SyntaxHighlighter>
      </div>
    );
  };

  const save_to_clipboard = (text) => {
    copyToClipBoard(`${text}`);
    toast.success("Copied!");
  };

  const text2 = `\n\tGET /api/aimodels/ \n\n\tHTTP 401 Unauthorized\n\tAllow: GET, POST, HEAD, OPTIONS\n\tContent-Type: application/json\n\tVary: Accept\n\tWWW-Authenticate: Bearer realm="api" \n\n\t{\n\t   "detail": "Authentication credentials were not provided."\n\t}\n`;
  // Html designed code goes here
  return (
    <MainLayout>
      <div className="mainc container w-75">
        <h3 className="fw-bold">API documentation</h3>
        <h4 className="fw-bold font-inter mt-4">Custom models</h4>

        <h5 className="fw-bold font-inter mt-4 pt-2" id="classification">
          1. Image classification model
        </h5>
        <p className="">
          Our image classification predict api function is safe and secure. This api predicts the
          input according to the trained model. One image should be sent as a payload to the url
          with headers mentioned below to comprehend an entire image as a whole to classify it by
          trained labels. The JSON data returned follows the below format:
        </p>
        {/* {syntaxHighlight(text2)} */}

        <NewSampleCodeAccordian
          isPretrained={false}
          isImageInput={false}
          url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/aimodels/`}
          url2={`REPLACE_MODEL_ID`}
          url3={`/prediction`}
          modelName={"Image classification model"}
          content_type="application/json"
          curl_payload='&#123;"images" &#58; &#91;"https://example.com/image_url"&#93;&#125;'
          // nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/image_url'&#93;&#125;"
          nodejs_payload="&#123;'images' &#58; &#91;'https://example.com/image_url'&#93; &#125;"
          python_payload="&#123;&#34;images&#34; &#58; &#91;&#34;https://example.com/image_url&#34;&#93;&#125;"
          data_format="text"
          number_of_files={1}
        />

        <h5 className="fw-bold font-inter mt-4">Request</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Header</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APIKEY *</td>
              <td>String</td>
              <td>A unique API key that is generated from the application</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold font-inter mt-4">Response</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>is_predicted</td>
              <td>Boolean</td>
              <td>A field to check whether a model is predicted or not</td>
            </tr>
            <tr>
              <td>aimodel</td>
              <td>Number</td>
              <td>Model id</td>
            </tr>
            <tr>
              <td>user</td>
              <td>Number</td>
              <td>User id of APIKEY used</td>
            </tr>
            <tr>
              <td>result</td>
              <td>Object</td>
              <td>Predicted results</td>
            </tr>
          </tbody>
        </table>
        <h5 className="font-weight-bold mt-4">Result:</h5>

        <div className="bg-red p-3">
          {syntaxHighlight(`${custom_Imageclassification_response}`)}
        </div>

        <h5 className="fw-bold font-inter mt-4 pt-2" id="image_similarity">
          2. Image similarity model
        </h5>
        <p className="">
          Our image similarity predict api function is safe and secure. This api predicts the input
          according to the trained model. Two images should be sent as a payload to the url with
          headers mentioned below to quantify the degree of similarity between two images on a scale
          of 0 to 10. The JSON data returned follows the below format
        </p>
        {/* {syntaxHighlight(text2)} */}
        <NewSampleCodeAccordian
          isPretrained={false}
          isImageInput={false}
          url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/aimodels/`}
          url2={`REPLACE_MODEL_ID`}
          url3={`/prediction`}
          modelName={"Image similarity model"}
          content_type="application/json"
          curl_payload='&#123;"images" &#58; &#91;"https://example.com/image_url1", "https://example.com/image_url2"&#93;  &#125;'
          nodejs_payload="&#123;'images' &#58; &#91;'https://example.com/image_url1', 'https://example.com/image_url2'&#93;&#125;"
          python_payload="&#123;&#34;images&#34; &#58; &#91;&#34;https://example.com/image_url1&#34;, &#34;https://example.com/image_url2&#34;&#93;&#125;"
          data_format="text"
          number_of_files={1}
        />

        <h5 className="fw-bold font-inter mt-4">Request</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Header</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APIKEY *</td>
              <td>String</td>
              <td>A unique API key that is generated from the application</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold font-inter mt-4">Response</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>is_predicted</td>
              <td>Boolean</td>
              <td>A field to check whether a model is predicted or not</td>
            </tr>
            <tr>
              <td>aimodel</td>
              <td>Number</td>
              <td>Model id</td>
            </tr>
            <tr>
              <td>user</td>
              <td>Number</td>
              <td>User id of APIKEY used</td>
            </tr>
            <tr>
              <td>result</td>
              <td>Object</td>
              <td>Predicted results</td>
            </tr>
          </tbody>
        </table>
        <h5 className="font-weight-bold mt-4">Result:</h5>
        {syntaxHighlight(`${custom_image_similarity_response}`)}
        <h5 className="fw-bold font-inter mt-4 pt-2" id="segmentation">
          3. Semantic segmentation model
        </h5>
        <p className="">
          Our semantic segmentation predict api function is safe and secure. This api predicts the
          input according to the trained model. One image should be sent as a payload to the url
          with headers mentioned below to sort types of dresses, identify types of location, gender,
          age. The JSON data returned follows the below format
        </p>
        <NewSampleCodeAccordian
          isPretrained={false}
          isImageInput={false}
          url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/aimodels/`}
          url2={`REPLACE_MODEL_ID`}
          url3={`/prediction`}
          modelName={"Semantic segmentation model"}
          content_type="application/json"
          curl_payload='&#123;"images" &#58; &#91;"https://example.com/image_url"&#93;&#125;'
          nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/image_url'&#93;&#125;"
          python_payload="&#123;&#34;images&#34; &#58; &#91;&#34;https://example.com/image_url&#34;&#93;&#125;"
          data_format="text"
          number_of_files={1}
        />
        <h5 className="fw-bold font-inter mt-4">Request</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Header</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APIKEY *</td>
              <td>String</td>
              <td>A unique API key that is generated from the application</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold font-inter mt-4">Response</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>is_predicted</td>
              <td>Boolean</td>
              <td>
                Boolean <br />A field to check whether a model is predicted or not
              </td>
            </tr>
            <tr>
              <td>aimodel</td>
              <td>Number</td>
              <td>Model id</td>
            </tr>
            <tr>
              <td>user</td>
              <td>Number</td>
              <td>User id of APIKEY used</td>
            </tr>
            <tr>
              <td>result</td>
              <td>Object</td>
              <td>Predicted results</td>
            </tr>
          </tbody>
        </table>
        <h5 className="font-weight-bold mt-4">Result:</h5>
        {syntaxHighlight(`${custom_Semantic_segmentation_response}`)}
        <h5 className="fw-bold font-inter mt-4 pt-2" id="instance">
          4. Instance segmentation model
        </h5>
        <p className="">
          Our instance segmentation predict api function is safe and secure. This api predicts the
          input according to the trained model. One image should be sent as a payload to the url
          with headers mentioned below to sort types of dresses, identify types of location, gender,
          age. The JSON data returned follows the below format
        </p>
        <NewSampleCodeAccordian
          isPretrained={false}
          isImageInput={false}
          url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/aimodels/`}
          url2={`REPLACE_MODEL_ID`}
          url3={`/prediction`}
          modelName={"Instance segmentation model"}
          content_type="application/json"
          curl_payload='&#123;"images" &#58; &#91;"https://example.com/image_url"&#93;&#125;'
          // nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/image_url'&#93;&#125;"
          nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/image_url'&#93;&#125;"
          python_payload="&#123;&#34;images&#34; &#58; &#91;&#34;https://example.com/image_url&#34;&#93;&#125;"
          data_format="text"
          number_of_files={1}
        />
        <h5 className="fw-bold font-inter mt-4">Request</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Header</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APIKEY *</td>
              <td>String</td>
              <td>A unique API key that is generated from the application</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold font-inter mt-4">Response</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>is_predicted</td>
              <td>Boolean</td>
              <td>
                Boolean <br />A field to check whether a model is predicted or not
              </td>
            </tr>
            <tr>
              <td>aimodel</td>
              <td>Number</td>
              <td>Model id</td>
            </tr>
            <tr>
              <td>user</td>
              <td>Number</td>
              <td>User id of APIKEY used</td>
            </tr>
            <tr>
              <td>result</td>
              <td>Object</td>
              <td>Predicted results</td>
            </tr>
          </tbody>
        </table>
        <h5 className="font-weight-bold mt-4">Result:</h5>
        {syntaxHighlight(`${custom_Instance_segmentation_response}`)}
        <h5 className="fw-bold font-inter mt-4 pt-2" id="ocr">
          5. Optical character recognition model
        </h5>
        <p className="">
          Our optical character recognition predict api function is safe and secure. This api
          predicts the input according to the trained model. One image should be sent as a payload
          to the url with headers mentioned below to extract text from scanned images, photos, and
          PDF files. The JSON data returned follows the below format
        </p>
        <NewSampleCodeAccordian
          isPretrained={false}
          isImageInput={false}
          url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/aimodels/`}
          url2={`REPLACE_MODEL_ID`}
          url3={`/prediction`}
          modelName={"Instance segmentation model"}
          content_type="application/json"
          curl_payload='&#123;"images" &#58; &#91;"https://example.com/image_url"&#93;&#125;'
          nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/image_url'&#93; &#125;"
          python_payload="&#123;&#34;images&#34; &#58; &#91;&#34;https://example.com/image_url&#34;&#93;&#125;"
          data_format="text"
          number_of_files={1}
        />
        <h5 className="fw-bold font-inter mt-4">Request</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Header</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APIKEY *</td>
              <td>String</td>
              <td>A unique API key that is generated from the application</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold font-inter mt-4">Response</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>is_predicted</td>
              <td>Boolean</td>
              <td>
                Boolean <br />A field to check whether a model is predicted or not
              </td>
            </tr>
            <tr>
              <td>aimodel</td>
              <td>Number</td>
              <td>Model id</td>
            </tr>
            <tr>
              <td>user</td>
              <td>Number</td>
              <td>User id of APIKEY used</td>
            </tr>
            <tr>
              <td>result</td>
              <td>Object</td>
              <td>Predicted results</td>
            </tr>
          </tbody>
        </table>
        <h5 className="font-weight-bold mt-4">Result:</h5>
        {syntaxHighlight(`${custom_Optical_character_recognition_response}`)}
        <h5 className="fw-bold font-inter mt-4 pt-2" id="object_detection">
          6. Object detection model
        </h5>
        <p className="">
          Our object detection predict api function is safe and secure. This api predicts the input
          according to the trained model. One image should be sent as a payload to the url with
          headers mentioned below to sort types of dresses, identify types of location, gender, age.
          The JSON data returned follows the below format
        </p>
        <NewSampleCodeAccordian
          isPretrained={false}
          isImageInput={false}
          url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/aimodels/`}
          url2={`REPLACE_MODEL_ID`}
          url3={`/prediction`}
          modelName={"Object detection model"}
          content_type="application/json"
          curl_payload='&#123;"images" &#58; &#91;"https://example.com/image_url"&#93;&#125;'
          nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/image_url'&#93;&#125;"
          python_payload="&#123;&#34;images&#34; &#58; &#91;&#34;https://example.com/image_url&#34;&#93;&#125;"
          data_format="text"
          number_of_files={1}
        />
        <h5 className="fw-bold font-inter mt-4">Request</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Header</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APIKEY *</td>
              <td>String</td>
              <td>A unique API key that is generated from the application</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold font-inter mt-4">Response</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>is_predicted</td>
              <td>Boolean</td>
              <td>
                Boolean <br />A field to check whether a model is predicted or not
              </td>
            </tr>
            <tr>
              <td>aimodel</td>
              <td>Number</td>
              <td>Model id</td>
            </tr>
            <tr>
              <td>user</td>
              <td>Number</td>
              <td>User id of APIKEY used</td>
            </tr>
            <tr>
              <td>result</td>
              <td>Object</td>
              <td>Predicted results</td>
            </tr>
          </tbody>
        </table>
        <h5 className="font-weight-bold mt-4">Result:</h5>
        {syntaxHighlight(`${custom_Image_tagging_response}`)}
        <h4 className="fw-bold font-inter mt-4">Pre-trained models</h4>
        <h5 className="fw-bold font-inter mt-4 pt-2" id="pii-data-extractor">
          1. PII data extractor
        </h5>
        <p className="">
          Our pii data extractor predict api function is safe and secure. This api predicts the
          input according to the trained model. One base64 image should be sent as a payload to the
          url with headers mentioned below to Automatically identify and extract personally
          identifiable information (PII) like email ids, passwords, credit cards numbers, social
          security numbers, etc. The JSON data returned follows the below format
        </p>
        <NewSampleCodeAccordian
          isPretrained={true}
          isImageInput={false}
          url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_pii_extraction`}
          url2={``}
          url3={``}
          modelName={"pii-data-extractor"}
          content_type="application/json"
          curl_payload="file=@file.pdf"
          nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/pdf_url'&#93;&#125;"
          python_payload="&#123;'file' &#58; open&#40;'file.jpg','rb'&#41;&#125;"
          data_format="formdata"
          number_of_files={1}
        />
        <h5 className="fw-bold font-inter mt-4">Request</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Header</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APIKEY *</td>
              <td>String</td>
              <td>A unique API key that is generated from the application</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold font-inter mt-4">Response</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>coordinate</td>
              <td>array</td>
              <td>coordinates of data if any</td>
            </tr>
            <tr>
              <td>s3_url</td>
              <td>string</td>
              <td>output pdf url</td>
            </tr>
          </tbody>
        </table>
        <h5 className="font-weight-bold mt-4">Result:</h5>
        {syntaxHighlight(`${pretrained_pii_extractor_response}`)}

        <h5 className="fw-bold font-inter mt-4 pt-2" id="table-extractor">
          2. Auto-table extractor
        </h5>
        <p className="">
          Our table extractor predict api function is safe and secure. This api predicts the input
          according to the trained model. One pdf file should be sent as a payload to the url with
          headers mentioned below to automatically identify and extract tables. The JSON data
          returned follows the below format
        </p>
        <NewSampleCodeAccordian
          isPretrained={true}
          isImageInput={false}
          url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_pii_extraction`}
          url2={``}
          url3={``}
          modelName={"pii-data-extractor"}
          content_type="application/json"
          curl_payload="file=@file.pdf"
          nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/pdf_url'&#93;&#125;"
          python_payload="&#123;'file' &#58; open&#40;'file.jpg','rb'&#41;&#125;"
          data_format="formdata"
          number_of_files={1}
        />
        <h5 className="fw-bold font-inter mt-4">Request</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Header</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APIKEY *</td>
              <td>String</td>
              <td>A unique API key that is generated from the application</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold font-inter mt-4">Response</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>results</td>
              <td>array</td>
              <td>coordinates of data if any</td>
            </tr>
            <tr>
              <td>s3_url</td>
              <td>string</td>
              <td>output pdf url</td>
            </tr>
          </tbody>
        </table>
        <h5 className="font-weight-bold mt-4">Result:</h5>
        {syntaxHighlight(`${pretrained_table_extractor_response}`)}
        <h5 className="fw-bold font-inter mt-4 pt-2" id="sentimental-analysis">
          3. Sentiment analysis model
        </h5>
        <p className="">
          Our sentiment analysis predict api function is safe and secure. This api predicts the
          input according to the trained model. Text should be sent as a payload to the url with
          headers mentioned below to extract sentiment and classify the connotation of text as
          negative, neutral, or positive. The JSON data returned follows the below format
        </p>
        <NewSampleCodeAccordian
          isPretrained={true}
          isImageInput={false}
          url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_sentimental_analysis`}
          url2={``}
          url3={``}
          modelName={"Sentiment analysis model"}
          content_type="application/json"
          curl_payload='&#123;"text" &#58; "sample text"&#125;'
          nodejs_payload=" &#123;'text' &#58; 'sample text'&#125; "
          python_payload="&#123;&#34;text&#34; &#58; &#34;sample text&#34;&#125;"
          data_format="text"
          number_of_files={1}
        />
        <h5 className="fw-bold font-inter mt-4">Request</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Header</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APIKEY *</td>
              <td>String</td>
              <td>A unique API key that is generated from the application</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold font-inter mt-4">Response</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>NEGATIVE</td>
              <td>String</td>
              <td>Predicted negative score out of 1</td>
            </tr>
            <tr>
              <td>POSITIVE</td>
              <td>String</td>
              <td>Predicted positive score out of 1</td>
            </tr>
          </tbody>
        </table>
        <h5 className="font-weight-bold mt-4">Result:</h5>
        {syntaxHighlight(`${pretrained_Sentiment_analysis_response}`)}

        <h5 className="fw-bold font-inter mt-4 pt-2" id="image-similarity">
          4. Image similarity model
        </h5>
        <p className="">
          Our image similarity predict api function is safe and secure. This api predicts the input
          according to the trained model. Two base64 images should be sent as a payload to the url
          with headers mentioned below to compare two images and returns a value that indicates
          visual similarly. The JSON data returned follows the below format
        </p>
        <NewSampleCodeAccordian
          isPretrained={true}
          isImageInput={false}
          url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_image_similarity`}
          url2={``}
          url3={``}
          modelName={"Image similarity model"}
          content_type="application/json"
          curl_payload="file=@file1.jpg"
          nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/image_url'&#93;&#125;"
          python_payload="&#123;'file' &#58; open&#40;'file1.jpg', 'rb'&#41;, 'file' &#58; open&#40;'file2.jpg', 'rb'&#41;&#125;"
          data_format="formdata"
          number_of_files={2}
        />
        <h5 className="fw-bold font-inter mt-4">Request</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Header</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APIKEY *</td>
              <td>String</td>
              <td>A unique API key that is generated from the application</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold font-inter mt-4">Response</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>score</td>
              <td>String</td>
              <td>Predicted similarity score out of 10</td>
            </tr>
            <tr>
              <td>image1</td>
              <td>String</td>
              <td>Input image url</td>
            </tr>
            <tr>
              <td>image2</td>
              <td>String</td>
              <td>Input image url</td>
            </tr>
          </tbody>
        </table>
        <h5 className="font-weight-bold mt-4">Result:</h5>
        {syntaxHighlight(`${pretrained_Image_similarity_response}`)}

        <h5 className="fw-bold font-inter mt-4 pt-2" id="facial-detection">
          5. Facial detection model
        </h5>
        <p className="">
          Our facial detection predict api function is safe and secure. This api predicts the input
          according to the trained model. One base64 image should be sent as a payload to the url
          with headers mentioned below to recognize faces within an image. The JSON data returned
          follows the below format
        </p>
        <NewSampleCodeAccordian
          isPretrained={true}
          isImageInput={false}
          url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_facial_detection`}
          url2={``}
          url3={``}
          modelName={"Facial detection model"}
          content_type="application/json"
          curl_payload="file=@file.jpg"
          nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/image_url'&#93;&#125;"
          python_payload="&#123;'file' &#58; open&#40;'file.jpg','rb'&#41;&#125;"
          data_format="formdata"
          number_of_files={1}
        />
        <h5 className="fw-bold font-inter mt-4">Request</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Header</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APIKEY *</td>
              <td>String</td>
              <td>A unique API key that is generated from the application</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold font-inter mt-4">Response</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>original_image_url</td>
              <td>String</td>
              <td>Input image url</td>
            </tr>
            <tr>
              <td>annotated_img_url</td>
              <td>String</td>
              <td>Annotated image url</td>
            </tr>
            <tr>
              <td>no_of_faces</td>
              <td>Number</td>
              <td>Predicted number of faces</td>
            </tr>
          </tbody>
        </table>
        <h5 className="font-weight-bold mt-4">Result:</h5>
        {syntaxHighlight(`${pretrained_Facial_detection_response}`)}

        <h5 className="fw-bold font-inter mt-4 pt-3" id="demographic-recognition">
          6. Demographic recognition model
        </h5>
        <p className="">
          Our demographic recognition model predict api function is safe and secure. This api
          predicts the input according to the trained model. One base64 image should be sent as a
          payload to the url with headers mentioned below to identify the age, gender, and cultural
          appearance of people in an image . The JSON data returned follows the below format
        </p>
        <NewSampleCodeAccordian
          isPretrained={true}
          isImageInput={false}
          url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_demographic_recognition`}
          url2={``}
          url3={``}
          modelName={"Demographic recognition model"}
          content_type="application/json"
          curl_payload="file=@file.jpg"
          nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/image_url'&#93;&#125;"
          python_payload="&#123;'file' &#58; open&#40;'file.jpg','rb'&#41;&#125;"
          data_format="formdata"
          number_of_files={1}
        />
        <h5 className="fw-bold font-inter mt-4">Request</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Header</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APIKEY *</td>
              <td>String</td>
              <td>A unique API key that is generated from the application</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold font-inter mt-4">Response</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>original_image_url</td>
              <td>String</td>
              <td>Input image url</td>
            </tr>
            <tr>
              <td>annotated_img_url</td>
              <td>String</td>
              <td>Annotated image url</td>
            </tr>
            <tr>
              <td>no_of_faces</td>
              <td>Number</td>
              <td>Predicted number of faces</td>
            </tr>
            <tr>
              <td>faces</td>
              <td>Array</td>
              <td>Detected face image urls</td>
            </tr>
          </tbody>
        </table>
        <h5 className="font-weight-bold mt-4">Result:</h5>
        {syntaxHighlight(`${pretrained_Demographic_recognition_response}`)}

        <h5 className="fw-bold font-inter mt-4 pt-2" id="facial-expression">
          7. Facial expression recognition
        </h5>
        <p className="">
          Our facial expression recognition model predict api function is safe and secure. This api
          predicts the input according to the trained model. One base64 image should be sent as a
          payload to the url with headers mentioned below to identify human facial expression from a
          given image. The JSON data returned follows the below format
        </p>
        <NewSampleCodeAccordian
          isPretrained={true}
          isImageInput={false}
          url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_facial_expression`}
          url2={``}
          url3={``}
          modelName={"Facial expression recognition"}
          content_type="application/json"
          curl_payload="file=@file.jpg"
          nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/image_url'&#93;&#125;"
          python_payload="&#123;'file' &#58; open&#40;'file.jpg','rb'&#41;&#125;"
          data_format="formdata"
          number_of_files={1}
        />
        <h5 className="fw-bold font-inter mt-4">Request</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Header</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APIKEY *</td>
              <td>String</td>
              <td>A unique API key that is generated from the application</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold font-inter mt-4">Response</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>original_image_url</td>
              <td>String</td>
              <td>Input image url</td>
            </tr>
            <tr>
              <td>annotated_img_url</td>
              <td>String</td>
              <td>Annotated image url</td>
            </tr>
            <tr>
              <td>no_of_faces</td>
              <td>Number</td>
              <td>Predicted number of faces</td>
            </tr>
            <tr>
              <td>faces</td>
              <td>Array</td>
              <td>Detected face image urls,emotions and dominant emotion</td>
            </tr>
          </tbody>
        </table>
        <h5 className="font-weight-bold mt-4">Result:</h5>
        {syntaxHighlight(`${pretrained_Facial_expression_response}`)}

        <h5 className="fw-bold font-inter mt-4 pt-2" id="pose-detection">
          8. Pose detection
        </h5>
        <p className="">
          Our pose detection model predict api function is safe and secure. This api predicts the
          input according to the trained model. One base64 image should be sent as a payload to the
          url with headers mentioned below to detect various human body poses within an image. The
          JSON data returned follows the below format
        </p>
        <NewSampleCodeAccordian
          isPretrained={true}
          isImageInput={false}
          url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_pose_detection`}
          url2={``}
          url3={``}
          modelName={"Pose detection"}
          content_type="application/json"
          curl_payload="file=@file.jpg"
          nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/image_url'&#93;&#125;"
          python_payload="&#123;'file' &#58; open&#40;'file.jpg','rb'&#41;&#125;"
          data_format="formdata"
          number_of_files={1}
        />
        <h5 className="fw-bold font-inter mt-4">Request</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Header</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APIKEY *</td>
              <td>String</td>
              <td>A unique API key that is generated from the application</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold font-inter mt-4">Response</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>original_image_url</td>
              <td>String</td>
              <td>Input image url</td>
            </tr>
            <tr>
              <td>annotated_img_url</td>
              <td>String</td>
              <td>Annotated image url</td>
            </tr>
          </tbody>
        </table>
        <h5 className="font-weight-bold mt-4">Result:</h5>
        {syntaxHighlight(`${pretrained_Pose_detection_response}`)}

        <h5 className="fw-bold font-inter mt-4 pt-2" id="text-moderation">
          9. Text moderation
        </h5>
        <p className="">
          Our text moderation model predict api function is safe and secure. This api predicts the
          input according to the trained model. Text should be sent as a payload to the url with
          headers mentioned below to analyze and calculate a probability score that text contains
          toxic, insulting, obscene or threatening. The JSON data returned follows the below format
        </p>
        <NewSampleCodeAccordian
          isPretrained={true}
          isImageInput={false}
          url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_text_moderation`}
          url2={``}
          url3={``}
          modelName={"Text moderation"}
          content_type="application/json"
          curl_payload='&#123;"text" &#58; "sample text"&#125;'
          nodejs_payload=" &#123;'text' &#58; 'sample text'&#125; "
          python_payload="&#123;&#34;text&#34; &#58; &#34;sample text&#34;&#125;"
          data_format="text"
          number_of_files={1}
        />
        <h5 className="fw-bold font-inter mt-4">Request</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Header</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APIKEY *</td>
              <td>String</td>
              <td>A unique API key that is generated from the application</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold font-inter mt-4">Response</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>NON_HATE</td>
              <td>String</td>
              <td>Predicted non hate score out of 1</td>
            </tr>
            <tr>
              <td>HATE</td>
              <td>String</td>
              <td>Predicted hate score out of 1</td>
            </tr>
          </tbody>
        </table>
        <h5 className="font-weight-bold mt-4">Result:</h5>
        {syntaxHighlight(`${pretrained_Text_moderation_response}`)}

        <h5 className="fw-bold font-inter mt-4 pt-2" id="people-vehicle-detection">
          10. People and vehicle detection
        </h5>
        <p className="">
          Our people and vehicle detection model predict api function is safe and secure. This api
          predicts the input according to the trained model. One base64 image should be sent as a
          payload to the url with headers mentioned below to detect vehicles and people within an
          image. The JSON data returned follows the below format
        </p>
        <NewSampleCodeAccordian
          isPretrained={true}
          isImageInput={false}
          url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_people_vehicle_detection`}
          url2={``}
          url3={``}
          modelName={"People and vehicle detection"}
          content_type="application/json"
          curl_payload="file=@file.jpg"
          nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/image_url'&#93;&#125;"
          python_payload="&#123;'file' &#58; open&#40;'file.jpg','rb'&#41;&#125;"
          data_format="formdata"
          number_of_files={1}
        />
        <h5 className="fw-bold font-inter mt-4">Request</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Header</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APIKEY *</td>
              <td>String</td>
              <td>A unique API key that is generated from the application</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold font-inter mt-4">Response</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>original_image_url</td>
              <td>String</td>
              <td>Input image url</td>
            </tr>
            <tr>
              <td>annotated_img_url</td>
              <td>String</td>
              <td>Annotated image url</td>
            </tr>
            <tr>
              <td>no_of_people</td>
              <td>Number</td>
              <td>Detected number of people</td>
            </tr>
            <tr>
              <td>no_of_vehicles</td>
              <td>Array</td>
              <td>Detected number of vehicles</td>
            </tr>
          </tbody>
        </table>
        <h5 className="font-weight-bold mt-4">Result:</h5>
        {syntaxHighlight(`${pretrained_People_vehicle_detection_response}`)}

        <h5 className="fw-bold font-inter mt-4 pt-2" id="wound-detection">
          11. Wound detection
        </h5>
        <p className="">
          Our wound detection model predict api function is safe and secure. This api predicts the
          input according to the trained model. One base64 image should be sent as a payload to the
          url with headers mentioned below to locate and segment the size and color of wounds within
          an image. The JSON data returned follows the below format
        </p>
        <NewSampleCodeAccordian
          isPretrained={true}
          isImageInput={false}
          url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/pre_wound_detection`}
          url2={``}
          url3={``}
          modelName={"Wound detection"}
          content_type="application/json"
          curl_payload="file=@file.jpg"
          nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/image_url'&#93;&#125;"
          python_payload="&#123;'file' &#58; open&#40;'file.jpg','rb'&#41;&#125;"
          data_format="formdata"
          number_of_files={1}
        />
        <h5 className="fw-bold font-inter mt-4">Request</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Header</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APIKEY *</td>
              <td>String</td>
              <td>A unique API key that is generated from the application</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold font-inter mt-4">Response</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>original_image_url</td>
              <td>String</td>
              <td>Input image url</td>
            </tr>
            <tr>
              <td>annotated_img_url</td>
              <td>String</td>
              <td>Annotated image url</td>
            </tr>
            <tr>
              <td>area</td>
              <td>Number</td>
              <td>Detected size of the wound</td>
            </tr>
            <tr>
              <td>color</td>
              <td>Array</td>
              <td>Detected colors of the wound</td>
            </tr>
          </tbody>
        </table>
        <h5 className="font-weight-bold mt-4" id="wound-detection">
          Result:
        </h5>
        {syntaxHighlight(`${pretrained_Wound_detection_response}`)}

        <h5 className="fw-bold font-inter mt-4 pt-2" id="wound-detection">
          12. Background removal
        </h5>
        <p className="">
          Our wound detection model predict api function is safe and secure. This api predicts the
          input according to the trained model. One base64 image should be sent as a payload to the
          url with headers mentioned below to locate and segment the size and color of wounds within
          an image. The JSON data returned follows the below format
        </p>
        <NewSampleCodeAccordian
          isPretrained={true}
          isImageInput={false}
          url1={`${process.env.NEXT_PUBLIC_API_SERVER}/api/pretrained-models/remove-background`}
          url2={``}
          url3={``}
          modelName={"background removal"}
          content_type="application/json"
          curl_payload="file=@file.jpg"
          nodejs_payload="&#123;'images' &#58;&#91;'https://example.com/image_url'&#93;&#125;"
          python_payload="&#123;'file' &#58; open&#40;'file.jpg','rb'&#41;&#125;"
          data_format="formdata"
          number_of_files={1}
        />
        <h5 className="fw-bold font-inter mt-4">Request</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Header</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>APIKEY *</td>
              <td>String</td>
              <td>A unique API key that is generated from the application</td>
            </tr>
          </tbody>
        </table>
        <h5 className="fw-bold font-inter mt-4">Response</h5>
        <table className="table bg-light font-inter">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Data type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>s3_url</td>
              <td>String</td>
              <td>Background removed image url</td>
            </tr>
          </tbody>
        </table>
        <h5 className="font-weight-bold mt-4" id="wound-detection">
          Result:
        </h5>
        {syntaxHighlight(`${background_removal_response}`)}
      </div>
    </MainLayout>
  );
};

export default Index;
