import { colorShade } from "common_functions/functions";
import React, { useState, useEffect } from "react";
import { Rect, Transformer, Image, Text, Line } from "react-konva";

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange, deleteRectangle, cw, ch }) => {
  const shapeRef: any = React.useRef();
  const transformRef: any = React.useRef();
  const [inside, setInside] = useState(false);
  const tempRef: any = React.useRef();

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      transformRef.current.nodes([shapeRef.current]);
      transformRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const onMouseEnter = (event) => {
    setInside(true);
    clearTimeout(tempRef.current);
    tempRef.current = null;
    event.target.getStage().container().style.cursor = "move";
  };

  const onMouseLeave = (event) => {
    tempRef.current = setTimeout(() => {
      setInside(false);
    }, 500);
    event.target.getStage().container().style.cursor = "crosshair";
  };
  const imageObj = new window.Image();
  imageObj.src = "/images/delete-icon.svg";
  let imgX = shapeProps.width > 0 ? shapeProps.x - 1 : shapeProps.x + shapeProps.width - 1;
  let imgY = shapeProps.height > 0 ? shapeProps.y - 24 : shapeProps.y + shapeProps.height - 24;
  // if (imgY < 0) imgY += 25;
  const isOut = (tx, ty, tc, width, height) => {
    if (tx < 0) {
      tc = true;
      tx = 0;
    }
    if (tx > 0 && tx + width > cw) {
      tc = true;
      tx = cw - width;
    }
    if (ty < 0) {
      tc = true;
      ty = 0;
    }
    if (ty > 0 && ty + height > ch) {
      tc = true;
      ty = ch - height;
    }
    return { tx, ty, tc, pw: width > 0 ? width : -width, ph: height > 0 ? height : -height };
  };

  return (
    <React.Fragment>
      <Rect
        id={`${shapeProps.id}`}
        x={shapeProps.x}
        y={shapeProps.y}
        width={shapeProps.width}
        height={shapeProps.height}
        stroke={shapeProps.stroke}
        strokeWidth={2.8}
        name={`${shapeProps.id}`}
        fill={colorShade(shapeProps.stroke, 120)}
        // fill="transparent"
        onMouseDown={onSelect}
        ref={shapeRef}
        opacity={0.5}
        draggable
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        dragBoundFunc={(newAttrs) => {
          const { x, y, width, height } = shapeRef.current.attrs;
          let tempx = width > 0 ? x : x + width;
          let tempy = height > 0 ? y : y + height;
          let tempc = false;
          const { tx, ty, tc } = isOut(tempx, tempy, tempc, width, height);
          if (tc) return { x: tx, y: ty };
          return newAttrs;
        }}
        onDragEnd={(event) => {
          const x = event.target.x();
          const y = event.target.y();
          const { width, height } = shapeRef.current.attrs;
          let tempx = width > 0 ? x : x + width;
          let tempy = height > 0 ? y : y + height;
          let tempc = false;

          const { tx, ty, pw, ph } = isOut(tempx, tempy, tempc, width, height);
          onChange({ id: shapeProps.id, bbox: [tx, ty, pw, ph] });
        }}
        onTransformEnd={(event) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          const x = node.x();
          const y = node.y();
          const width = Math.max(node.width() * scaleX);
          const height = Math.max(node.height() * scaleY);
          let tempx = width > 0 ? x : x + width;
          let tempy = height > 0 ? y : y + height;
          let tempc = false;
          const { tx, ty, pw, ph } = isOut(tempx, tempy, tempc, width, height);
          const x1 = tx > 0 ? tx : 0;
          const y1 = ty > 0 ? ty : 0;
          const w = pw > cw - x1 ? cw - x1 : Math.max(node.width() * scaleX);
          const h = ph > ch - y1 ? ch - y1 : Math.max(node.height() * scaleY);
          onChange({ id: shapeProps.id, bbox: [x1, y1, w, h] });
        }}
      />

      {inside && (
        <>
          <Rect
            x={imgX + 1}
            y={imgY + 24}
            width={Math.min(
              shapeProps.label.length * 7 + 30,
              shapeProps.width > 0 ? shapeProps.width + 1 : shapeProps.width * -1 + 1
            )}
            onMouseEnter={() => {
              setInside(true);
              clearTimeout(tempRef.current);
              tempRef.current = null;
            }}
            onMouseLeave={() => {
              tempRef.current = setTimeout(() => {
                setInside(false);
              }, 500);
            }}
            height={18}
            stroke={shapeProps.stroke}
            strokeWidth={2}
            name={`${shapeProps.id}`}
            fill="white"
          />
          <Text
            x={imgX + 20}
            y={imgY + 24}
            fontSize={12}
            text={shapeProps.label}
            onMouseEnter={() => {
              setInside(true);
              clearTimeout(tempRef.current);
              tempRef.current = null;
            }}
            onMouseLeave={() => {
              tempRef.current = setTimeout(() => {
                setInside(false);
              }, 500);
            }}
            stroke="black"
            fill="black"
            strokeWidth={0.25}
            align="start"
            padding={5}
            lineHeight={0.7}
            ellipsis
            wrap="none"
            width={Math.min(
              shapeProps.label.length * 11 + 20,
              shapeProps.width > 0 ? shapeProps.width : shapeProps.width * -1
            )}
          />

          <Image
            onClick={() => deleteRectangle(shapeProps.id)}
            width={12}
            height={12}
            x={imgX + 4}
            y={imgY + 26}
            image={imageObj}
            onMouseOver={(e) => {
              setInside(true);
              clearTimeout(tempRef.current);
              tempRef.current = null;
              e.target.getStage().container().style.cursor = "pointer";
              e.target.scale({ x: 1.2, y: 1.2 });
            }}
            onMouseOut={(e) => {
              e.target.scale({ x: 1, y: 1 });
              tempRef.current = setTimeout(() => {
                setInside(false);
              }, 500);
            }}
          />
        </>
      )}

      {isSelected && <Transformer ref={transformRef} />}
    </React.Fragment>
  );
};

export default Rectangle;
