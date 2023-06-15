import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainChart from './widgets/MainChart';
import InventoryQty from './widgets/InventoryQty';
import ToDaySales from './widgets/ToDaySales';
import ThisMonthSales from './widgets/ThisMonthSales';
import TotalMarketReturns from './widgets/TotalMarketReturns';
import { axiosInstance } from '../../axiosInstance';
import TotalSalesReturns from './widgets/TotalSalesReturns';
import ThisYearSales from './widgets/ThisYearSales';
import ManagerAllDistributorPieChart from './widgets/ManagerAllDistributorPieChart';
const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    return `${year}-${month}-${day}`;
  });
  const date = new Date(currentDate);
  const monthName = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  const user = JSON.parse(sessionStorage.getItem('user'));
  const userDelails = JSON.parse(sessionStorage.getItem('user_details'));

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();
  const [data, setData] = useState({
    sales: {},
    allpendig: 0,
    market_returns: 0,
    sales_returns: 0,
    this_month: {},
    this_year: {},
  });
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!userInfo) {
      console.log('not');
      navigate('login/');
    }
  }, []);

  useEffect(() => {
    let date = currentDate;
    if (user.is_manager) {
      axiosInstance
        .post(
          `/dashboard/today/manager/${userDelails.id}`,
          {
            date: date,
          },
          {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          }
        )
        .then((res) => {
          setData({
            ...data,
            sales: res.data.sales,
            allpendig: res.data.allpendig,
            market_returns: res.data.market_returns,
            sales_returns: res.data.sales_returns,
            this_month: res.data.this_month,
            this_year: res.data.this_year,
          });
          console.log(res.data);
        });
    }
    if (user.is_distributor) {
      axiosInstance
        .post(
          `/dashboard/today/distributor/${userDelails.id}`,
          {
            date: date,
          },
          {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          }
        )
        .then((res) => {
          setData({
            ...data,
            sales: res.data.sales,
            allpendig: res.data.allpendig,
            market_returns: res.data.market_returns,
            sales_returns: res.data.sales_returns,
            this_month: res.data.this_month,
            this_year: res.data.this_year,
          });
          console.log(res.data);
        });
    }
    if (user.is_salesref) {
      axiosInstance
        .post(
          `/dashboard/today/salesref/${userDelails.id}`,
          {
            date: date,
          },
          {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          }
        )
        .then((res) => {
          setData({
            ...data,
            sales: res.data.sales,
            allpendig: res.data.allpendig,
            market_returns: res.data.market_returns,
            sales_returns: res.data.sales_returns,
            this_month: res.data.this_month,
            this_year: res.data.this_year,
          });
          console.log(res.data);
        });
    }
  }, []);
  const handleMsgShow = () => {
    setShow(true);
  };
  const handleMsgHide = () => {
    setShow(false);
  };
  return (
    <div className="page dashboard">
      <div className="page__title">
        <p>Dashboard</p>
      </div>
      <div className="page__pcont">
        <div className="page__pcont__row center">
          <div className="page__pcont__row__col">
            <div className="widget">
              <ToDaySales data={data.sales} />
            </div>
          </div>
          {user.is_distributor || user.is_salesref ? (
            <div className="page__pcont__row__col">
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 15 }}
              >
                <div className="widget returns">
                  <TotalMarketReturns data={data.market_returns} />
                </div>
                <div className="widget returns">
                  <TotalSalesReturns data={data.sales_returns} />
                </div>
              </div>
            </div>
          ) : (
            ''
          )}

          <div className="page__pcont__row__col ">
            <div className="widget thismonth">
              <ThisMonthSales data={data.this_month} month={monthName} />
            </div>
          </div>
          <div className="page__pcont__row__col ">
            <div className="widget thisyear">
              <ThisYearSales data={data.this_year} year={year} />
            </div>
          </div>
        </div>
        <div className="page__pcont__row center">
          <div className="page__pcont__row__col f1">
            {user.is_distributor || user.is_salesref ? (
              <div className="dashdetails">
                <InventoryQty user={user} info={userDelails} />
              </div>
            ) : (
              ''
            )}
            {user.is_manager ? (
              <div className="chart simple_chart">
                <div className="title">Distributors sales {monthName}</div>
                <ManagerAllDistributorPieChart
                  user={user}
                  info={userDelails}
                  date={currentDate}
                />
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="page__pcont__row__col special f4">
            <div className="chart">
              <div className="title">Sales {year} per month</div>
              <MainChart user={user} info={userDelails} />
            </div>
          </div>
        </div>

        {/* <div className="page__pcont__row">
          <div className="page__pcont__row__col">
            <div style={{ height: 400, border: '1px solid black' }}>
              Pending invoices
            </div>
          </div>
          <div className="page__pcont__row__col">
            <div style={{ height: 400, border: '1px solid black' }}>
              Credit bills
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
