import { useEffect, useState } from "react";
import Head from "next/head";
import DataTable from "react-data-table-component";
import useSWR from "swr";
import { Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { ShimmerThumbnail } from "react-shimmer-effects";
import UserModel from "@components/page_elements/UserModel";
import TooltipButton from "components/buttons/tooltip";
import SubService from "services/sub.service";
import ModelService from "services/model.service";
import UsersPopover from "@components/popover/UsersPopover";
import { getLabelName } from "common_functions/functions";

const modelService = new ModelService();
const subService = new SubService();

const Users = ({ workspace, user }) => {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState("");
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data, mutate } = useSWR(`/workspace/users/`, async () => {
    const res = await subService.users();
    return res;
  });
  useEffect(() => {
    const details = async () => {
      const r = await modelService.getallModels("&personal=true&exclude=true");
      setModels(r);
    };
    details();
  }, []);

  const customStyles = {
    rows: {
      style: {
        fontSize: "14px", // override the row height
      },
    },
    headCells: {
      style: {
        fontSize: "14px", // override the cell padding for head cells
        fontWeight: "bold",
        backgroundColor: "#F7FAFC",
      },
    },
    cells: {
      style: {
        padding: "4px 8px",
        alignSelf: "center",
        overflow: "hidden",
        div: { overflow: "hidden" },
      },
    },
  };

  const addUserButton = () => (
    <div>
      {workspace?.plan === process.env.NEXT_PUBLIC_FREE_PLAN ? (
        <TooltipButton {...{ workspace }} />
      ) : (
        <button type="submit" className="btn btn-primary px-4" onClick={() => setShow(true)}>
          Add User
        </button>
      )}
    </div>
  );

  const columns = [
    {
      name: "Name",
      cell: (row: any) => row.name,
      grow: 2,
    },
    {
      name: "Email",
      selector: (row: any) => row.email,
      sortable: true,
      grow: 2,
    },
    {
      name: "Role",
      cell: (row: any) => <>{getLabelName(row.role)}</>,
    },
    // {
    //   name: "Status",
    //   cell: (row: any) => (
    //     <>
    //       <button
    //         className={
    //           "btn text-center w-100 text-nowrap px-0 font-inter " +
    //           (row?.is_active ? "btn-outline-success" : "btn-outline-danger")
    //         }
    //         style={{
    //           fontSize: 13,
    //           borderRadius: "4px",
    //         }}
    //       >
    //         {row?.is_active ? "Active" : "Inactive"}
    //       </button>
    //     </>
    //   ),
    // },
    {
      name: "Actions",
      cell: (row: any) => {
        return (
          <div className="text-center">
            {row.id !== user.id && <UsersPopover {...{ models, row, setShowModal, mutate }} />}
          </div>
        );
      },
      minWidth: "75px",
      center: true,
    },
  ];

  const customColumns = () => {
    return columns.map((ele: any) => {
      return {
        ...ele,
        cell: () => (
          <div className="w-100">
            <ShimmerThumbnail
              height={15}
              className={"mb-0" + (ele.name === "Actions" ? " stm" : "")}
              rounded
            />
          </div>
        ),
      };
    });
  };
  if (!data || !user)
    return (
      <div className="card-table p-4 rounded">
        <div className="flex-between g-1 pb-3 ">
          <div>
            <ShimmerThumbnail height={30} width={150} className="mb-0" rounded />
            <ShimmerThumbnail height={15} width={300} className="mb-0" rounded />
          </div>
          <ShimmerThumbnail height={40} width={100} className="mb-0" rounded />
        </div>

        <div className="flex-grow-1 border-0  mb-4 ">
          <DataTable
            responsive
            customStyles={customStyles}
            className="table-height"
            data={[{ col: 1 }, { col: 1 }, { col: 1 }, { col: 1 }, { col: 1 }]}
            columns={customColumns()}
            pagination
            fixedHeader
            persistTableHead
            highlightOnHover
            pointerOnHover
          />
        </div>
      </div>
    );

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>

      <div className="card-table p-4">
        <div className="flex-between g-1 pb-3 ">
          <div>
            <h4 className="font-weight-600 txt-header font-22 mb-3">Users</h4>
            <p className="m-0 txt-lgray font-14">People who has access the workspace</p>
          </div>
          <div>{addUserButton()}</div>
        </div>

        <div className="flex-grow-1 border-0  mb-4 ">
          <DataTable
            responsive
            customStyles={customStyles}
            className="table-height"
            data={
              data ? [data?.owner, ...(data.collaborators || []), ...(data.annotators || [])] : []
            }
            columns={[...columns]}
            pagination
            fixedHeader
            persistTableHead
            highlightOnHover
            pointerOnHover
          />
        </div>
      </div>
      {show && <UserModel {...{ models, show, setShow }} />}

      <Modal
        keyboard={false}
        show={showModal ? true : false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header style={{ backgroundColor: "white" }}>
          <Modal.Title className="ps-0 text-primary fw-bold font-inter">Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0 mx-1">
          <p className="font-16 font-inter mb-3">Are you sure you want to delete this user?</p>
          <div className="d-flex mt-4">
            <button
              className="btn btn-primary btn-sm font-inter"
              onClick={async () => {
                if (loading) return;
                try {
                  setLoading(true);
                  await subService.removeCollaborator(showModal);
                  setShowModal("");
                  setLoading(false);
                  mutate();
                } catch (e) {
                  setLoading(false);
                  toast.error(e);
                }
              }}
            >
              {loading && (
                <Spinner
                  animation="border"
                  className="me-2"
                  style={{ width: "1em", height: "1em" }}
                />
              )}
              Delete
            </button>
            <button
              className="btn border-0 btn-sm ms-3 font-inter"
              onClick={() => setShowModal("")}
            >
              Cancel
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Users;
