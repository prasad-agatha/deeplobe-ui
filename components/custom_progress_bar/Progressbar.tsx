import React from "react";

const Progressbar = ({ bgcolor, progress, height }) => {
  const Parentdiv = {
    height: height,
    maxWidth: "380px",
    width: "100%",
    backgroundColor: "whitesmoke",
    borderRadius: 40,
    // margin: 50,
  };

  const Childdiv = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: bgcolor,
    borderRadius: 40,
    textAlign: "right",
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

export default Progressbar;
