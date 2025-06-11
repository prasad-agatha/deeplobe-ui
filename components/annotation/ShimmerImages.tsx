import { ShimmerThumbnail } from "react-shimmer-effects";

const ShimmerImages = () => {
  return (
    <div style={{ width: "100px", minWidth: "100px" }}>
      <div className="overflow-auto ann-hght w-100 pt-3">
        {[...Array(10)].map((item: any, index: any) => (
          <div key={index} className="mb-3 d-flex justify-content-center">
            <div
              className={`${index === 0 ? "selected" : "not-selected"} rounded text-center cr-p`}
              style={{ width: "80px", backgroundColor: "#E0E0E0" }}
            >
              <div className="p-1 pb-0 shm-img">
                <ShimmerThumbnail className="m-0 stm" height={60} />
              </div>
              <div className="px-1 rounded-bottom">
                <ShimmerThumbnail className="m-0 stm" height={10} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShimmerImages;
