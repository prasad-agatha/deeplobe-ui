import { useState } from "react";
import DataTable from "react-data-table-component";
import useSWR from "swr";
import { ShimmerThumbnail } from "react-shimmer-effects";
import SubService from "services/sub.service";

const subService = new SubService();

const Invoices = () => {
  const [loading, setLoading] = useState(true);
  const { data, mutate } = useSWR(`/invoices/`, async () => {
    const res = await subService.stripeInvoices();
    setLoading(false);
    return res;
  });

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

  const columns = [
    {
      name: "Invoice Number",
      selector: (row: any) => {
        return (
          <>
            <img src={"/pdf-file.svg"} className="ms-0 me-2" /> Invoice #{row?.invoice_details.id}
          </>
        );
      },
      sortable: false,
    },
    {
      name: "Invoice Date",
      cell: (row: any) => row?.invoice_details.date,
      sortable: false,
    },
    {
      name: "Amount",
      cell: (row: any) => row?.invoice_details.amount,
      sortable: false,
    },

    {
      name: "Plan",
      cell: (row: any) => {
        return (
          <p className="mt-3">
            {row?.invoice_details?.plan
              .replace("-plan half yearly", " Plan Half Yearly")
              .replace("-plan yearly", " Plan Yearly")}
          </p>
        );
      },
      sortable: false,
    },

    {
      name: "Actions",
      cell: (row: any) => (
        <p
          className="primary-color mt-3"
          onClick={() => window.open(row?.invoice_details.invoice_pdf, "_blank")}
        >
          Download
        </p>
      ),
      sortable: false,
      center: true,
    },
  ];

  const customColumns = () => {
    console.log("custom_col");
    return columns.map((ele: any) => {
      return {
        ...ele,
        cell: () => (
          <div className="w-100">
            <ShimmerThumbnail height={15} className="mb-0 stm" rounded />
          </div>
        ),
      };
    });
  };

  return (
    <div className="card-table p-4 rounded">
      <div className="g-1 ">
        <h4 className="font-weight-600 font-22 mb-3">Invoices</h4>
        {/* <p className="m-0 txt-lgray font-16">People who has access to all the models</p> */}
      </div>
      <div className="flex-grow-1 border-0 mt-0 mb-4">
        <DataTable
          responsive
          customStyles={customStyles}
          className="table-height"
          data={
            loading ? [{ col: 1 }, { col: 1 }, { col: 1 }, { col: 1 }, { col: 1 }] : data.reverse()
          }
          columns={loading ? customColumns() : columns}
          fixedHeader
          persistTableHead
          highlightOnHover
          pointerOnHover
          pagination
          paginationServer
          // paginationTotalRows={data.count}
        />
      </div>
    </div>
  );
};
export default Invoices;
