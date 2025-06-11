import React, { useEffect } from "react";
// next imports
import Router, { useRouter } from "next/router";
// styled Components
// import { ThemeProvider } from "styled-components";
import { ThemeProvider } from "next-themes";
// Theme
// import { theme } from "styles/theme";
// axios config
import "config/axios_configuration";
// sentry configuration
import "config/sentry_configuration";
// Stylesheets
import "bootstrap/dist/css/bootstrap.min.css";
// app css
import "styles/scss/App.scss";

// fontawesome
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;
// nprogress
import NProgress from "nprogress";
import useLoginStatus from "@lib/hooks/use-login-status";
import { annotatorPaths, isRole } from "common_functions/functions";

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});

Router.events.on("routeChangeComplete", () => {
  NProgress.done();
});

Router.events.on("routeChangeError", () => {
  NProgress.done();
});

const MyApp = (props: any) => {
  const router = useRouter();
  const { loginStatus, user, mutate } = useLoginStatus();
  const { Component, pageProps, err }: any = props;
  const Layout = Component.Layout || React.Fragment;
  const modifiedPageProps = { ...pageProps, loginStatus, user, mutate, router, Router, err };

  useEffect(() => {
    if (
      ["/", "/auth/login"].includes(router.pathname) &&
      loginStatus === "loggedIn" &&
      !user.is_new
    )
      router.push("/dashboard");
    if (["/", "/auth/login"].includes(router.pathname) && loginStatus === "loggedIn" && user.is_new)
      router.push("/auth/welcome");

    if (
      !["/auth/register", "/magic-link/magic_id"].includes(router.pathname) &&
      loginStatus === "loggedOut"
    )
      router.replace("/auth/login");
    if (isRole(user, "annotator") && !annotatorPaths(router.pathname) && loginStatus === "loggedIn")
      router.replace("/my-models");
  }, [user, loginStatus, router.asPath]);

  return (
    <ThemeProvider defaultTheme={`${process.env.NEXT_PUBLIC_CLIENT}`}>
      <Layout>
        <Component {...modifiedPageProps} />
      </Layout>
    </ThemeProvider>
  );
};

export default MyApp;
