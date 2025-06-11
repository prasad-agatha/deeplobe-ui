import React from "react";
import { Stage, Layer, Rect, Line, Text, Group, Image } from "react-konva";
import { AppProps } from "next/app";
import _ from "lodash";
import ImageView from "@components/withAnnotation/ImageView";
import { colorShade } from "common_functions/functions";

class PolygonKonva extends React.Component<any, any> {
  img: any;
  constructor(props: AppProps) {
    super(props);
  }

  componentDidMount() {
    this.img.moveToBottom();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  render() {
    const { dms, details, curMousePos, labels, stageRef, handleMouseDown, handleMouseMove } =
      this.props;
    const { handleMouseOutStartPoint, handleMouseOverStartPoint, handleMouseEnter } = this.props;
    const { inside, onMouseOver, onMouseOut } = this.props;
    const { url, annotations } = details;
    const { width, height } = dms;
    const imageObj = new window.Image();
    imageObj.src = "/images/delete-icon.svg";
    // console.log(curMousePos, "ANNNN");
    return (
      <Stage
        ref={(node) => stageRef(node)}
        width={width}
        height={height}
        onMouseEnter={handleMouseEnter}
        onMouseDown={(e) => handleMouseDown(e)}
        onMouseMove={(e) => handleMouseMove(e)}
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
          {annotations.map((item: any, i) => {
            const { category_id, isFinished, segmentation } = item;
            const label =
              category_id === -1
                ? { name: "", color: "#05fd65", id: -1, count: 0 }
                : _.find(labels, (lb) => lb.id === category_id);
            const flattenedPoints = segmentation
              .concat(isFinished ? [] : curMousePos)
              .reduce((a, b) => a.concat(b), []);
            const xLabel = segmentation[0][0] - 6 / 2;
            const yLabel = segmentation[0][1] - 6 / 2;
            if (!label || !labels || !Array.isArray(labels) || !details?.id) return <></>;
            return (
              <Group name={item.id} key={i}>
                <Line
                  points={flattenedPoints}
                  stroke={label?.color}
                  strokeWidth={3}
                  closed={isFinished}
                  fill={colorShade(label?.color, 120)}
                  opacity={0.5}
                  onMouseOver={() => onMouseOver(i)}
                  onMouseOut={onMouseOut}
                />

                {segmentation.map((point, index) => {
                  const width = 6;
                  const x = point[0] - width / 2;
                  const y = point[1] - width / 2;
                  const startPointAttr =
                    index === 0
                      ? {
                          hitStrokeWidth: 12,
                          onMouseOver: (e) => handleMouseOverStartPoint(e, item),
                          onMouseOut: handleMouseOutStartPoint,
                        }
                      : null;
                  return (
                    <Rect
                      key={index}
                      x={x}
                      y={y}
                      width={width}
                      height={width}
                      fill="white"
                      stroke={label?.color}
                      strokeWidth={3}
                      name={item.id}
                      {...startPointAttr}
                    />
                  );
                })}
                {isFinished && inside === i && (
                  <>
                    <Rect
                      x={xLabel < 20 ? xLabel + 5 : xLabel - 10}
                      y={yLabel < 35 ? yLabel + 5 : yLabel - 15}
                      width={Math.min(label?.name.length * 7 + 30, 70)}
                      height={18}
                      stroke={label?.color}
                      strokeWidth={2}
                      name={`rect`}
                      fill="white"
                      onMouseOver={() => onMouseOver(i)}
                      onMouseOut={onMouseOut}
                    />
                    <Text
                      x={xLabel < 20 ? xLabel + 15 : xLabel}
                      y={yLabel < 35 ? yLabel + 5 : yLabel - 15}
                      fontSize={12}
                      stroke="black"
                      fill="black"
                      strokeWidth={0.25}
                      align="start"
                      lineHeight={0.7}
                      padding={5}
                      ellipsis
                      wrap="none"
                      text={label?.name}
                      width={Math.min(label?.name?.length * 11 + 20, 60)}
                      onMouseOver={() => onMouseOver(i)}
                      onMouseOut={onMouseOut}
                    />

                    <Image
                      width={12}
                      height={12}
                      x={xLabel < 20 ? xLabel + 8 : xLabel - 7}
                      y={yLabel < 35 ? yLabel + 8 : yLabel - 12}
                      image={imageObj}
                      name="delete"
                      id={item.id}
                      onMouseOver={(e) => {
                        onMouseOver(i);
                        e.target.getStage().container().style.cursor = "pointer";
                        e.target.scale({ x: 1.1, y: 1.1 });
                      }}
                      onMouseOut={(e) => {
                        onMouseOut();
                        e.target.scale({ x: 1, y: 1 });
                      }}
                    />
                  </>
                )}
              </Group>
            );
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

export default PolygonKonva;
