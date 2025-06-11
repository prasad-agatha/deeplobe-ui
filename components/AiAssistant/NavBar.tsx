import React, { useRef, useState } from "react";
import AuthService from "services/auth.service";
import UserService from "services/user.service";
import useLoginStatus from "lib/hooks/use-login-status";
import Router from "next/router";

const authService = new AuthService();
const userService = new UserService();
//toast configuration
toast.configure();

// React Bootstrap
import {
  Navbar,
  Nav,
  Image,
  Button,
  Overlay,
  Popover,
  PopoverContent,
  OverlayTrigger,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/router";
// const Navigation = (props) => {
function AiNavBar() {
  const router = useRouter();
  const { user, mutate } = useLoginStatus();

  const ref = useRef(null);

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
  // console.log(user);
  const popover = (
    <Popover id="popover-contained" className="w-100">
      <PopoverContent className="p-0">
        <div className="w-100 d-flex p-3">
          <img
            src={user?.profile_pic === null ? "/nav-popover/user.svg" : user?.profile_pic}
            width={40}
            height={40}
            className="me-2 rounded-circle"
          />

          <div style={{ width: "calc(100% - 48px)" }}>
            <div className="text-black fw-semibold">{user?.username}</div>
            <div className="txt-overflow">{user?.email}</div>
          </div>
        </div>

        <hr className="m-0" />
        <div className="p-3">
          <div onClick={() => Router.push("/settings")} className="cursor-pointer mb-3">
            <img className="me-2" src="/nav-popover/settings.svg" />
            <span className="">Account Settings</span>
          </div>
          {user?.is_admin && (
            <div onClick={() => Router.push("/admin")} className="cursor-pointer mb-3">
              <img className="me-2" src="/nav-popover/admin.svg" />
              <span className="">Admin</span>
            </div>
          )}

          <div
            onClick={() => {
              try {
                authService.logOut();
                mutate();
              } catch (error) {
                console.log(error);
              }
            }}
            className="cursor-pointer mb-3"
          >
            <img className="me-2" src="/nav-popover/log-out.svg" alt="logout" />
            <span className="">Logout</span>
          </div>
          <p className="starters_sub mt-2 m-0">Switch Workspace</p>
          {(user?.workspaces || []).map((e: any, id: any) => {
            return (
              <div key={id}>
                <div
                  onClick={() => changeWorkSpace(e)}
                  className="d-flex align-items-center mt-2 cursor-pointer"
                >
                  <div className="d-flex w-100" style={{ maxWidth: "calc(100% - 15px)" }}>
                    <img className="me-2 mb-3" src="/nav-popover/users.svg" />
                    <div className="" style={{ width: "calc(100% - 42px)" }}>
                      <p className="mb-1 txt-overflow">
                        {user?.email === e.user ? "Personal" : e.name}
                      </p>
                      <p className="font-10 txt-overflow m-0">{e?.plan?.split("-")[0]}</p>
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
  return (
    <>
      <Navbar className="shadow-sm custom-nav border-bottom w-100 px-5 py-2" bg="white" expand="lg">
        <Navbar.Brand
          href={
            user?.username
              ? "/dashboard"
              : `${
                  process.env.NEXT_PUBLIC_CLIENT === "Intellect INFER"
                    ? "https://intellectdata.com/"
                    : "https://deeplobe.ai/"
                }`
          }
        >
          <Image className="img-fluid ml-3" src={`${process.env.NEXT_PUBLIC_BRAND_IMAGE}`} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav.Link className="ms-auto  align-items-center seventh-step" href={`/contact-us`}>
            <button
              type="button"
              className="btn btn-primary font-14 m-0 border-0"
              style={{ borderRadius: "6px" }}
            >
              Contact Us
            </button>
          </Nav.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default AiNavBar;
