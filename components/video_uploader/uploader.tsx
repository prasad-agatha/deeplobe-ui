import React, { useCallback, useMemo } from "react";
import _ from "lodash";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import FrameService from "services/frames.service";

const frameService = new FrameService();

//toast configuration
toast.configure();

const baseStyle = {
  flex: 1,
  display: "flex",
  // flexDirection: "column",
  alignItems: "center",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#FFFFFF",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function VideoUploader({
  setShow_one,
  sliderValue,
  cal_no_images,
  setNumber_of_images,
  setVideo_fps,
  setMax_no_of_frames,
  maxNumberOfFiles,
  setLoading,
  acceptedFileExtention,
  video_details,
  setVideo_details,
}) {
  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.ceil((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " h, " : " h ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " m, " : " m ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " Sec" : "Sec") : "";
    return hDisplay + mDisplay + sDisplay;
  }

  const get_frames_count = (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("video", file);
    frameService
      .frames_count(formData)
      .then((res) => {
        setMax_no_of_frames(res.Number_of_image_frames);
        setVideo_fps(res.fps);
        // cal_no_images(sliderValue, res.Number_of_image_frames, res.fps);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Something went wrong");
        setLoading(false);
      });
  };

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      toast.error(fileRejections[0].errors[0].code || "something went wrong");
    } else {
      get_frames_count(acceptedFiles[0]);
      var vid = document.createElement("video");
      var fileURL = URL.createObjectURL(acceptedFiles[0]);
      vid.src = fileURL;

      // wait for duration to change from NaN to the actual duration

      vid.ondurationchange = function () {
        const url = URL.createObjectURL(acceptedFiles[0]);
        vid.currentTime = 2;
        // Wait for vid to seek to new time
        setNumber_of_images(Math.ceil(vid.duration));

        let thumbNail = "";
        vid.addEventListener("seeked", () => {
          var canvas: any = document.createElement("CANVAS");
          const ctx = canvas.getContext("2d");
          ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg");
          thumbNail = dataUrl;
          setVideo_details({
            ...video_details,
            duration_in_sec: Math.ceil(vid.duration),
            duration: secondsToHms(vid.duration),
            file_name: acceptedFiles[0].name,
            file: acceptedFiles[0],
            video_thumbnail: thumbNail,
          });
        });
      };

      setShow_one(true);

      let base64String;

      let reader = new FileReader();
      reader.readAsDataURL(acceptedFiles[0]);
      reader.onloadend = () => {
        if (acceptedFiles[0].type === "application/pdf") {
          base64String = reader.result;
          //   setFileUrl(base64String.substr(base64String.indexOf(",") + 1));
        } else {
          //   setFileUrl(URL.createObjectURL(acceptedFiles[0]));
        }
      };
    }

    // selectedTag.selectedImages = acceptedFiles;
  }, []);
  const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept, fileRejections } =
    useDropzone({
      onDrop,
      accept: acceptedFileExtention,
      maxFiles: maxNumberOfFiles,
      maxSize: 70000000,
    });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <div className=" py-4 px-2" {...getRootProps({ style })}>
      <input {...getInputProps()} />
      <div className="d-flex w-100 flex-column">
        <small className="text-center w-100">
          Drag and drop your Video here.
          <a className="mb-3 text-blue" style={{ cursor: "pointer" }}>
            {" "}
            Browse files
          </a>
        </small>
        <small className="text-center"> Only mp4 files can be uploaded.</small>
      </div>
    </div>
  );
}

export default VideoUploader;
