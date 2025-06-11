import { useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { getDefaultAccess, getModelType } from "common_functions/functions";
import MultiSelectAll from "@components/select";
import SubService from "services/sub.service";

const subService = new SubService();

const UserModel = ({ models, show, setShow }) => {
  const options = () =>
    models.map((e) => {
      return {
        id: e.id,
        label: (
          <div className="w-100">
            <div className="w-100 flex-between flex-nowrap">
              <h6 className="text-truncate w-100 font-14 m-0">{e.name}</h6>
              <div className="font-10">{e.status}</div>
            </div>
            <p className="text-truncate w-100 font-12 m-0">{getModelType(e.model_type, true)}</p>
          </div>
        ),
        value: e.name,
      };
    });
  const [full_name, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("collaborator");
  const [selectedOptions, setSelectedOptions] = useState([
    { label: "All", value: "*" },
    ...options(),
  ]);

  const [access, setAccess] = useState(getDefaultAccess());

  const createUser = async () => {
    if (loading) return;
    try {
      if (email && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
        setLoading(true);
        const select = [];

        if (selectedOptions.length > 0 && selectedOptions[0].label === "All") select.push("All");
        else
          selectedOptions.map((e) => {
            if (e.id) select.push(e.id);
          });

        const r = await subService.collaboratorInvitation({
          email,
          full_name,
          role,
          models: [{ select, ...access }],
        });
        setShow(false);
        setLoading(false);
        toast.success(r);
      } else toast.error("Enter valid email");
    } catch (e) {
      setLoading(false);
      toast.error(e);
    }
  };

  return (
    <>
      <Modal
        show={show}
        className="delete-modal"
        onHide={() => setShow(false)}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header style={{ backgroundColor: "white" }}>
          <Modal.Title className="text-primary fw-bold font-inter">Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column pt-0 p-3 mx-2" style={{ gap: "0.5rem" }}>
          <Form.Group className="w-100">
            <Form.Label className="h6">Full Name</Form.Label>
            <Form.Control
              type="text"
              autoComplete="off"
              placeholder="Enter name"
              className="font-14"
              onChange={(e) => {
                setFullName(e.target.value);
              }}
              autoFocus
            />

            <Form.Label className="h6 mt-3">Email</Form.Label>
            <Form.Control
              type="text"
              autoComplete="off"
              placeholder="Enter email"
              className="font-14"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              autoFocus
            />
          </Form.Group>
          <div className="d-flex flex-wrap g-1 w-100">
            {["collaborator", "annotator"].map((ele: any, id: any) => (
              <label
                className="d-flex align-items-center cr-p"
                key={id}
                onClick={() => {
                  if (ele === "collaborator") setSelectedOptions([]);
                  else setAccess(getDefaultAccess());
                  setRole(ele);
                }}
              >
                <input
                  id={ele}
                  type="radio"
                  name="r"
                  className="form-check-input me-2 mt-0"
                  checked={ele === role}
                  readOnly
                />
                <p className="m-0">
                  {ele === "collaborator" ? "Collaborator" : "Annotation Expert"}
                </p>
              </label>
            ))}
          </div>
          <div>
            {role !== "collaborator" ? (
              <MultiSelectAll {...{ selectedOptions, setSelectedOptions }} options={options()} />
            ) : (
              <div className="my-2">
                {Object.keys(access).map((ele: any, id: any) => (
                  <div key={id} className="d-inline-flex w-50">
                    <label className="d-flex align-items-center cr-p">
                      <input
                        id="checkbox1"
                        type="checkbox"
                        className="cr-p m-0 me-2"
                        checked={access[ele]}
                        onChange={(e: any) => setAccess({ ...access, [ele]: e.target.checked })}
                      />
                      <p className="font-14 m-0">
                        {ele === "api"
                          ? "Generate APIKEY"
                          : ele === "create_model"
                          ? "Create Model"
                          : ele === "test_model"
                          ? "Test Model"
                          : "Delete Model"}
                      </p>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <button className="btn btn-primary px-4 mt-3 mb-2" onClick={createUser}>
              {loading && (
                <Spinner
                  animation="border"
                  className="me-2"
                  style={{ width: "1em", height: "1em" }}
                />
              )}
              Send Invite
            </button>
            <button className="btn btn-sm ms-3 border-0 mt-3 mb-2" onClick={() => setShow(false)}>
              Cancel
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserModel;
