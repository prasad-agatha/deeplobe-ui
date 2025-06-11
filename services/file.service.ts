import React from "react";
import axios, { AxiosPromise } from "axios";

class FileService {
  async getImageBlob(url: string) {
    return await fetch(url).then((r) => r.blob());
  }
}

export default FileService;
