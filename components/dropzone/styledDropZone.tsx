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

function MyDropzone({
  setSelectedImages,
  maxNumberOfImages,
  align,
  selectedImages,
  acceptExtensions,
}: any) {
  const onDrop = (acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      if (fileRejections.length > maxNumberOfImages)
        toast.error(
          `Please upload max of ${maxNumberOfImages} image${maxNumberOfImages > 1 ? "s" : ""}`
        );
      else toast.error("Only .jpeg, .jpg and .png files with max size of 1MB");
    } else {
      if (maxNumberOfImages > 1) {
        if (selectedImages.length + acceptedFiles.length > maxNumberOfImages) {
          toast.error(
            `Please upload max of ${maxNumberOfImages} image${maxNumberOfImages > 1 ? "s" : ""}`
          );
          return;
        }
        let images = [...selectedImages];
        for (let [index, img] of acceptedFiles.entries()) {
          images.push(img);
        }
        setSelectedImages(images);
      } else {
        setSelectedImages(acceptedFiles);
      }
    }
  };
  const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept, fileRejections } =
    useDropzone({
      onDrop,
      accept: acceptExtensions ? acceptExtensions : ["image/jpeg", "image/png", "image/jpg"],
      maxFiles: maxNumberOfImages,
      maxSize: 1048576,
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
        Only .jpeg, .jpg and .png file{maxNumberOfImages > 10 && "s"} with max size of 1MB
      </small>
    </div>
  );
}

export default MyDropzone;
