import React from "react";

import FileService from "services/file.service";

const fileService = new FileService();

export default function FileView() {
  return (
    <>
      <div
        onClick={async () => {
          const res = await fileService.getImageBlob(
            "https://deeplobe.s3.ap-south-1.amazonaws.com/static-files/demographic-recognition/demographic-recognition-1-or.jpg"
          );
        }}
      >
        click
      </div>
    </>
  );
}
