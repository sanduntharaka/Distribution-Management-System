import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainChart from './widgets/MainChart';
import InventoryQty from './widgets/InventoryQty';
import ToDaySales from './widgets/ToDaySales';
import ThisMonthSales from './widgets/ThisMonthSales';
import TotalReturns from './widgets/TotalReturns';
import { axiosInstance } from '../../axiosInstance';
import ThisYearSales from './widgets/ThisYearSales';
import ManagerAllDistributorPieChart from './widgets/ManagerAllDistributorPieChart';
import YesterDay from './widgets/YesterDay';
import TotalCredit from './widgets/TotalCredit';
import PendingInvoices from './widgets/PendingInvoices';
import TargetChart from './widgets/TargetChart';
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
  const [nextDealer, setNextDealer] = useState('')
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
    yester_day: {},
    pending: {},
    credit: {},
  });
  const [show, setShow] = useState(false);
  const [planings, setPlanings] = useState([]);



  useEffect(() => {
    if (!userInfo) {
      navigate('login/');
    }
  }, ['']);
  useEffect(() => {
    let date = currentDate;
    if (user.is_company) {
      axiosInstance
        .post(
          `/dashboard/today/company/`,
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
            yester_day: res.data.yester_day,
          });
          console.log(res.data);
        });
    }
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
            yester_day: res.data.yester_day,
          });
          console.log(res.data);
        });
    }
    if (user.is_excecutive) {
      axiosInstance
        .post(
          `/dashboard/today/executive/${userDelails.id}`,
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
            yester_day: res.data.yester_day,
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
            yester_day: res.data.yester_day,
            pending: res.data.pending_inv,
            credit: res.data.credit_inv,
          });
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
          console.log('sr', res.data);
          setData({
            ...data,
            sales: res.data.sales,
            allpendig: res.data.allpendig,
            market_returns: res.data.market_returns,
            sales_returns: res.data.sales_returns,
            this_month: res.data.this_month,
            this_year: res.data.this_year,
            yester_day: res.data.yester_day,
            pending: res.data.pending_inv,
            credit: res.data.credit_inv,
          });
        });
      axiosInstance
        .get(
          `/dashboard/get/next/visit/`,

          {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          }
        )
        .then((res) => {
          console.log('next', res.data);
          setNextDealer(res.data.dealer)
        });
      axiosInstance.get(`/planing/get/${userDelails.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
        .then((res) => {

          setPlanings(res.data)

        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  const [ranges, setRanges] = useState([])
  const [targetData, setTargetData] = useState([])


  useEffect(() => {
    axiosInstance
      .get(`/target/get-ranges/${userDelails.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {

        setRanges(res.data)

      })
      .catch((err) => {
        console.log(err);

      });
  }, [])


  const handleFilter = (i) => {

    if (i !== '') {
      let selected = ranges.find((item) => {
        return item.id === parseInt(i)
      })
      axiosInstance
        .post(`/target/get-details/`,
          {
            date_from: selected.date_from,
            date_to: selected.date_to,
            person: userDelails.id
          },
          {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          })
        .then((res) => {
          setTargetData(res.data)
          console.log('data:', res.data)
        })
        .catch((err) => {
          console.log(err);

        });
    }
  }
  return (
    <div className="page dashboard">
      <div className="page__title">
        <p>Dashboard</p>
      </div>
      <div className="page__pcont">
        {user.is_salesref ? (
          <>
            {/* <div className="page__pcont__row">
              <div className="page__pcont__row__col">
                <div className="planing">
                  <div class="hwrap">
                    <div class="hmove">
                      {
                        planings.map((item, i) => (
                          <div class="hitem" key={i}>{i + 1} {item.name}</div>
                        ))
                      }

                    </div>

                  </div>
                </div>
              </div>
            </div> */}
            <div className="page__pcont__row center">
              <div className="page__pcont__row__col">
                <div className="nextVisit" >
                  Next Visit : {nextDealer}
                </div>
              </div>
            </div>

          </>
        ) : ''}

        <div className="page__pcont__row center">
          <div className="page__pcont__row__col">
            <div className="widget today">
              <ToDaySales data={data.sales} />
            </div>
          </div>

          <div className="page__pcont__row__col ">
            <div className="widget yesterday">
              <YesterDay data={data.yester_day} />
            </div>
          </div>

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
          {user.is_distributor || user.is_salesref ? (
            <div className="page__pcont__row__col">

              <div className="widget">
                <TotalReturns
                  market={data.market_returns}
                  sales={data.sales_returns}
                />
              </div>
            </div>
          ) : (
            ''
          )}
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
            {user.is_manager || user.is_company || user.is_excecutive ? (
              <div className="chart simple_chart">
                {user.is_manager || user.is_excecutive ? (
                  <div className="title">Distributors Sales {monthName}</div>
                ) : user.is_company ? (
                  <div className="title">Manager Sales {monthName}</div>
                ) : (
                  ''
                )}

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
              <div className="title">Sales {year} Per Month</div>
              <MainChart user={user} info={userDelails} />
            </div>
          </div>
        </div>
        {user.is_distributor || user.is_salesref ? (
          <div className="page__pcont__row center">

            <div className="page__pcont__row__col special f4">

              <div className="chart targetChart">
                <div className="title">Targets</div>
                <div className="targetselect">
                  <select defaultValue={''} onClick={(e) => handleFilter(e.target.value)}>
                    <option value="">Select</option>
                    {
                      ranges.map((item, i) => (
                        <option value={item.id} key={i}>{item.date_from} to {item.date_to}</option>
                      ))
                    }
                  </select>
                </div>
                <TargetChart user={user} info={userDelails} data={targetData} />
              </div>
            </div>
          </div>
        ) : ''}
        {user.is_distributor || user.is_salesref ? (
          <div className="page__pcont__row">
            <div className="page__pcont__row__col">
              <div
                style={{
                  height: 'max-content',
                  padding: 25,
                  boxSizing: 'border-box',
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.3)',
                }}
              >
                <PendingInvoices data={data.pending} />
              </div>
            </div>
            <div className="page__pcont__row__col">
              <div
                style={{
                  height: 'max-content',
                  padding: 25,
                  boxSizing: 'border-box',
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.3)',
                }}
              >
                <TotalCredit data={data.credit} />
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default Dashboard;
