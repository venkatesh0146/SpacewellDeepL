import Header from "./components/Header";
import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "./components/Home";
import ViewGlossaryComponent from "./components/ViewGlossaryComponent";
import CreateGlossaryComponent from "./components/CreateGlossaryComponent";
import React, { memo } from "react";

const App = memo(() => {
  return (
    
      <><Header /><Outlet /></>
    
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
        element: <CreateGlossaryComponent />,
      },
      {
        path: "/glossary/:glossaryId",
        element: <ViewGlossaryComponent />,
      },
    ],
  },
]);

export default appRoute;
