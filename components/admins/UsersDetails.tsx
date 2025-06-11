// **************** Internal ************************

// React internal imports
import React, { FC, useState } from "react";

// Services import
import UserService from "services/user.service";

// ***************** external ************************

import DataTable from "react-data-table-component";
// React-bootstrap components import
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ShimmerThumbnail } from "react-shimmer-effects";
//Loader
import Loader from "react-loader-spinner";
// toasts
import { toast } from "react-toastify";
import Permissions from "@components/permissions/permissions";

//toast configuration
toast.configure();
const userService = new UserService();

//  Internally, customStyles will deep merges your customStyles with the default styling for data table.
const customStyles = {
  rows: {
    style: {
      minHeight: "40px",
      fontSize: 14,
      fontFamily: "Inter",
      fontStyle: "normal !important",
      borderBottom: "0px",
      cursor: "default !important",
    },
  },
  headCells: {
    style: {
      fontSize: "14px", // override the cell padding for head cells
      fontWeight: "bold",
      backgroundColor: "#F7FAFC",
      paddingLeft: "8px", // override the cell padding for head cells
      paddingRight: "8px",
      whiteSpace: "normal !important",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px", // override the cell padding for data cells
      paddingRight: "8px",
      paddingTop: "8px",
      paddingBottom: "8px",
      div: {
        display: "-webkit-box",
        "-webkit-line-clamp": "3",
        "-webkit-box-orient": "vertical",
      },
    },
  },
};

const UsersDetails: FC = () => {
  // Users api response is stored in this state
  const [reload, setReload] = useState([]);
  const [data, setData] = useState([]);
  const [admin, setAdmin] = useState(false);
  // State for loader display manipulation
  const [myModelsloading, setMyModelsLoading] = useState(false);

  React.useEffect(() => {
    setMyModelsLoading(true);
    // Get users on page load
    userService
      .getAllUserDetails()
      .then((res) => {
        // set response to data state
        setData(() => res);
        setMyModelsLoading(false);
      })
      .catch((err) => {});
    userService
      .isAdmin()
      .then((res) => {
        setAdmin(res);
      })
      .catch((err) => {});
  }, []);

  // Columns for data table are decided here

  const adminColumns: any = [
    {
      name: "Full name",
      sortable: true,
      wrap: true,
      center: false,
      cell: (row: any) => {
        return (
          <div className="d-flex">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-engine">{row["username"]}</Tooltip>}
            >
              <p className="mb-0" style={{ width: "150px" }}>
                {row["username"]}
              </p>
            </OverlayTrigger>
          </div>
        );
      },
    },

    {
      name: "Contact",
      sortable: true,
      wrap: true,
      center: false,
      cell: (row: any) => <>{row["contact_number"]}</>,
    },
    {
      name: "Email",
      sortable: true,
      wrap: true,
      center: false,
      cell: (row: any) => {
        return (
          <div className="d-flex">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-engine">{row.email}</Tooltip>}
            >
              <p className="mb-0" style={{ width: "150px" }}>
                {row["email"]}
              </p>
            </OverlayTrigger>
          </div>
        );
      },
    },
    {
      name: "Role",
      sortable: true,
      wrap: true,
      center: false,
      cell: (row: any) => {
        return (
          <div className="d-flex">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-engine">{row["role"]}</Tooltip>}
            >
              <p className="mb-0" style={{ width: "150px" }}>
                {row["role"]}
              </p>
            </OverlayTrigger>
          </div>
        );
      },
    },
    {
      name: "Signup time",
      sortable: true,
      wrap: true,
      center: false,
      cell: (row: any) => {
        return (
          <div className="d-flex">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-engine">{row["created"]}</Tooltip>}
            >
              <p className="mb-0" style={{ width: "150px" }}>
                {row["created"]}
              </p>
            </OverlayTrigger>
          </div>
        );
      },
    },

    {
      name: "Status",

      cell: (row: any) => (
        <>
          <button
            className={
              "btn text-center w-100 text-nowrap px-0 font-inter " +
              (row?.is_active ? "btn-outline-success" : "btn-outline-danger")
            }
            style={{
              fontSize: 13,
              borderRadius: "4px",
            }}
          >
            {row?.is_active ? "Active" : "Inactive"}
          </button>
        </>
      ),
    },
  ];

  const getColumns = () => {
    const columns: any = adminColumns;
    if (admin) {
      columns.push({
        name: "Actions",
        cell: (row: any) => {
          return <Permissions row={row} reload={reload} setReload={setReload} />;
        },
      });
    }
    return columns;
  };

  const loadColumns: any = [
    {
      name: <ShimmerThumbnail height={15} className="mb-0" rounded />,
      cell: () => <ShimmerThumbnail height={15} className="mb-0" rounded />,
      sortable: true,
      wrap: true,
      center: false,
    },

    {
      name: <ShimmerThumbnail height={15} className="mb-0" rounded />,
      cell: () => <ShimmerThumbnail height={15} className="mb-0" rounded />,
      sortable: true,
      wrap: true,
      center: false,
    },
    {
      name: <ShimmerThumbnail height={15} className="mb-0" rounded />,
      cell: () => <ShimmerThumbnail height={15} className="mb-0" rounded />,
      sortable: true,
      wrap: true,
      center: false,
    },
    {
      name: <ShimmerThumbnail height={15} className="mb-0" rounded />,
      cell: () => <ShimmerThumbnail height={15} className="mb-0" rounded />,
      sortable: true,
      wrap: true,
      center: false,
    },
    {
      name: <ShimmerThumbnail height={15} className="mb-0" rounded />,
      cell: () => <ShimmerThumbnail height={15} className="mb-0" rounded />,
      sortable: true,
      wrap: true,
      center: false,
    },
    {
      name: <ShimmerThumbnail height={15} className="mb-0" rounded />,
      cell: () => <ShimmerThumbnail height={15} className="mb-0" rounded />,
    },
    {
      name: <ShimmerThumbnail height={15} className="mb-0" rounded />,
      cell: () => <ShimmerThumbnail height={15} className="mb-0" rounded />,
    },
  ];

  // Html designed code goes here
  return (
    <>
      <div className="mainc container">
        {myModelsloading ? (
          <DataTable
            responsive
            customStyles={customStyles}
            className="table-height"
            data={[{ col: "1" }]}
            columns={loadColumns}
            pagination
            fixedHeader
            persistTableHead
            highlightOnHover
            pointerOnHover
          />
        ) : (
          <DataTable
            columns={getColumns()}
            data={data}
            pagination
            responsive
            fixedHeader={true}
            noHeader
            persistTableHead
            customStyles={customStyles}
          />
        )}
      </div>
    </>
  );
};
export default UsersDetails;
