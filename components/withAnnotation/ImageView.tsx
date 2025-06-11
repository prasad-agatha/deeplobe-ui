import React from "react";
import { Image } from "react-konva";

const ImageView = ({ url, setDms, setDetails }: any) => {
  const [image, setImage] = React.useState(null);

  React.useEffect(() => {
    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      setDms({ width: img.width, height: img.height });
      setImage(img);
    };
  }, [url]);

  return (
    <Image
      image={image}
      onMouseEnter={(event) => {
        event.target.getStage().container().style.cursor = "crosshair";
      }}
      onMouseLeave={(event) => {
        event.target.getStage().container().style.cursor = "default";
      }}
      onMouseDown={() => setDetails({ selectedShape: null })}
    />
  );
};

export default ImageView;
