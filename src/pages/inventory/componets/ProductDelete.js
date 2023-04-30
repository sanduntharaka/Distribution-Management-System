import React from 'react';
import { axiosInstance } from '../../../axiosInstance';
const ProductDelete = (props) => {
  const handleClickDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    axiosInstance
      .delete(`/company/inventory/delete/${props.data}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        props.error(false);
        props.success(true);
        props.msg('Your data has been deleted successfully.');
        props.title('success');
        props.closeCurrent();
        props.openMessage();
      })
      .catch((err) => {
        console.log(err);
        props.success(false);
        props.error(true);
        props.msg(
          'Your data cannot delete. Please check your data and try again.'
        );
        props.title('Error');
        props.closeCurrent();
        props.openMessage();
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

export default ProductDelete;
