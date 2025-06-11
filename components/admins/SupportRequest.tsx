// React internal imports
import React, { FC, useState } from "react";
import Router from "next/router";

// Components

import DataTable from "react-data-table-component";
import { ShimmerThumbnail } from "react-shimmer-effects";
import { SUPPORTDETAILS } from "@constants/common";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SupportRequestPopover from "@components/popover/SupportRequestPopover";

import SupportService from "services/support.services";
import useSWR from "swr";

const supportService = new SupportService();
//  Internally, customStyles will deep merges your customStyles with the default styling.
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

const SupportRequest: FC = () => {
  const { data, mutate } = useSWR(`support/`, async () => {
    const res = await supportService.SupportRequestList();
    return res;
  });

  function getCssClass(value) {
    if (["new"].includes(value)) return "status-new";
    else if (["open", "active", "resolved"].includes(value)) return "status-open";
    else if (["contacted"].includes(value)) return "status-closed";
    else if (["closed", "inactive", "withdrawn request"].includes(value))
      return "status-withdrawn-request";
    else if (["unContacted", "awaiting results"].includes(value)) return "status-uncontacted";
    else if (["assigned"].includes(value)) return "status-assigned ";
    else if (["in Progress"].includes(value)) return "status-inprogress";
    return "status-closed";
  }
  // my models columns for data table are decided here

  const columns: any = [
    {
      name: "Full name",
      maxWidth: "180px",
      minWidth: "80px",
      selector: (row: any) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Email",
      maxWidth: "350px",
      minWidth: "100px",
      selector: (row: any) => (
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="tooltip-engine">{row.email}</Tooltip>}
        >
          <p className="mb-0">{row.email}</p>
        </OverlayTrigger>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: "Subject",
      maxWidth: "150px",
      minWidth: "100px",
      selector: (row: any) => row.subject,
      sortable: true,
      wrap: true,
    },
    {
      name: "Description",
      maxWidth: "150px",
      minWidth: "100px",
      selector: (row: any) => (
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="tooltip-engine">{row.description}</Tooltip>}
        >
          <p className="mb-0">{row.description}</p>
        </OverlayTrigger>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: "Status",
      maxWidth: "130px",
      selector: (row: any) => (
        <>
          <div className={`p-1 px-2 rounded ${getCssClass(row.status)}`}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </div>
        </>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: "Notes",
      maxWidth: "150px",
      selector: (row: any) => (
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="tooltip-engine">{row.notes}</Tooltip>}
        >
          <p className="mb-0">{row.notes}</p>
        </OverlayTrigger>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: "Actions",
      maxWidth: "120px",
      selector: (row: any) => <SupportRequestPopover row={row} mutate={mutate} />,
      sortable: true,
      wrap: true,
      center: true,
    },
  ];

  const loadColumns: any = [
    {
      name: <ShimmerThumbnail height={15} className="mb-0" rounded />,
      selector: () => <ShimmerThumbnail height={15} className="mb-0" rounded />,
      sortable: true,
      wrap: true,
      maxWidth: "180px",
      minWidth: "80px",
    },

    {
      name: <ShimmerThumbnail height={15} className="mb-0" rounded />,
      selector: () => <ShimmerThumbnail height={15} className="mb-0" rounded />,
      sortable: true,
      wrap: true,
      maxWidth: "350px",
      minWidth: "100px",
    },
    {
      name: <ShimmerThumbnail height={15} className="mb-0" rounded />,
      selector: () => <ShimmerThumbnail height={15} className="mb-0" rounded />,
      sortable: true,
      wrap: true,
      maxWidth: "150px",
      minWidth: "100px",
    },
    {
      name: <ShimmerThumbnail height={15} className="mb-0" rounded />,
      selector: () => <ShimmerThumbnail height={15} className="mb-0" rounded />,
      sortable: true,
      wrap: true,
      maxWidth: "150px",
      minWidth: "100px",
    },
    {
      name: <ShimmerThumbnail height={15} className="mb-0" rounded />,
      selector: () => <ShimmerThumbnail height={15} className="mb-0" rounded />,

      maxWidth: "130px",
    },
    {
      name: <ShimmerThumbnail height={15} className="mb-0" rounded />,
      selector: () => <ShimmerThumbnail height={15} className="mb-0" rounded />,
      maxWidth: "150px",
    },
    {
      name: <ShimmerThumbnail height={15} className="mb-0" rounded />,
      selector: () => <ShimmerThumbnail height={15} className="mb-0" rounded />,
      maxWidth: "120px",
    },
  ];

  // Html designed code goes here
  return (
    <>
      <div className="mainc container">
        {!data ? (
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
            columns={columns}
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
export default SupportRequest;
