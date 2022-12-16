import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "reportWebVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Page from "components/Page";
import pages from "pages";
import "bootstrap/dist/css/bootstrap.min.css";
import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const routes = pages.map((page: any) => {
  const sidebarData = pages
    .filter((innerPage: any) => innerPage.path === innerPage.sidebar)
    .map((innerPage: any) => {
      return { ...innerPage, active: page.sidebar === innerPage.path };
    });

  return {
    path: page.path,
    element: (
      <Page title={page.title} sidebarData={sidebarData}>
        {page.element}
      </Page>
    ),
  };
});

const router = createBrowserRouter(routes);

export const appThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#0F4186",
    },
    secondary: {
      main: "#e53935",
    },
    background: {
      default: "#e8eaf6",
      paper: "#f4f6ff",
    },
    warning: {
      main: "#A87F00",
    },
    info: {
      main: "#2196f3",
    },
    success: {
      main: "#008E3B",
    },
  },
};

const appTheme = createTheme(appThemeOptions);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={appTheme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
