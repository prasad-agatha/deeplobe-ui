import React from "react";
import { AppProps } from "next/app";
import { Stage, Layer, Image, Rect, Line } from "react-konva";
import _ from "lodash";

import ImageView from "@components/withAnnotation/ImageView";
import Rectangle from "components/withAnnotation/Rectangle";

class RectangleKonva extends React.Component<any, any> {
  img: any;
  constructor(props: AppProps) {
    super(props);
  }

  componentDidMount() {
    this.img.moveToBottom();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  render() {
    // console.log(this.props);
    const {
      dms,
      details,
      curMousePos,
      stageRef,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      labels,
    } = this.props;
    const { url, annotations, newAnnotation, selectedShape } = details;
    const { width, height } = dms;
    const ann = newAnnotation ? [...annotations, newAnnotation] : annotations;
    const imageObj = new window.Image();
    imageObj.src = "/images/delete-icon.svg";
    return (
      <Stage
        ref={(node) => stageRef(node)}
        width={width}
        height={height}
        onMouseDown={(e) => handleMouseDown(e)}
        onMouseMove={(e) => handleMouseMove(e)}
        onMouseUp={(e) => handleMouseUp(e)}
        onMouseLeave={(e) => handleMouseUp(e)}
      >
        <Layer>
          <Line
            stroke={"black"}
            points={[0, -window.innerHeight, 0, window.innerHeight]}
            tension={1}
            strokeWidth={0.5}
            dash={[5, 5]}
            x={curMousePos ? curMousePos[0] : null}
            y={curMousePos ? curMousePos[1] : null}
          />
          <Line
            stroke={"black"}
            points={[-window.innerWidth, 0, window.innerWidth, 0]}
            tension={1}
            strokeWidth={0.5}
            dash={[5, 5]}
            x={curMousePos ? curMousePos[0] : null}
            y={curMousePos ? curMousePos[1] : null}
          />
          {[...ann].map((annotation, i) => {
            const { bbox, id, category_id } = annotation;
            const label =
              category_id === -1
                ? { name: "", color: "#05fd65", id: -1, count: 0 }
                : _.find(labels, (lb) => lb.id === category_id);
            if (!label || !labels || !Array.isArray(labels) || !details?.id) return <></>;
            const shapeProps = {
              x: bbox[0],
              y: bbox[1],
              width: bbox[2],
              height: bbox[3],
              label: label.name,
              stroke: label.color,
              id,
            };
            if (bbox[2] || bbox[3]) {
              return (
                <Rectangle
                  key={i}
                  shapeProps={shapeProps}
                  isSelected={id === selectedShape}
                  onSelect={() => this.props.setDetails({ selectedShape: annotation.id })}
                  deleteRectangle={this.props.deleteAnnotation}
                  onChange={(newAttrs) => this.props.updateAnnotation(newAttrs, i)}
                  cw={width}
                  ch={height}
                />
              );
            }
          })}
        </Layer>

        <Layer ref={(node) => (this.img = node)}>
          <ImageView
            url={url}
            setDms={this.props.setDms}
            setDetails={(data: any) => this.props.setDetails({ ...data })}
          />
        </Layer>
      </Stage>
    );
  }
}

export default RectangleKonva;
