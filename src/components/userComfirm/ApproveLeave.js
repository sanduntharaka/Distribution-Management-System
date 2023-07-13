import React, { useState } from 'react';
import { axiosInstance } from '../../axiosInstance';
import Spinner from '../loadingSpinner/Spinner';

const ApproveLeave = (props) => {
  const [loading, setLoading] = useState(false);
  const data = {
    approved_by: JSON.parse(sessionStorage.getItem('user_details')).id,
    approved: true,
  };

  const handleClickDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    axiosInstance
      .put(`${props.url}/${props.data.id}`, data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
        timeout: 50000,
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        props.showConfirm(false);
        props.msgErr(false);
        props.msgSuccess(true);
        props.msgTitle('Success');
        props.msg('Your approved successfully');
        props.openMsg(true);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);

        props.showConfirm(false);
        props.msgSuccess(false);
        props.msgErr(true);
        props.msgTitle('Error');
        props.msg('Cannot approve your details.Please try again.');
        props.openMsg(true);
      });
  };

  const handleClose = () => {
    props.closeModal();
  };
  return (
    <div className="confirm">
      <div className="confirm__content">
        <dib className="confirm__content__title">
          <h4>Are you sure?</h4>
        </dib>
        <div className="confirm__content__details">
          <p>Do you want to approve these leave.</p>
        </div>

        <div className="confirm__content__buttons">
          <button className="btnEdit" onClick={handleClickDelete}>
            <p>Approve</p>
          </button>
          <button className="addBtn" onClick={handleClose}>
            <p>Cancel</p>
          </button>
          {loading ? <Spinner page={true} /> : ''}
        </div>
      </div>
    </div>
  );
};
export default ApproveLeave;
