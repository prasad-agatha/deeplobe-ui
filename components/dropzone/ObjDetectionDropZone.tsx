import React, { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
//toast configuration
toast.configure();

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  // alignItems: "center",
  padding: "20px",
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

function ObjDetectionDropzone({ setSelectedImages, maxNumberOfImages, align }) {
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0 && fileRejections.length > maxNumberOfImages) {
      toast.error(
        `Please upload max of ${maxNumberOfImages} file${maxNumberOfImages > 1 ? "s" : ""}`
      );
    } else {
      if (acceptedFiles[0].type.includes("image/") && acceptedFiles[0].size > 1048576)
        toast.error("Only image file with max size of 1MB");
      else if (acceptedFiles[0].type.includes("video/") && acceptedFiles[0].size > 10485760)
        toast.error("Only video file with max size of 10MB");
      else setSelectedImages(acceptedFiles);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept, fileRejections } =
    useDropzone({
      onDrop,
      accept: ["image/*", "video/*"],
      maxFiles: maxNumberOfImages,
      // maxSize: 1048576,
    });
  const style: any = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <div className="" {...getRootProps({ style })}>
      <input {...getInputProps()} />
      {/* <div className="d-flex"> */}
      <small className={`font-inter ${align ? "text-center" : ""}`}>
        Drag and drop file here.
        <a className="mb-3 font-inter text-blue" style={{ cursor: "pointer" }}>
          {" "}
          Browse files
        </a>
      </small>
      {/* </div>  */}

      <small className={`font-inter ${align ? "text-center" : ""}`}>
        Only image or video file with max size of 1MB and 10MB
      </small>
    </div>
  );
}

export default ObjDetectionDropzone;
