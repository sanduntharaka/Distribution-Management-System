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
  const user = JSON.parse(sessionStorage.getItem('user'));
  const userDelails = JSON.parse(sessionStorage.getItem('user_details'));

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
          <div className="page__pcont__row__col">
            <div className="widget">
              <ToDaySales date={currentDate} user={user} />
            </div>
          </div>
          <div className="page__pcont__row__col">
            <div className="widget">
              <InventoryStatus date={currentDate} user={user} />
            </div>
          </div>
          <div className="page__pcont__row__col">
            <div className="widget">
              <TotalReturns date={currentDate} user={user} />
            </div>
          </div>
          {/* <div className="page__pcont__row__col">
            <div className="widget"></div>
          </div> */}
        </div>
        <div className="page__pcont__row">
          <div className="page__pcont__row__col f1">
            <div className="dashdetails">
              <SimplePieChart user={user} info={userInfo} />
            </div>
          </div>
          <div className="page__pcont__row__col special f4">
            <div className="chart">
              <div className="title">Last months income</div>
              <MainChart user={user} info={userDelails} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
