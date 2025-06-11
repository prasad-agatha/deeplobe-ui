import { Modal } from "react-bootstrap";

const BestPracticesModal = ({ setShow, show }) => {
  return (
    <Modal
      show={show === "bestPractices"}
      className="delete-modal"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header style={{ backgroundColor: "white", color: "black" }}>
        <p className="font-16 font-weight-500 font-inter my-0">BEST PRACTICES FOR TRAINING DATA</p>{" "}
        <div className="d-flex flex-row" style={{ justifyContent: "space-between" }}>
          <img
            src="/close.svg"
            alt="/close.svg"
            className="align-self-end cursor-pointer"
            height={18}
            width={18}
            onClick={() => setShow("")}
          />
        </div>
      </Modal.Header>
      <Modal.Body className="mx-2">
        {[
          {
            text: "Image formats that are supported to train your model are PNG, JPGE",
          },
          {
            text: "The training data should be as close as possible to the data on which predictions are to be made.",
          },
          {
            text: "We recommend using a minimum of 50 images to maximum of 10,000 images to train the model.",
          },
          {
            text: "More the dataset is, the better will be the accuracy.",
          },
          {
            text: "Minimum images per label is 20.",
          },
          {
            text: "Maximum training image file size (MB): 5 mb.",
          },
          {
            text: "Best suggested image size (pixel): 1024 px X 1024 px. ",
          },
          {
            text: "Larger images will be normalised to standard size in the preprocessing step.",
          },
        ].map((e: any, id: any) => (
          <div className="d-flex" style={{ alignItems: "flex-start" }} key={id}>
            <img src="/note.svg" alt="note" className="me-2" />
            <p className="font-12 font-inter font-weight-400"> {e.text}</p>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
};
export default BestPracticesModal;
