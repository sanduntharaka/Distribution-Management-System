import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/UserActions';
import { axiosInstance } from '../axiosInstance';
const UserData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(
        `/users/get/${JSON.parse(sessionStorage.getItem('user_details')).id}`,
        {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        setData(res.data);
      });
  }, []);
  const handleLogOut = () => {
    dispatch(logout());
    navigate('/');
    window.location.reload(true);
  };

  const handleProfile = () => {
    navigate('/profile');
  };
  return (
    <>
      <div className="container__footer__img">
        <img src={loading === false && data ? data.photo : ''} alt="" />
      </div>
      <div className="container__footer__details">
        <div className="container__footer__details__name">
          <h4>{loading === false && data ? data.full_name : ''}</h4>
          <p>{loading === false && data ? data.designation : ''}</p>
        </div>
        <div className="container__footer__details__buttons">
          <button className="addBtn" onClick={handleProfile}>
            Profile
          </button>
          <button className="remBtn" onClick={handleLogOut}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default UserData;
