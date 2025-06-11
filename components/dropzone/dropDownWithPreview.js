import React, { useCallback, useMemo } from "react";
import _ from "lodash";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
//toast configuration
toast.configure();

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "25px",
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

function PreviewDropzone({
  item,
  classId,
  classes,
  setClasses,
  maxNumberOfImages,
  acceptedFileExtention,
}) {
  const onDrop = (acceptedFiles, fileRejections) => {
    const allClasses = classes;
    const selectedTag = _.find(allClasses, (tag) => {
      return tag.id === classId;
    });
    if (classId === "llm") {
      if (fileRejections.length > 0) {
        if (fileRejections.length > maxNumberOfImages) {
          toast.error(`Please upload max of ${maxNumberOfImages} files`);
        } else toast.error("Only .pdf or .txt files with max size of 5MB");
      } else {
        let both = [...item, ...acceptedFiles];
        setClasses(both);

        Array.from(acceptedFiles).map(
          (file) => URL.revokeObjectURL(file) // avoid memory leak
        );
      }
    } else if (acceptedFiles[0]?.type === "application/json") {
      let jsonFile = [];
      for (let [index, img] of acceptedFiles.entries()) {
        jsonFile.push({
          id: index,
          selected: false,
          clickCounter: 0,
          blobFile: URL.createObjectURL(img),
          img,
        });
      }
      selectedTag.selectedJsonFile = jsonFile;
      const index = _.findIndex(allClasses, { id: classId });
      allClasses.splice(index, 1, selectedTag);
      setClasses([...allClasses]);
      Array.from(acceptedFiles).map(
        (file) => URL.revokeObjectURL(file) // avoid memory leak
      );
    } else {
      if (fileRejections.length > 0) {
        if (fileRejections.length > maxNumberOfImages) {
          toast.error(
            `Please upload max of ${maxNumberOfImages} ${
              acceptedFileExtention === ".json" ? "json" : "image"
            }${maxNumberOfImages > 1 ? "s" : ""}`
          );
        } else
          toast.error(
            acceptedFileExtention === ".json"
              ? "Only .json file with max size of 1MB"
              : "Only .jpeg, .jpg and .png files with max size of 1MB"
          );
      } else {
        // let imgs = [...classes[0].selectedImages];
        let imgs = [...item.selectedImages];

        for (let [index, img] of acceptedFiles.entries()) {
          imgs.push({
            id: uuidv4(),
            // id:index,
            selected: false,
            clickCounter: 0,
            blobFile: URL.createObjectURL(img),
            img,
          });
        }

        selectedTag.selectedImages = _.uniqBy(imgs, function (e) {
          return e.img.name;
        });

        const index = _.findIndex(allClasses, { id: classId });
        allClasses.splice(index, 1, selectedTag);
        setClasses([...allClasses]);
        Array.from(acceptedFiles).map(
          (file) => URL.revokeObjectURL(file) // avoid memory leak
        );
      }
    }
    // selectedTag.selectedImages = acceptedFiles;
  };
  const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
    onDrop,
    accept: acceptedFileExtention,
    maxFiles: maxNumberOfImages,
    maxSize: 5242880, // 5MB in bytes
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
    <div className="" {...getRootProps({ style })}>
      <input {...getInputProps()} />
      <div className="d-flex">
        <small className="text-center mx-2">
          Drag and drop file here.
          <a className="mb-3 text-blue" style={{ cursor: "pointer" }}>
            {" "}
            Browse files
          </a>
        </small>
      </div>
      {classId === "llm" ? (
        <small className="text-center">Only .pdf, .txt files with max size of 5MB</small>
      ) : acceptedFileExtention === ".json" ? (
        <small className="text-center">Only .json file with max size of 5MB </small>
      ) : (
        <small className="text-center">Only .jpeg, .jpg and .png files with max size of 5MB</small>
      )}
    </div>
  );
}

export default PreviewDropzone;
