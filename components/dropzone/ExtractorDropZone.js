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
  // padding: "50px",
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

function ExtractorDropzone({ setItem, maxNumberOfFiles, acceptedFileExtention }) {
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      if (fileRejections.length > maxNumberOfFiles) toast.error(`Please upload valid file`);
      else toast.error("Only pdf,txt files can be uploaded.");
    } else {
      let reader = new FileReader();
      if (acceptedFiles[0].type === "application/pdf") {
        reader.readAsDataURL(acceptedFiles[0]);
        reader.onloadend = () => {
          let base64String = reader.result;
          setItem({
            type: acceptedFiles[0].type,
            url: base64String.substr(base64String.indexOf(",") + 1),
            item: acceptedFiles[0],
          });
        };
      } else {
        reader.readAsText(acceptedFiles[0]);
        reader.onload = (e) => {
          const file = e.target.result;
          setItem({
            type: acceptedFiles[0].type,
            url: file,
            item: acceptedFiles[0],
          });
        };
      }
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept, fileRejections } =
    useDropzone({
      onDrop,
      accept: acceptedFileExtention,
      maxFiles: maxNumberOfFiles,
      maxSize: 1048576,
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
      <div className="d-flex">
        <small className="text-center font-inter">
          Drag and drop file here.
          <a className="mb-3 font-inter text-blue" style={{ cursor: "pointer" }}>
            {" "}
            Browse files
          </a>
        </small>
      </div>
      <small className="text-center"> Only pdf,txt files can be uploaded.</small>
    </div>
  );
}

export default ExtractorDropzone;
