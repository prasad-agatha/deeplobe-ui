import React from "react";

const Progressbar_new = ({ bgcolor, progress, height }) => {
  const Parentdiv = {
    height: height,
    width: "100%",
    backgroundColor: "#D9D9D9",
    borderRadius: 40,
    // margin: 50,
  };



  const progresstext = {
    padding: 10,
    color: "black",
    fontWeight: 900,
  };

  return (
    <div style={Parentdiv}>
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          backgroundColor: bgcolor,
          borderRadius: 40,
          textAlign: "right",
        }}
      >
        <span style={progresstext}></span>
      </div>
    </div>
  );
};

export default Progressbar_new;
