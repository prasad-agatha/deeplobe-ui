import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { toast } from "react-toastify";
import { Button, Modal, Spinner, Tab, Tabs } from "react-bootstrap";
import MainLayout from "layouts/MainLayout";
import Dummy from "@components/setting/Dummy";
import Invoices from "@components/setting/Invoice";
import SubscriptionPage from "@components/setting/SubscriptionPage";
import Users from "@components/setting/Users";
import SubService from "services/sub.service";
import DataTable from "react-data-table-component";

const subService = new SubService();

const Subscription = ({ loginStatus, user: profileData, mutate }) => {
  const [step, setStep] = useState<any>("profile");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const [droptoken, setDropToken] = useState("");
  const [onedrivetoken, setOnedriveToke] = useState("");
  const [googletoken, setGoogleToken] = useState("");

  useEffect(() => {
    if (localStorage.getItem("companion-Dropbox-auth-token"))
      setDropToken(localStorage.getItem("companion-Dropbox-auth-token"));

    if (localStorage.getItem("companion-OneDrive-auth-token"))
      setOnedriveToke(localStorage.getItem("companion-OneDrive-auth-token"));

    if (localStorage.getItem("companion-GoogleDrive-auth-token"))
      setGoogleToken(localStorage.getItem("companion-GoogleDrive-auth-token"));
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
        // display: "-webkit-box",
        // "-webkit-line-clamp": "3",
        // "-webkit-box-orient": "vertical",
        overflow: "hidden",
        div: {
          // display: "-webkit-box",
          // "-webkit-line-clamp": "3",
          // "-webkit-box-orient": "vertical",
          overflow: "hidden",
        },
      },
    },
  };
  const table_data = [
    {
      image_src: "/google_drive.svg",
      name: "Google Drive",
    },
    {
      image_src: "./one_drive.svg",
      name: "One Drive",
    },
  ];

  const columns = [
    {
      name: "Connectors",
      cell: (row: any) => (
        <>
          <img src={row.image_src} alt="" className="px-1" /> {row.name}
        </>
      ),
      grow: 2,
    },
    {
      name: "Action",
      cell: (row: any) => (
        <>
          {row.name === "Google Drive" ? (
            <>
              {googletoken ? (
                <>
                  <h6 className="mb-0">
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        localStorage.removeItem("companion-GoogleDrive-auth-token");
                        setGoogleToken("");
                        toast.success("Google drive Logout Successfully");
                      }}
                    >
                      <Button variant="primary" size="sm">
                        Logout
                      </Button>{" "}
                    </span>
                  </h6>
                </>
              ) : (
                <p className="mb-0">----</p>
              )}
            </>
          ) : (
            <>
              {onedrivetoken ? (
                <>
                  <h6 className="mb-0">
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        localStorage.removeItem("companion-OneDrive-auth-token");
                        setOnedriveToke("");
                        toast.success("One Drive Logout Successfully");
                      }}
                    >
                      <Button variant="primary" size="sm">
                        Logout
                      </Button>{" "}
                    </span>
                  </h6>
                </>
              ) : (
                <p className="mb-0">----</p>
              )}
            </>
          )}
        </>
      ),
      grow: 2,
      center: true,
    },
  ];

  const router = useRouter();
  const { tab } = router.query;
  useEffect(() => {
    if (tab) setStep(tab);
  }, [tab]);

  const { data, mutate: workspaceMutate } = useSWR(`personalworkspace/`, async () => {
    const res = await subService.personalWorkspace();
    return res;
  });

  return (
    <>
      <MainLayout>
        <div className="mainc container">
          <div className="mb-3">
            <h5 className="font-24 mb-4 font-weight-bold  font-inter">Settings</h5>
            <p className="font-16 text-muted my-4 font-inter">
              Change your profile and account settings
            </p>
          </div>
          <div className="w-100 ">
            <Tabs
              id="controlled-tab-example"
              activeKey={step}
              onSelect={(k) => router.push(`/settings?tab=${k}`)}
              className="border-0 color font-18"
            >
              <Tab eventKey="profile" title="Profile">
                <div className="">
                  <Dummy {...{ data, profileData, loginStatus, mutate, setShow }} />
                </div>
              </Tab>
              <Tab eventKey="subscription" title="Subscription">
                <div className="">
                  <SubscriptionPage {...{ data, mutate, workspaceMutate, profileData, setShow }} />
                </div>
              </Tab>

              {data?.plan !== process.env.NEXT_PUBLIC_FREE_PLAN && (
                <Tab eventKey="invoices" title="Invoices">
                  <div className="">
                    <Invoices />
                  </div>
                </Tab>
              )}

              <Tab eventKey="users" title="Users">
                <div className="">
                  <Users workspace={data} user={profileData} />
                </div>
              </Tab>
              <Tab eventKey="connedted" title="Connectors">
                <div className="">
                  <div className="card-table p-4 rounded">
                    <div className="">
                      <h5 className="font-weight-600 txt-header font-22 mb-3">Data Connectors</h5>
                    </div>
                    <div className="mt-3">
                      {/* <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th scope="col">Connectors</th>
                            <th scope="col" className="text-center">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <img src="./google_drive.svg" alt="" /> Goole Drive
                            </td>
                            <td className="text-center">
                              {googletoken ? (
                                <>
                                  <h6>Google Drive</h6>
                                  <h6>
                                    <span
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        localStorage.removeItem("companion-GoogleDrive-auth-token");
                                        setGoogleToken("");
                                        toast.success("Dropbox Logout Successfully");
                                      }}
                                    >
                                      <Button variant="primary" size="sm">
                                        Logout
                                      </Button>{" "}
                                    </span>
                                  </h6>
                                </>
                              ) : (
                                <p>---</p>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <img src="./one_drive.svg"></img> One Drive
                            </td>
                            <td className="text-center">
                              {onedrivetoken ? (
                                <>
                                  <h6>One Drive</h6>
                                  <h6>
                                    <span
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        localStorage.removeItem("companion-OneDrive-auth-token");
                                        setOnedriveToke("");
                                        toast.success("One Drive Logout Successfully");
                                      }}
                                    >
                                      <Button variant="primary" size="sm">
                                        Logout
                                      </Button>{" "}
                                    </span>
                                  </h6>
                                </>
                              ) : (
                                <p>---</p>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table> */}
                      <DataTable
                        responsive
                        customStyles={customStyles}
                        className="table-height"
                        data={table_data}
                        columns={[...columns]}
                        pagination
                        fixedHeader
                        persistTableHead
                        highlightOnHover
                        pointerOnHover
                      />
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
            <Modal
              onHide={() => setShow(false)}
              keyboard={false}
              show={show}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header className="pb-0" style={{ backgroundColor: "white" }}>
                <Modal.Title className="ps-0 text-primary fw-bold font-inter">
                  Cancel Subscription
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="pt-0 mx-2">
                <p className="for-start mb-3">
                  Are you sure you want to cancel your subscription? By cancelling your
                  subscription, you will move to free plan subscription.
                </p>
                <div className="d-flex mt-4">
                  <button
                    className="btn btn-primary btn-sm font-inter"
                    onClick={async () => {
                      try {
                        setLoading(true);
                        await subService.cancleRenewal();
                        mutate();
                        workspaceMutate();
                        toast.success("Your subscription has been cancelled");
                      } catch (e) {
                        console.log(e);
                        window.location.reload();
                      }
                      setLoading(false);
                    }}
                  >
                    {loading && (
                      <Spinner
                        animation="border"
                        className="me-2"
                        style={{ width: "1rem", height: "1rem" }}
                      />
                    )}
                    {` Cancel`}
                  </button>
                  <button
                    className="btn btn-sm ms-3 font-inter broder-0"
                    onClick={() => setShow(false)}
                  >
                    Close
                  </button>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Subscription;
