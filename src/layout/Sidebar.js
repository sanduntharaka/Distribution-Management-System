import React, { useState } from 'react';
import {
  AiOutlineUserAdd,
  AiOutlineShop,
  AiOutlineFieldTime,
} from 'react-icons/ai';

import { MdOutlineInventory, MdRoute } from 'react-icons/md';
import {
  TbLayoutDashboard,
  TbReportMoney,
  TbTruckReturn,
  TbTruckDelivery,
  TbReportSearch,
} from 'react-icons/tb';
import { TiArrowBackOutline } from 'react-icons/ti';
import { BsListTask } from 'react-icons/bs';

import { FiSettings } from 'react-icons/fi';

import { BiPurchaseTagAlt, BiHistory, BiTargetLock } from 'react-icons/bi';
import { GiCheckedShield } from 'react-icons/gi';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/UserActions';
import UserData from './UserData';

const Sidebar = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
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
        <div className="container__logo">
          <img src="./images/Bixton_logo.png" alt="" />
        </div>
        <div className="container__header">
          <div className="container__header__brand">
            <p>BIXTON DISTRIBUTORS</p>
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
          {
            user.is_manager ? (
              <NavLink
                to="/planing"
                className={(isActive, isPending) =>
                  handleClassname(isActive, isPending)
                }
              >
                <div className="container__list__item__icon">
                  <BsListTask />
                </div>
                <div className="container__list__item__name">planing</div>
              </NavLink>
            ) : (
              ''
            )}
          {
            user.is_salesref ? (
              <NavLink
                to="/srep-planing"
                className={(isActive, isPending) =>
                  handleClassname(isActive, isPending)
                }
              >
                <div className="container__list__item__icon">
                  <BsListTask />
                </div>
                <div className="container__list__item__name">My planing</div>
              </NavLink>
            ) : (
              ''
            )}
          {
            user.is_manager ? (
              <NavLink
                to="/targets"
                className={(isActive, isPending) =>
                  handleClassname(isActive, isPending)
                }
              >
                <div className="container__list__item__icon">
                  <BiTargetLock />
                </div>
                <div className="container__list__item__name">Targets</div>
              </NavLink>
            ) : (
              ''
            )}
          {user.is_superuser ||
            user.is_excecutive ||
            user.is_manager ||
            user.is_distributor ||
            user.is_company ? (
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
          ) : (
            ''
          )}

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

          {/* {user.is_manager || user.is_superuser ? (
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
          ) : (
            ''
          )} */}

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
            to="/past"
            className={(isActive, isPending) =>
              handleClassname(isActive, isPending)
            }
          >
            <div className="container__list__item__icon">
              <BiHistory />
            </div>
            <div className="container__list__item__name">
              Distributor debtors
            </div>
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
            <div className="container__list__item__name">Non-buying</div>
          </NavLink>
          <NavLink
            to="/mreturn"
            className={(isActive, isPending) =>
              handleClassname(isActive, isPending)
            }
          >
            <div className="container__list__item__icon">
              <TbTruckReturn />
            </div>
            <div className="container__list__item__name">market return</div>
          </NavLink>

          <NavLink
            to="/sreturn"
            className={(isActive, isPending) =>
              handleClassname(isActive, isPending)
            }
          >
            <div className="container__list__item__icon">
              <TiArrowBackOutline />
            </div>
            <div className="container__list__item__name">sales return</div>
          </NavLink>
          {/* 
          <NavLink
            to="/leave"
            className={(isActive, isPending) =>
              handleClassname(isActive, isPending)
            }
          >
            <div className="container__list__item__icon">
              <AiOutlineFieldTime />
            </div>
            <div className="container__list__item__name">leave</div>
          </NavLink> */}

          <NavLink
            to="/report"
            className={(isActive, isPending) =>
              handleClassname(isActive, isPending)
            }
          >
            <div className="container__list__item__icon">
              <TbReportSearch />
            </div>
            <div className="container__list__item__name">reports</div>
          </NavLink>

          {user.is_company ? (
            <NavLink
              to="/settings"
              className={(isActive, isPending) =>
                handleClassname(isActive, isPending)
              }
            >
              <div className="container__list__item__icon">
                <FiSettings />
              </div>
              <div className="container__list__item__name">settings</div>
            </NavLink>
          ) : (
            ''
          )}
        </div>
        <div className="container__footer">
          <UserData />
        </div>
      </div>
    </>
  );
};

export default Sidebar;