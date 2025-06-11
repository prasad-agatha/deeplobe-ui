import React, { FC } from "react";
import Head from "next/head";
//components
import { SidebarNew } from "components/page_views";
import Navigation from "components/navigation/Navigation";
//next
import { useRouter } from "next/router";
import UserService from "services/user.service";
// react tour
import dynamic from "next/dynamic";
import useLoginStatus from "lib/hooks/use-login-status";

const Tour = dynamic(() => import("reactour"), { ssr: false });

const userService = new UserService();
interface IProps {
  children: any;
}
const MainLayout: FC<IProps> = ({ children }) => {
  const router: any = useRouter();
  const accentColor: any = "#ffffff";
  const { loginStatus, user: profileData, mutate } = useLoginStatus();
  const steps = [
    {
      selector: ".first-step",
      content: (
        <div>
          <h1 className="font-16 font-inter">Pre-trained models</h1>
          <p className="font-14 font-inter">
            Save time by leveraging our extensive suite of pre-trained models.
          </p>
        </div>
      ),
      style: {
        backgroundColor: "#5C7AF1",
        color: "#FFFFFF",
      },
    },
    {
      selector: ".second-step",
      content: (
        <div>
          <h1 className="font-16 font-inter">Create a model</h1>
          <p className="font-14 font-inter">
            Build and deploy models with no or little knowledge of coding.
          </p>
        </div>
      ),
      style: {
        backgroundColor: "#5C7AF1",
        color: "#FFFFFF",
      },
    },

    {
      selector: ".third-step",
      content: (
        <div>
          <h1 className="font-16 font-inter">My models</h1>
          <p className="font-14 font-inter">Check out the models that you’ve already worked on.</p>
        </div>
      ),
      style: {
        backgroundColor: "#5C7AF1",
        color: "#FFFFFF",
      },
    },
    {
      selector: ".fourth-step",
      content: (
        <div>
          <h1 className="font-16 font-inter">API’s</h1>
          <p className="font-14 font-inter">
            Generate ML model APIs for embedding into applications.
          </p>
        </div>
      ),
      style: {
        backgroundColor: "#5C7AF1",
        color: "#FFFFFF",
      },
    },
    {
      selector: ".fifth-step",
      content: (
        <div>
          <h1 className="font-16 font-inter">Settings</h1>
          <p className="font-14 font-inter">Save user preferences.</p>
        </div>
      ),
      style: {
        backgroundColor: "#5C7AF1",
        color: "#FFFFFF",
      },
    },
    {
      selector: ".seventh-step",
      content: (
        <div>
          <h1 className="font-16 font-inter">Have an unique use case? Lets Connect</h1>
          <p className="font-14 font-inter">
            Contact us to build a custom model for your specific use case.
          </p>
        </div>
      ),
      style: {
        backgroundColor: "#5C7AF1",
        color: "#FFFFFF",
      },
    },
    // ...
  ];

  const steps2 = [
    {
      selector: ".first-step",
      content: (
        <div>
          <h1 className="font-16 font-inter">Pre-trained models</h1>
          <p className="font-14 font-inter">
            Save time by leveraging our extensive suite of pre-trained models.
          </p>
        </div>
      ),
      style: {
        backgroundColor: "#5C7AF1",
        color: "#FFFFFF",
      },
    },
    {
      selector: ".second-step",
      content: (
        <div>
          <h1 className="font-16 font-inter">Create a model</h1>
          <p className="font-14 font-inter">
            Build and deploy models with no or little knowledge of coding.
          </p>
        </div>
      ),
      style: {
        backgroundColor: "#5C7AF1",
        color: "#FFFFFF",
      },
    },

    {
      selector: ".third-step",
      content: (
        <div>
          <h1 className="font-16 font-inter">My models</h1>
          <p className="font-14 font-inter">Check out the models that you’ve already worked on.</p>
        </div>
      ),
      style: {
        backgroundColor: "#5C7AF1",
        color: "#FFFFFF",
      },
    },
    {
      selector: ".fourth-step",
      content: (
        <div>
          <h1 className="font-16 font-inter">API’s</h1>
          <p className="font-14 font-inter">
            Generate ML model APIs for embedding into applications.
          </p>
        </div>
      ),
      style: {
        backgroundColor: "#5C7AF1",
        color: "#FFFFFF",
      },
    },
    {
      selector: ".fifth-step",
      content: (
        <div>
          <h1 className="font-16 font-inter">Settings</h1>
          <p className="font-14 font-inter">Save user preferences.</p>
        </div>
      ),
      style: {
        backgroundColor: "#5C7AF1",
        color: "#FFFFFF",
      },
    },
    // {
    //   selector: ".sixth-step",
    //   content: (
    //     <div>
    //       <h1 className="font-16 font-inter">Admin</h1>
    //       <p className="font-14 font-inter">Manage user accounts.</p>
    //     </div>
    //   ),
    //   style: {
    //     backgroundColor: "#5C7AF1",
    //     color: "#FFFFFF",
    //   },
    // },
    {
      selector: ".seventh-step",
      content: (
        <div>
          <h1 className="font-16 font-inter">Have an unique use case? Lets Connect</h1>
          <p className="font-14 font-inter">
            Contact us to build a custom model for your specific use case.
          </p>
        </div>
      ),
      style: {
        backgroundColor: "#5C7AF1",
        color: "#FFFFFF",
      },
    },
    // ...
  ];
  const [collapse, setCollapse] = React.useState(false);
  const [isTourOpen, setIsTourOpen] = React.useState(false);

  //Method for handling sidebar
  const ToggleChange = () => {
    setCollapse(!collapse);
  };

  React.useEffect(() => {
    if (router.pathname.includes("[uuid]")) setCollapse(true);
  }, [router.query]);

  return (
    <div>
      <Head>
        <title>{process.env.NEXT_PUBLIC_BRAND}</title>
        <link rel="icon" href={`${process.env.NEXT_PUBLIC_BRAND_FAVICON}`} />
      </Head>
      <div id="dashboard-layout-wrapper" className="dashboard-layout-wrapper">
        <div className="dashboard-top-bar">
          <Navigation />
        </div>
        <div className="dashboard-bottom-bar">
          <div className="sidebar-container">
            <div className={`dashboard-sidebar ${collapse ? "toggle-active" : ""}`}>
              <SidebarNew
                collapse={collapse}
                setIsTourOpen={setIsTourOpen}
                setCollapse={ToggleChange}
                user={profileData}
                mutate={mutate}
              />
            </div>
          </div>

          <div
            className="d-flex align-items-center bg-light tgle"
            style={{ left: collapse ? "69px" : "269px" }}
          >
            <img
              src={collapse ? "/images/expand.svg" : "/images/collapse-img.svg"}
              alt=""
              onClick={() => setCollapse(!collapse)}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="dashboard-content-wrapper">
            {children}
            <div className="mt-auto">
              <div className="mt-5 py-3">
                <h4 className="text-center page-content mb-0">
                  {/* © Copyright DeepLobe.ai. All rights reserved */}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Tour
        accentColor={accentColor}
        showNumber={false}
        showCloseButton={true}
        lastStepNextButton={<p className="text-white m-0 p-0 font-14">Okay</p>}
        rounded={8}
        startAt={0}
        steps={
          profileData?.email.includes("@soulpageit.com") ||
          profileData?.email.includes("@intellectdata.com")
            ? steps2
            : steps
        }
        isOpen={isTourOpen}
        onRequestClose={async () => {
          try {
            setIsTourOpen(false);
            if (profileData?.help) {
              await userService.updateUserDetails({ help: false });
              mutate();
            }
          } catch (e) {}
        }}
      />
    </div>
  );
};

export default MainLayout;
