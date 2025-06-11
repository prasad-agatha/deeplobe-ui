import React from "react";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import GoogleDrive from "@uppy/google-drive";
import OneDrive from "@uppy/onedrive";
import AwsS3 from "@uppy/aws-s3";
import DropTarget from "@uppy/drop-target";
import Compressor from "@uppy/compressor";
import router from "next/router";
import _ from "lodash";
import ImageBatchService from "services/imageupload.service";
import { toast } from "react-toastify";
const imageBatchService = new ImageBatchService();
require("@uppy/core/dist/style.css");
require("@uppy/dashboard/dist/style.css");

export default function App() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) {
      const uppy = new Uppy({
        debug: true,
        autoProceed: false,
        restrictions: {
          maxFileSize: 1000000,
          maxNumberOfFiles: 1000,
          minNumberOfFiles: 1,
          allowedFileTypes: ["image/*", "video/*"],
        },
      })
        .use(Dashboard, {
          trigger: ".UppyModalOpenerBtn",
          disableLocalFiles: true,
          inline: true,
          target: ".DashboardContainer",
          replaceTargetContent: true,
          showProgressDetails: true,
          proudlyDisplayPoweredByUppy: false,
          height: 300,
          metaFields: [
            { id: "name", name: "Name", placeholder: "file name" },
            {
              id: "caption",
              name: "Caption",
              placeholder: "describe what the image is about",
            },
          ],
          browserBackButtonClose: true,
        })
        .use(AwsS3, {
          companionUrl: process.env.NEXT_PUBLIC_COMPANION_SERVER_URL,
          async getUploadParameters(file) {
            const d = document.getElementById("divider");
            const wind = document.getElementById("dashboard-layout-wrapper");
            const dw = d.clientWidth ? d.clientWidth : 1110;
            const dh = wind.clientHeight ? wind.clientHeight : 1080;
            const rw = Math.floor(dw * 0.25) - 200 > 0 ? Math.floor(dw * 0.25) : 200;
            const block_w = Math.floor(dw - 116 - rw);
            const block_h = Math.floor(dh - 480) > 400 ? Math.floor(dh - 480) : 400;
            const queryParams = new URLSearchParams({
              uuid: router.query.uuid,
              width: block_w,
              height: block_h,
            });
            const response = await fetch(
              `${
                process.env.NEXT_PUBLIC_COMPANION_SERVER_URL
              }/get-presigned-url?${queryParams.toString()}`,
              {
                method: "post",
                body: JSON.stringify(file.meta),
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            );

            return await response.json();
          },
        })
        .use(OneDrive, {
          target: Dashboard,
          companionUrl: process.env.NEXT_PUBLIC_COMPANION_SERVER_URL,
        })
        .use(DropTarget, { target: document.body })
        .use(Compressor)
        .use(GoogleDrive, {
          target: Dashboard,
          companionUrl: process.env.NEXT_PUBLIC_COMPANION_SERVER_URL,
        });

      const uploaded_file_links = [];

      uppy.on("complete", async (result) => {
        const keys = result.successful.map(
          (item) => item.xhrUpload.endpoint.split(`${item.name}?`)[0] + item.name
        );
        console.log(keys);
        const uuid = router.query.uuid;
        let tag = { selectedImages: uploaded_file_links };
        let tempUrls = [];
        const d = document.getElementById("divider");
        const wind = document.getElementById("dashboard-layout-wrapper");
        const dw = d.clientWidth ? d.clientWidth : 1110;
        const dh = wind.clientHeight ? wind.clientHeight : 1080;
        const rw = Math.floor(dw * 0.25) - 200 > 0 ? Math.floor(dw * 0.25) : 200;
        const block_w = Math.floor(dw - 116 - rw);
        const block_h = Math.floor(dh - 480) > 400 ? Math.floor(dh - 480) : 400;
        imageBatchService
          .uploadImages({
            urls: keys,
            uuid: uuid,
            width: block_w,
            height: block_h,
          })
          .then(() => {
            router.replace(router.pathname.replace("[uuid]", router.query.uuid) + `?annotate`);
            toast.success("Images uploaded successfully");
          })
          .catch(() => {
            toast.error("Error uploading images. Try again.");
          });
        tempUrls = _.chunk(tag.selectedImages, 25);
      });
      uppy.on("error", (error) => {
        console.log("Error");
      });
    }
  }, [ref]);

  return (
    <div className="App ">
      <div className="DashboardContainer bg-gray mb-2" ref={ref}></div>
    </div>
  );
}
