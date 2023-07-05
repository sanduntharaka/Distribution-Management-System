import React from 'react';
import { axiosInstance } from '../../axiosInstance';
const ReturnDelete = (props) => {
  const handleClickDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    axiosInstance
      .delete(`${props.url}/${props.data.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res);
        props.showConfirm(false);
        props.msgErr(false);
        props.msgSuccess(true);
        props.msgTitle('Success');
        props.msg('Return data deleted successfully');
        props.openMsg(true);
      })
      .catch((err) => {
        console.log(err);
        props.showConfirm(false);
        props.msgSuccess(false);
        props.msgErr(true);
        props.msgTitle('Error');
        props.msg(
          'Cannot delete return details.Please check this item has some recodes in another fields.'
        );
        props.openMsg(true);
      });
  };
  return (
    <div className="confirm">
      <div className="confirm__content">
        <dib className="confirm__content__title">
          <h4>Are you sure?</h4>
        </dib>
        <div className="confirm__content__details">
          <p>
            Do you want to delete these details. Onece you delete data you will
            not be able to recover.
          </p>
        </div>
        <div className="confirm__content__buttons">
          <button className="remBtn" onClick={handleClickDelete}>
            <p>Delete</p>
          </button>
          <button className="addBtn">
            <p>Cancel</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnDelete;