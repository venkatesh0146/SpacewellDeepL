import Header from "./components/Header";
import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "./components/Home";
import GlossaryComponent from "./components/GlossaryComponent";
import React, { memo } from "react";
import DocumentTranslation from "./components/DocumentTranslation";

const App = memo(() => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
});

const appRoute = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/newglossary",
        element: <GlossaryComponent isCreateMode={true} />,
      },
      {
        path: "/translate",
        element: <DocumentTranslation />,
      },
      {
        path: "/glossary/:glossaryId",
        element: <GlossaryComponent isCreateMode={false} />,
      },
    ],
  },
]);

export default appRoute;
