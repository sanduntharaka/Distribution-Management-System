import React, { useState } from "react";
import { AiOutlineUserAdd, AiOutlineShop } from "react-icons/ai";
import { MdOutlineInventory } from "react-icons/md";
import {
  TbFileInvoice,
  TbLayoutDashboard,
  TbReportMoney,
  TbTruckReturn,
} from "react-icons/tb";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { RiBillLine } from "react-icons/ri";
const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [mainClass, setMainClass] = useState("container");
  const handleShowHideSidebar = () => {
    if (showSidebar === false) {
      setShowSidebar(true);
    } else {
      setShowSidebar(false);
    }
  };

  return (
    <div
      className="container"
      onClick={handleShowHideSidebar}
      style={showSidebar ? { width: "300px" } : {}}
    >
      <div
        className="container__header"
        style={showSidebar ? { display: "flex" } : {}}
      >
        <div
          className="container__header__brand"
          style={showSidebar ? { display: "revert" } : {}}
        >
          <p>distributor management system</p>
        </div>
      </div>
      <div className="container__list">
        <div
          className="container__list__item"
          style={showSidebar ? { padding: "10px 20px" } : {}}
        >
          <div className="container__list__item__icon">
            <TbLayoutDashboard />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: "block" } : {}}
          >
            Dashboard
          </div>
        </div>
        <div
          className="container__list__item"
          style={showSidebar ? { padding: "10px 20px" } : {}}
        >
          <div className="container__list__item__icon">
            <AiOutlineUserAdd />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: "block" } : {}}
          >
            user
          </div>
        </div>
        <div className="container__list__item">
          <div className="container__list__item__icon">
            <MdOutlineInventory />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: "block" } : {}}
          >
            inventory
          </div>
        </div>
        <div className="container__list__item">
          <div className="container__list__item__icon">
            <TbFileInvoice />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: "block" } : {}}
          >
            invoice
          </div>
        </div>
        <div className="container__list__item">
          <div className="container__list__item__icon">
            <AiOutlineShop />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: "block" } : {}}
          >
            Dealer
          </div>
        </div>
        <div className="container__list__item">
          <div className="container__list__item__icon">
            <TbReportMoney />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: "block" } : {}}
          >
            billing
          </div>
        </div>
        <div className="container__list__item">
          <div className="container__list__item__icon">
            <BiPurchaseTagAlt />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: "block" } : {}}
          >
            Purchase
          </div>
        </div>
        <div className="container__list__item">
          <div className="container__list__item__icon">
            <TbTruckReturn />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: "block" } : {}}
          >
            return
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
