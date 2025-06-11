// react
import React from "react";
import { copyToClipBoard } from "common_functions/functions";

const clipBoard = () => {
  return (
    <div className="d-flex clip-board w-50 p-2">
      <p className="">Sample-Key </p>
      <img
        src="/images/copy-icon.svg"
        alt="copy-icon"
        className="ms-auto"
        onClick={() => copyToClipBoard("some text to copy")}
      />
    </div>
  );
};
export default clipBoard;
