import React from "react";
import Sidebar from "../components/Sidebar";

const Layout = (props) => {
  return (
    <div className="page">
      <div className="page__sidebar">
        <Sidebar />
      </div>
      <div className="page__content">{props.children}</div>
    </div>
  );
};

export default Layout;
