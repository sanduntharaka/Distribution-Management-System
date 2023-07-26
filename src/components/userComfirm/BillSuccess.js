import React, { useState } from 'react';
import { axiosInstance } from '../../axiosInstance';
import Spinner from '../loadingSpinner/Spinner';
import {
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaRegHandPointUp,
} from 'react-icons/fa';
const BillSuccess = (props) => {
  const [loading, setLoading] = useState(false);
  const data = {
    approved_by: JSON.parse(sessionStorage.getItem('user_details')).id,
    approved: true,
  };

  const handleClickPrint = (e) => {
    props.print();
    props.hide();
    props.clear();
  };

  const handleClick = () => {
    props.hide();
    props.clear();
  };
  return (
    <div className="msg" onClick={handleClick}>
      <div className="msg__content">
        <div className="msg__content__icon">
          {props.success ? (
            <FaRegThumbsUp color="green" />
          ) : props.error ? (
            <FaRegThumbsDown color="red" />
          ) : props.details ? (
            <FaRegHandPointUp color="blue" />
          ) : (
            ''
          )}
        </div>
        <div className="msg__content__title">{props.title}</div>
        <div className="msg__content__details">{props.msg}</div>
        <div className="msg__content__buttons">
          {props.success ? (
            <button className="btnSave" onClick={handleClickPrint}>
              <p>Print</p>
            </button>
          ) : (
            ''
          )}

          <button className="addBtn" onClick={handleClick}>
            <p>close</p>
          </button>
          {loading ? <Spinner page={true} /> : ''}
        </div>
      </div>
    </div>
  );
};
export default BillSuccess;
