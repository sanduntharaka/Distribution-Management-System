import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './dashboard.scss';
import MainChart from './widgets/MainChart';
import SimplePieChart from './widgets/SimplePieChart';
const Dashboard = () => {
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
        <div className="page__pcont__row">
          <div className="page__pcont__col">
            <div className="widget"></div>
          </div>
          <div className="page__pcont__col">
            <div className="widget"></div>
          </div>
          <div className="page__pcont__col">
            <div className="widget"></div>
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
              <MainChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
