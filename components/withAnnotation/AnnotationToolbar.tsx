import React from "react";
import { OverlayTrigger, Image, Tooltip } from "react-bootstrap";
import _ from "lodash";

class ToolBar extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      zoomCounter: 0,
      asPath: "",
    };
  }
  componentDidMount(): void {
    this.setState({ zoomCounter: 0, asPath: this.props.router.asPath });
  }

  componentDidUpdate() {
    if (this.props.router.asPath !== this.state.asPath) {
      if (this.props.stageRef !== null) {
        this.props.stageRef.scale({ x: 1, y: 1 });
        this.props.stageRef.position({ x: 0, y: 0 });
        this.props.stageRef.batchDraw();
      }
    }
  }

  zoomCounter = (index) => {
    let zoomValue = index === 2 ? this.state.zoomCounter + 1 : this.state.zoomCounter - 1;
    this.setState({ zoomCounter: zoomValue });
  };
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  render() {
    const { previous, next, polygonTool, undo, redo, zoomStage, stageRef, disU, disR } = this.props;

    return (
      <div className="rounded options-box ann-hght p-2 me-2">
        <OverlayTrigger overlay={<Tooltip id="tooltip-engine">Previous</Tooltip>}>
          <Image
            onClick={previous}
            width={35}
            height={35}
            className="cr-p"
            src={"/leftArrow.svg"}
          />
        </OverlayTrigger>
        <OverlayTrigger
          overlay={
            <Tooltip id="tooltip-engine">{polygonTool ? "Polyon Tool" : "Bounding Box"}</Tooltip>
          }
        >
          <Image
            width={35}
            height={35}
            className="cr-p"
            src={polygonTool ? "/pen-tool.svg" : "/rectangleSelected.svg"}
          />
        </OverlayTrigger>
        <div className="d-flex flex-column">
          {disU() ? (
            <Image width={28} height={28} src={"/undo-disabled.svg"} />
          ) : (
            <OverlayTrigger overlay={<Tooltip id="tooltip-engine">Undo</Tooltip>}>
              <Image onClick={undo} width={28} height={28} className="cr-p" src={"/undo.svg"} />
            </OverlayTrigger>
          )}
          {disR() ? (
            <Image width={28} height={28} src={"/redo-disabled.svg"} />
          ) : (
            <OverlayTrigger overlay={<Tooltip id="tooltip-engine">Redo</Tooltip>}>
              <Image onClick={redo} width={28} height={28} className="cr-p" src={"/redo.svg"} />
            </OverlayTrigger>
          )}
        </div>

        <div className="d-flex flex-column">
          <OverlayTrigger overlay={<Tooltip id="tooltip-engine">Zoom out</Tooltip>}>
            <Image
              onClick={(e) => {
                if (stageRef && stageRef.scaleX() <= 0.1) {
                } else {
                  zoomStage(e, 2);
                  this.zoomCounter(2);
                }
              }}
              width={20}
              height={20}
              className="cr-p mx-auto"
              src={"/zoom-out.svg"}
            />
          </OverlayTrigger>
          <span className="font-12 text-muted my-2">
            {Math.round(stageRef?.scaleX() * 100) + "%"}
          </span>
          <OverlayTrigger overlay={<Tooltip id="tooltip-engine">Zoom in</Tooltip>}>
            <Image
              onClick={(e) => {
                zoomStage(e, 3);
                this.zoomCounter(3);
              }}
              width={20}
              height={20}
              className="cr-p mx-auto"
              src={"/zoom-in.svg"}
            />
          </OverlayTrigger>
        </div>

        <OverlayTrigger overlay={<Tooltip id="tooltip-engine">Next</Tooltip>}>
          <Image onClick={next} width={35} height={35} className="cr-p" src={"/rightArrow.svg"} />
        </OverlayTrigger>
      </div>
    );
  }
}
export default ToolBar;
