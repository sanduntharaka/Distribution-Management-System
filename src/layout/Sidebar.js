import React, { useState } from 'react';
import { AiOutlineUserAdd, AiOutlineShop } from 'react-icons/ai';
import { MdOutlineInventory, MdRoute } from 'react-icons/md';
import {
  TbFileInvoice,
  TbLayoutDashboard,
  TbReportMoney,
  TbTruckReturn,
  TbTruckDelivery,
} from 'react-icons/tb';
import { BiPurchaseTagAlt } from 'react-icons/bi';
import { SiPurescript } from 'react-icons/si';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/UserActions';

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleShowHideSidebar = () => {
    if (showSidebar === false) {
      setShowSidebar(true);
    } else {
      setShowSidebar(false);
    }
  };

  const handleClassname = ({ isActive, isPending }) => {
    // isPending ? "pending" : isActive ? "active" : "";
    const claName = 'container__list__item';
    if (isActive) {
      return claName + ' active';
    } else {
      return claName;
    }
  };

  const handleLogOut = () => {
    dispatch(logout());
    navigate('/');
  };
  return (
    <div
      className="container"
      onClick={handleShowHideSidebar}
      style={showSidebar ? { width: '300px' } : {}}
    >
      <div
        className="container__header"
        style={showSidebar ? { display: 'flex' } : {}}
      >
        <div
          className="container__header__brand"
          style={showSidebar ? { display: 'revert' } : {}}
        >
          <p>distributor management system</p>
        </div>
      </div>
      <div className="container__list">
        <NavLink
          to="/"
          className={(isActive, isPending) =>
            handleClassname(isActive, isPending)
          }
          style={showSidebar ? { padding: '10px 20px' } : {}}
        >
          <div className="container__list__item__icon">
            <TbLayoutDashboard />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: 'block' } : {}}
          >
            Dashboard
          </div>
        </NavLink>
        <NavLink
          to="/user"
          className={(isActive, isPending) =>
            handleClassname(isActive, isPending)
          }
          style={showSidebar ? { padding: '10px 20px' } : {}}
        >
          <div className="container__list__item__icon">
            <AiOutlineUserAdd />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: 'block' } : {}}
          >
            user
          </div>
        </NavLink>
        <NavLink
          to="/inventory"
          className={(isActive, isPending) =>
            handleClassname(isActive, isPending)
          }
          style={showSidebar ? { padding: '10px 20px' } : {}}
        >
          <div className="container__list__item__icon">
            <MdOutlineInventory />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: 'block' } : {}}
          >
            inventory
          </div>
        </NavLink>
        <NavLink
          to="/distribution"
          className={(isActive, isPending) =>
            handleClassname(isActive, isPending)
          }
          style={showSidebar ? { padding: '10px 20px' } : {}}
        >
          <div className="container__list__item__icon">
            <TbTruckDelivery />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: 'block' } : {}}
          >
            Distribution control
          </div>
        </NavLink>
        {/* <NavLink
          to="/sales"
          className={(isActive, isPending) =>
            handleClassname(isActive, isPending)
          }
          style={showSidebar ? { padding: '10px 20px' } : {}}
        >
          <div className="container__list__item__icon">
            <SiPurescript />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: 'block' } : {}}
          >
            Sales control
          </div>
        </NavLink> */}
        <NavLink
          to="/psa"
          className={(isActive, isPending) =>
            handleClassname(isActive, isPending)
          }
          style={showSidebar ? { padding: '10px 20px' } : {}}
        >
          <div className="container__list__item__icon">
            <MdRoute />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: 'block' } : {}}
          >
            PSA
          </div>
        </NavLink>
        {/* <NavLink
          to="/invoice"
          className={(isActive, isPending) =>
            handleClassname(isActive, isPending)
          }
          style={showSidebar ? { padding: '10px 20px' } : {}}
        >
          <div className="container__list__item__icon">
            <TbFileInvoice />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: 'block' } : {}}
          >
            invoice
          </div>
        </NavLink> */}
        <NavLink
          to="/dealer"
          className={(isActive, isPending) =>
            handleClassname(isActive, isPending)
          }
          style={showSidebar ? { padding: '10px 20px' } : {}}
        >
          <div className="container__list__item__icon">
            <AiOutlineShop />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: 'block' } : {}}
          >
            Dealer
          </div>
        </NavLink>
        <NavLink
          to="/bill"
          className={(isActive, isPending) =>
            handleClassname(isActive, isPending)
          }
          style={showSidebar ? { padding: '10px 20px' } : {}}
        >
          <div className="container__list__item__icon">
            <TbReportMoney />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: 'block' } : {}}
          >
            billing
          </div>
        </NavLink>
        <NavLink
          to="/purchase"
          className={(isActive, isPending) =>
            handleClassname(isActive, isPending)
          }
          style={showSidebar ? { padding: '10px 20px' } : {}}
        >
          <div className="container__list__item__icon">
            <BiPurchaseTagAlt />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: 'block' } : {}}
          >
            Purchase
          </div>
        </NavLink>
        <NavLink
          to="/return"
          className={(isActive, isPending) =>
            handleClassname(isActive, isPending)
          }
          style={showSidebar ? { padding: '10px 20px' } : {}}
        >
          <div className="container__list__item__icon">
            <TbTruckReturn />
          </div>
          <div
            className="container__list__item__name"
            style={showSidebar ? { display: 'block' } : {}}
          >
            return
          </div>
        </NavLink>
      </div>
      <div
        className="container__footer"
        style={showSidebar ? { width: '300px' } : {}}
      >
        <div className="container__footer__img">
          <img src="./images/profile.jpg" alt="" />
        </div>
        <div
          className="container__footer__details"
          style={
            showSidebar
              ? { display: 'revert', transition: 'all 0.3s ease' }
              : {}
          }
        >
          <div className="container__footer__details__name">
            <h4>Mr Sandun tharaka</h4>
            <p>Manager</p>
          </div>
          <div className="container__footer__details__buttons">
            <button className="addBtn">Profile</button>
            <button className="remBtn" onClick={handleLogOut}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
