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
import { BiPurchaseTagAlt, BiMenu } from 'react-icons/bi';
import { SiPurescript } from 'react-icons/si';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/UserActions';
import UserData from './UserData';

const Sidebar = () => {
  const handleClassname = ({ isActive, isPending }) => {
    // isPending ? "pending" : isActive ? "active" : "";
    const claName = 'container__list__item';
    if (isActive) {
      return claName + ' active';
    } else {
      return claName;
    }
  };

  return (
    <>
      <div className="container">
        <div className="container__header">
          <div className="container__header__brand">
            <p>distributor management system</p>
          </div>
        </div>
        <div className="container__list">
          <NavLink
            to="/"
            className={(isActive, isPending) =>
              handleClassname(isActive, isPending)
            }
          >
            <div className="container__list__item__icon">
              <TbLayoutDashboard />
            </div>
            <div className="container__list__item__name">Dashboard</div>
          </NavLink>
          <NavLink
            to="/user"
            className={(isActive, isPending) =>
              handleClassname(isActive, isPending)
            }
          >
            <div className="container__list__item__icon">
              <AiOutlineUserAdd />
            </div>
            <div className="container__list__item__name">user</div>
          </NavLink>
          <NavLink
            to="/inventory"
            className={(isActive, isPending) =>
              handleClassname(isActive, isPending)
            }
          >
            <div className="container__list__item__icon">
              <MdOutlineInventory />
            </div>
            <div className="container__list__item__name">inventory</div>
          </NavLink>
          <NavLink
            to="/distribution"
            className={(isActive, isPending) =>
              handleClassname(isActive, isPending)
            }
          >
            <div className="container__list__item__icon">
              <TbTruckDelivery />
            </div>
            <div className="container__list__item__name">
              Distribution control
            </div>
          </NavLink>
          {/* <NavLink
          to="/sales"
          className={(isActive, isPending) =>
            handleClassname(isActive, isPending)
          }
        >
          <div className="container__list__item__icon">
            <SiPurescript />
          </div>
          <div
            className="container__list__item__name"
          >
            Sales control
          </div>
        </NavLink> */}
          <NavLink
            to="/psa"
            className={(isActive, isPending) =>
              handleClassname(isActive, isPending)
            }
          >
            <div className="container__list__item__icon">
              <MdRoute />
            </div>
            <div className="container__list__item__name">PSA</div>
          </NavLink>
          {/* <NavLink
          to="/invoice"
          className={(isActive, isPending) =>
            handleClassname(isActive, isPending)
          }
        >
          <div className="container__list__item__icon">
            <TbFileInvoice />
          </div>
          <div
            className="container__list__item__name"
          >
            invoice
          </div>
        </NavLink> */}
          <NavLink
            to="/dealer"
            className={(isActive, isPending) =>
              handleClassname(isActive, isPending)
            }
          >
            <div className="container__list__item__icon">
              <AiOutlineShop />
            </div>
            <div className="container__list__item__name">Dealer</div>
          </NavLink>
          <NavLink
            to="/bill"
            className={(isActive, isPending) =>
              handleClassname(isActive, isPending)
            }
          >
            <div className="container__list__item__icon">
              <TbReportMoney />
            </div>
            <div className="container__list__item__name">billing</div>
          </NavLink>
          <NavLink
            to="/purchase"
            className={(isActive, isPending) =>
              handleClassname(isActive, isPending)
            }
          >
            <div className="container__list__item__icon">
              <BiPurchaseTagAlt />
            </div>
            <div className="container__list__item__name">Purchase</div>
          </NavLink>
          <NavLink
            to="/return"
            className={(isActive, isPending) =>
              handleClassname(isActive, isPending)
            }
          >
            <div className="container__list__item__icon">
              <TbTruckReturn />
            </div>
            <div className="container__list__item__name">return</div>
          </NavLink>
        </div>
        <div className="container__footer">
          <UserData />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
