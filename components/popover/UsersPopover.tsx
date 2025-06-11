import UpdateUserModal from "@components/modals/UpdateUser";
import { useState } from "react";
import { ListGroup, OverlayTrigger, Popover } from "react-bootstrap";

const UsersPopover = ({ models, row, setShowModal, mutate }) => {
  const [show, setShow] = useState(false);

  const popover = (
    <Popover id="popover-basic">
      <ListGroup className="border-0">
        {["Update User", "Delete"].map((ele: any, id: any) => (
          <ListGroup.Item
            className="d-flex flex-row align-items-center cursor-pointer"
            onClick={() => {
              document.body.click();
              if (ele === "Update User") setShow(true);
              else if (ele === "Delete") setShowModal(row.id);
            }}
            key={id}
          >
            <img
              src={`/admin-images/${ele.split(" ")[0].toLowerCase()}.svg`}
              alt={ele}
              width={18}
              height={18}
            />
            <p className="ps-2 mb-0">{`${ele} `}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Popover>
  );

  return (
    <>
      <OverlayTrigger rootClose trigger="click" placement="auto" overlay={popover} transition>
        <img src="images/ellipsis-icon.svg" alt="action" className="cr-p" />
      </OverlayTrigger>
      {show && <UpdateUserModal {...{ models, row, show, setShow, mutate }} />}
    </>
  );
};

export default UsersPopover;
