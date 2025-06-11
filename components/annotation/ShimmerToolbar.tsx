import React from "react";
import { Image } from "react-bootstrap";

class ShimmerToolBar extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  render() {
    const { polygonTool } = this.props;

    return (
      <div className="rounded options-box ann-hght p-2 me-2">
        <Image width={35} height={35} src={"/leftArrow-disabled.svg"} />

        <Image
          width={35}
          height={35}
          src={polygonTool ? "/pen-tool.svg" : "/rectangleSelected.svg"}
        />
        <div className="d-flex flex-column">
          <Image width={28} height={28} src={"/undo-disabled.svg"} />
          <Image width={28} height={28} src={"/redo-disabled.svg"} />
        </div>

        <div className="d-flex flex-column">
          <Image width={20} height={20} className="mx-auto" src={"/zoom-out.svg"} />
          <span className="font-12 text-muted">{100 + "%"}</span>
          <Image width={20} height={20} className="mx-auto" src={"/zoom-in.svg"} />
        </div>

        <Image width={35} height={35} src={"/rightArrow-disabled.svg"} />
      </div>
    );
  }
}
export default ShimmerToolBar;
