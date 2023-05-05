import React from 'react';
import { axiosInstance } from '../../axiosInstance';

const DealerDeleteConfirm = (props) => {
  const handleDelete = (e) => {
    e.preventDefault();
    axiosInstance
      .delete(`/dealer/delete/${props.data.id}`, {
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
        props.msg('Dealer deleted successfully');
        props.openMsg(true);
      })
      .catch((err) => {
        console.log(err);
        props.showConfirm(false);
        props.msgSuccess(false);
        props.msgErr(true);
        props.msgTitle('Error');
        props.msg(
          'Dealer cannot delete.Please check this dealer has some recodes in another fields.'
        );
        props.openMsg(true);
      });
  };
  const handleCancel = () => {
    props.closeModal();
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
          <button className="remBtn" onClick={(e) => handleDelete(e)}>
            <p>Delete</p>
          </button>
          <button className="addBtn" onClick={(e) => handleCancel(e)}>
            <p>Cancel</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealerDeleteConfirm;
