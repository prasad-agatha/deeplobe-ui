import React, { useEffect } from "react";
import Link from "next/link";
import $ from "jquery";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { ListGroup, OverlayTrigger, Popover, PopoverContent, Tooltip } from "react-bootstrap";
import { ShimmerThumbnail, ShimmerText, ShimmerCircularImage } from "react-shimmer-effects";

import UserService from "services/user.service";
import { isRole, userAccess } from "common_functions/functions";

const userService = new UserService();

const SidebarNew = (props) => {
  const router = useRouter();
  const { collapse, setIsTourOpen, user, mutate, setCollapse } = props;
  const activeTab: string = router.pathname.replace(/^\/|\/$/g, "").split("/")[0];

  useEffect(() => {
    if (user && user?.help) setIsTourOpen(true);
  }, [user]);

  const ToggleChange = () => {
    $(".navbar-primary").toggleClass("collapsed");
    // $(".sidebar-toggle-btn").toggleClass("sidebar-toggle-btn-collapsed");
    props.ToggleChange();
  };

  const changeWorkSpace = async (workspace: any) => {
    try {
      await userService.updateUserDetails({ current_workspace: workspace.id });
      mutate();
      document.body.click();
      if (router.pathname.includes("create-model")) router.reload();
    } catch (e) {
      toast.error(e);
    }
  };

  const toolTip = (children: any) => {
    return user?.model_permissions[0]?.pretrained === false ? (
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip id="button-tooltip">You don't have access to Pre-Trained model</Tooltip>}
      >
        <span>
          <span className={`px-2 ${activeTab === "pre-trained-models" ? "selected-icon" : ""}`}>
            <img
              src={`/images/${
                activeTab === "pre-trained-models"
                  ? "pre-trained-models-selected.svg"
                  : "pre-trained-models.svg"
              }`}
            />
          </span>
          {collapse ? null : (
            <span
              className={`nav-label pl-3 font-16 font-inter ${
                activeTab === "pre-trained-models" ? "nav-text-blue" : "nav-text-dark"
              } `}
            >
              Pre-trained models
            </span>
          )}
        </span>
      </OverlayTrigger>
    ) : (
      <Link href="/pre-trained-models">{children}</Link>
    );
  };

  const popover = (
    <Popover id="popover-contained" className="w-100 px-2 popover-side">
      <PopoverContent className="p-0">
        <div className="p-3">
          <p className="starters_sub m-0">Switch Workspace</p> <hr className="m-0" />
          {(user?.workspaces || []).map((e: any, id: any) => {
            return (
              <div key={id}>
                <div
                  onClick={() => changeWorkSpace(e)}
                  className="d-flex align-items-center mt-2 cursor-pointer"
                >
                  <div className="d-flex w-100" style={{ maxWidth: "calc(100% - 20px)" }}>
                    <img className="me-2 mb-3" src="/nav-popover/users.svg" />
                    <div className="" style={{ width: "calc(100% - 42px)" }}>
                      <p className="mb-1 txt-overflow">
                        {user?.email === e.user ? "Personal" : e.name}
                      </p>
                      <p className="font-10 txt-overflow m-0">{e.plan.split("-")[0]}</p>
                    </div>
                  </div>
                  <div
                    className={`${
                      user?.current_workspace === e.id ? "d-inline ms-auto" : "d-none"
                    }`}
                  >
                    <img className="mb-3" src="/TickIcon.svg" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );

  const helpPopover = (
    <Popover id="popover-basic">
      <Popover.Content className="p-0">
        <ListGroup className="border-0">
          {[
            { name: "Knowledge Base", img: "/images/Knowledge-Base.svg" },
            { name: "API Documentation", img: "/images/API-Documentation3.svg" },
            { name: "Contact Support", img: "/images/call-center-1.svg" },
          ].map((ele: any, id: any) => (
            <ListGroup.Item
              className="d-flex flex-row align-items-center cr-p p-0 popover-item"
              onClick={async () => document.body.click()}
              key={id}
            >
              {!["Knowledge Base"].includes(ele.name) ? (
                <Link
                  href={ele.name === "API Documentation" ? "/api-documentation" : "/contact-us"}
                >
                  <a className="d-flex py-2 px-3 w-100">
                    <img
                      src={ele.img}
                      width={ele.name === "Contact Support" ? 22 : 24}
                      height={ele.name === "Contact Support" ? 22 : 24}
                      alt="i"
                    />
                    <p className="text-muted ps-2 mb-0">{ele.name}</p>
                  </a>
                </Link>
              ) : (
                <div
                  className="d-flex py-2 px-3 w-100"
                  onClick={() => window.open("https://docs.deeplobe.ai/", "_blank")}
                >
                  <img src={ele.img} width={24} height={24} alt="i" />
                  <p className="text-muted ps-2 mb-0">{ele.name}</p>
                </div>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Popover.Content>
    </Popover>
  );

  const createModel = (
    <a className="text-dark p-2 w-100">
      <OverlayTrigger
        placement="right"
        overlay={
          collapse ? (
            <Tooltip id="button-tooltip">Custom model</Tooltip>
          ) : (
            <Tooltip className="d-none" id="tooltip"></Tooltip>
          )
        }
      >
        <span className={`px-2 ${activeTab === "create-model" ? "selected-icon" : ""}`}>
          <img
            src={`/images/${
              activeTab === "create-model" ? "create-model-selected.svg" : "create-model.svg"
            }`}
          />
        </span>
      </OverlayTrigger>
      {collapse ? null : (
        <span
          className={`nav-label pl-3 font-16 font-inter ${
            activeTab === "create-model" ? "nav-text-blue" : "nav-text-dark"
          } `}
        >
          Custom model
          {user?.current_workspace_details?.plan === process.env.NEXT_PUBLIC_FREE_PLAN && (
            <img src="/premium.svg" alt="premium" className="mx-3" />
          )}
        </span>
      )}
    </a>
  );

  return (
    <div className={`h-100 ${collapse ? "toggle-active" : ""}`}>
      <nav className="h-100 nav flex-column">
        <ul className="navbar-primary-menu px-2 pt-2 mt-4 d-flex flex-column h-100">
          <div className="mb-3">
            {collapse ? (
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip id="button-tooltip">Workspace</Tooltip>}
              >
                <div className="d-flex">
                  {(user?.workspaces || [])
                    .filter((e: any) => e.id === user?.current_workspace)
                    .map((e: any, id: any) => {
                      return (
                        <div className="d-flex w-100 justify-content-center" key={id}>
                          <span
                            className="p-1 px-2 p-round p-status cursor-pointer"
                            onClick={() => setCollapse(!collapse)}
                          >
                            {e?.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </OverlayTrigger>
            ) : (
              <button className="side-button">
                <OverlayTrigger
                  rootClose
                  trigger="click"
                  placement="bottom"
                  overlay={popover}
                  transition
                >
                  {user?.workspaces ? (
                    <div className="d-flex">
                      {(user?.workspaces || [])
                        .filter((e: any) => e.id === user?.current_workspace)
                        .map((e: any, id: any) => {
                          return (
                            <div className="d-flex flex-row w-100 justify-content-between" key={id}>
                              <div className="d-flex flex-row">
                                <span className="p-1 px-2 p-round p-status">
                                  {e?.name.charAt(0).toUpperCase()}{" "}
                                </span>
                                <div className="ms-2">
                                  <div
                                    className="font-14 font-weight-600 lh-22 text-truncate text-start"
                                    style={{ width: "158px" }}
                                  >
                                    {" "}
                                    {user?.email === e.user ? "Personal" : e.name}
                                  </div>

                                  <div className="d-flex">
                                    <span className="font-12 font-weight-400 lh-20">
                                      {e.plan.split("-")[0]}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="my-auto">
                                <img className="ms-3" src={`/images/down-arrow-key.svg`} />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="d-flex">
                      {
                        <div className="d-flex flex-row w-100 justify-content-between">
                          <div className="d-flex flex-row shm-i">
                            <ShimmerCircularImage size={40} className="m-0" />
                            <div className="ms-2 d-flex flex-column justify-content-center">
                              <ShimmerThumbnail height={10} className="m-0" rounded />
                              <ShimmerThumbnail height={10} className="m-0" rounded />
                            </div>
                          </div>

                          <div className="my-auto">
                            <img className="ms-3" src={`/images/down-arrow-key.svg`} />
                          </div>
                        </div>
                      }
                    </div>
                  )}
                </OverlayTrigger>
              </button>
            )}
          </div>

          {!isRole(user, "annotator") && (
            <>
              <li className={`d-flex mb-3 ${activeTab === "dashboard" ? "selected-tab" : ""}`}>
                <Link href="/dashboard">
                  <a className="text-dark p-2 w-100">
                    {collapse ? (
                      <OverlayTrigger
                        placement="right"
                        overlay={<Tooltip id="button-tooltip">Dashboard</Tooltip>}
                      >
                        <span
                          className={`px-2 ${activeTab === "dashboard" ? "selected-icon" : ""}`}
                        >
                          <img
                            src={`/images/${
                              activeTab === "dashboard"
                                ? "dashboard-selected-icon.svg"
                                : "dashboard-icon.svg"
                            }`}
                          />
                        </span>
                      </OverlayTrigger>
                    ) : (
                      <>
                        <span
                          className={`px-2 ${activeTab === "dashboard" ? "selected-icon" : ""}`}
                        >
                          <img
                            src={`/images/${
                              activeTab === "dashboard"
                                ? "dashboard-selected-icon.svg"
                                : "dashboard-icon.svg"
                            }`}
                          />
                        </span>
                        <span
                          className={`nav-label pl-3 font-16  ${
                            activeTab === "dashboard" ? "nav-text-blue" : "nav-text-dark"
                          } `}
                        >
                          Dashboard
                        </span>
                      </>
                    )}
                  </a>
                </Link>
              </li>

              <li
                className={`d-flex mb-3 ${
                  activeTab === "pre-trained-models" ? "selected-tab" : ""
                } first-step`}
              >
                {toolTip(
                  <a className="text-dark p-2 w-100">
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        collapse ? (
                          <Tooltip id="button-tooltip">Pre-trained models</Tooltip>
                        ) : (
                          <Tooltip className="d-none" id="tooltip"></Tooltip>
                        )
                      }
                    >
                      <span
                        className={`px-2 ${
                          activeTab === "pre-trained-models" ? "selected-icon" : ""
                        }`}
                      >
                        <img
                          src={`/images/${
                            activeTab === "pre-trained-models"
                              ? "pre-trained-models-selected.svg"
                              : "pre-trained-models.svg"
                          }`}
                        />
                      </span>
                    </OverlayTrigger>
                    {collapse ? null : (
                      <span
                        className={`nav-label pl-3 font-16 font-inter ${
                          activeTab === "pre-trained-models" ? "nav-text-blue" : "nav-text-dark"
                        } `}
                      >
                        Pre-trained models
                      </span>
                    )}
                  </a>
                )}
              </li>
            </>
          )}

          <li
            className={`d-flex mb-3 ${
              activeTab === "create-model" ? "selected-tab" : ""
            } second-step`}
          >
            <Link href="/create-model">{createModel}</Link>
          </li>

          <li
            className={`d-flex mb-3 ${activeTab === "my-models" ? "selected-tab" : ""} third-step`}
          >
            <Link href="/my-models">
              <a className="text-dark p-2 w-100">
                <OverlayTrigger
                  placement="right"
                  overlay={
                    collapse ? (
                      <Tooltip id="button-tooltip">My models</Tooltip>
                    ) : (
                      <Tooltip className="d-none" id="tooltip"></Tooltip>
                    )
                  }
                >
                  <span className={`px-2 ${activeTab === "my-models" ? "selected-icon" : ""}`}>
                    <img
                      src={`/images/${
                        activeTab === "my-models"
                          ? "my-models-selected-icon.svg"
                          : "my-models-icon.svg"
                      }`}
                    />
                  </span>
                </OverlayTrigger>
                {collapse ? null : (
                  <span
                    className={`nav-label pl-3 font-16 font-inter ${
                      activeTab === "my-models" ? "nav-text-blue" : "nav-text-dark"
                    } `}
                  >
                    My models
                  </span>
                )}
              </a>
            </Link>
          </li>

          {userAccess(user, "api") && (
            <li
              className={`d-flex mb-3 ${
                activeTab === "trained-apis" ? "selected-tab" : ""
              } fourth-step`}
            >
              <Link href="/trained-apis">
                <a className="text-dark p-2 w-100">
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      collapse ? (
                        <Tooltip id="button-tooltip">API's</Tooltip>
                      ) : (
                        <Tooltip className="d-none" id="tooltip"></Tooltip>
                      )
                    }
                  >
                    <span className={`px-2 ${activeTab === "trained-apis" ? "selected-icon" : ""}`}>
                      <img
                        src={`/images/${
                          activeTab === "trained-apis" ? "apis-selected-icon.svg" : "apis-icon.svg"
                        }`}
                      />
                    </span>
                  </OverlayTrigger>
                  {collapse ? null : (
                    <span
                      className={`nav-label pl-3 font-16 font-inter ${
                        activeTab === "trained-apis" ? "nav-text-blue" : "nav-text-dark"
                      } `}
                    >
                      API’s
                    </span>
                  )}
                </a>
              </Link>
            </li>
          )}

          {user?.is_admin && (
            <li className={`d-flex mb-3 ${activeTab === "admin" ? "selected-tab" : ""} sixth-step`}>
              <Link href="/admin">
                <a className="text-dark p-2 w-100">
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      collapse ? (
                        <Tooltip id="button-tooltip">Admin</Tooltip>
                      ) : (
                        <Tooltip className="d-none" id="tooltip"></Tooltip>
                      )
                    }
                  >
                    <span className={`px-2 ${activeTab === "admin" ? "selected-icon" : ""}`}>
                      <img
                        src={`/images/${
                          activeTab === "admin" ? "administrator-selected.svg" : "administrator.svg"
                        }`}
                      />
                    </span>
                  </OverlayTrigger>
                  {collapse ? null : (
                    <span
                      className={`nav-label pl-3 font-16 font-inter ${
                        activeTab === "admin" ? "nav-text-blue" : "nav-text-dark"
                      } `}
                    >
                      Admin
                    </span>
                  )}
                </a>
              </Link>
            </li>
          )}
          <hr className="mt-auto" />

          <li className={`d-flex`}>
            <OverlayTrigger
              rootClose
              trigger="click"
              placement="top"
              overlay={helpPopover}
              transition
            >
              <a className="text-dark p-2 w-100 cr-p">
                <OverlayTrigger
                  placement="right"
                  overlay={
                    collapse ? (
                      <Tooltip id="button-tooltip">Help</Tooltip>
                    ) : (
                      <Tooltip className="d-none" id="tooltip"></Tooltip>
                    )
                  }
                >
                  <span className={`px-2 `}>
                    <img src={`/images/help-icon.svg`} />
                  </span>
                </OverlayTrigger>
                {collapse ? null : (
                  <span className={`nav-label pl-3 font-16 nav-text-dark`}>Help</span>
                )}
              </a>
            </OverlayTrigger>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarNew;
