import React from "react";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";

let interval;
function Loader(props) {
  const [state, setState] = React.useState(0);

  return (
    <>
      <div>
        <div
          className="container d-flex justify-content-center progressBar"
          style={{ height: "200px" }}
        >
          <CircularProgressbar
            value={props.valuesIndex}
            text={`${props.valuesIndex}%`}
            styles={buildStyles({
              // Text size
              textSize: "22px",
              // Colors
              pathColor: `rgba(97, 82, 217, 1)`,
              textColor: "#6152D9",
              trailColor: "#d6d6d6",
              backgroundColor: "#6152d9",
            })}
          />
        </div>
      </div>
    </>
  );
}
export default Loader;
