import { ShimmerThumbnail } from "react-shimmer-effects";
import AnnotationNav from "@components/navigation/AnnotationNav";

const Shimmer = ({ user, router }) => {
  const details = { load: true, model_name: "", annotated_count: 0, status: "Draft" };
  const changeImage = (path: any) => router.replace(path);
  return (
    <div className="mainc container-fluid" id="top">
      <div className="border border-light rounded bg-white mb-5 p-4">
        <AnnotationNav {...{ user, router, changeImage, details }} />
        <hr id="divider" style={{ marginTop: "6px", marginBottom: "6px" }} />
        <div className="d-flex flex-wrap g-1 w-100 my-3 shm-div">
          <ShimmerThumbnail className="m-0" height={24} width={150} />
          <ShimmerThumbnail className="m-0" height={24} width={150} />
        </div>
        <div className="block-background p-4">
          <div className="dropz">
            <div className="w-50">
              <ShimmerThumbnail className="m-0" height={18} />
            </div>
            <div className="w-75">
              <ShimmerThumbnail className="m-0" height={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shimmer;
