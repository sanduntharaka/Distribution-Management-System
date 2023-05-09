import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainChart from './widgets/MainChart';
import SimplePieChart from './widgets/SimplePieChart';
import ToDaySales from './widgets/ToDaySales';
import InventoryStatus from './widgets/InventoryStatus';
import TotalReturns from './widgets/TotalReturns';
const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate() - 1;
    return `${year}-${month}-${day}`;
  });
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!userInfo) {
      console.log('not');
      navigate('login/');
    }
  }, []);
  const handleMsgShow = () => {
    setShow(true);
  };
  const handleMsgHide = () => {
    setShow(false);
  };
  return (
    <div className="page">
      <div className="page__title">
        <p>Dashboard</p>
      </div>
      <div className="page__pcont">
        <div className="page__pcont__row center">
          <div className="page__pcont__col">
            <div className="widget">
              <ToDaySales date={currentDate} />
            </div>
          </div>
          <div className="page__pcont__col">
            <div className="widget">
              <InventoryStatus date={currentDate} />
            </div>
          </div>
          <div className="page__pcont__col">
            <div className="widget">
              <TotalReturns date={currentDate} />
            </div>
          </div>
          <div className="page__pcont__col">
            <div className="widget"></div>
          </div>
        </div>
        <div className="page__pcont__row">
          <div className="page__pcont__col f1">
            <div className="dashdetails">
              <SimplePieChart />
            </div>
          </div>
          <div className="page__pcont__col f4">
            <div className="chart">
              <div className="title">Last moths income</div>
              <MainChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
