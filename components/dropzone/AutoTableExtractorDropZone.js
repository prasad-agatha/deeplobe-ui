import React, { useCallback, useMemo } from "react";
import _ from "lodash";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
//toast configuration
toast.configure();

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  // padding: "60px 0px",
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

function AutoTableExtractorDropZone({ setActualFile, maxNumberOfFiles, acceptedFileExtention }) {
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      if (fileRejections.length > maxNumberOfFiles) {
        toast.error(`Please upload max of ${maxNumberOfFiles} pdf`);
      } else toast.error("Only pdf files with max size of 4MB");
    } else {
      setActualFile(acceptedFiles[0]);
    }

    // selectedTag.selectedImages = acceptedFiles;
  }, []);
  const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept, fileRejections } =
    useDropzone({
      onDrop,
      accept: acceptedFileExtention,
      maxFiles: maxNumberOfFiles,
      maxSize: 4194304,
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
    <div className="py-5 px-2" {...getRootProps({ style })}>
      <input {...getInputProps()} />
      <div className="d-flex ">
        <small className="text-center">
          Drag and drop file here.
          <a className="mb-3 text-blue" style={{ cursor: "pointer" }}>
            {" "}
            Browse files
          </a>
        </small>
      </div>
      <small className="text-center"> Only pdf, jpg, png files can be uploaded.</small>
    </div>
  );
}

export default AutoTableExtractorDropZone;
