import React, { useState } from 'react';
import { axiosInstance } from '../../axiosInstance';

const EditOldInv = (props) => {
  const [editedData, setEditedData] = useState({
    id: props.data.id,
    balance_amount: props.data.balance_amount,
    customer_name: props.data.customer_name,
    inv_date: props.data.inv_date,
    inv_number: props.data.inv_number,
    original_amount: props.data.original_amount,
    paid_amount: props.data.paid_amount,
  });

  const handleEdit = (e) => {
    e.preventDefault();
    axiosInstance
      .put(`/pastinv/inv/update/${props.data.id}`, editedData, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res);
        props.showEdit(false);
        props.msgErr(false);
        props.msgSuccess(true);
        props.msgTitle('Success');
        props.msg('Invoice details edited successfully');
        props.openMsg(true);
      })
      .catch((err) => {
        console.log(err);
        props.showEdit(false);
        props.msgSuccess(false);
        props.msgErr(true);
        props.msgTitle('Error');
        props.msg(
          'Invoice details cannot update at the moment. Please try again later'
        );
        props.openMsg(true);
      });
  };

  const handleCancel = () => {
    props.closeModal();
  };
  return (
    <div className="edit">
      <div className="edit__content">
        <dib className="edit__content__title">
          <h4>Edit Old Invoice Details</h4>
        </dib>
        <div className="edit__content__table">
          <div className="form">
            <table>
              <tr>
                <td>Id</td>
                <td>
                  <input type="text" value={editedData.id} disabled />
                </td>
              </tr>
              <tr>
                <td>Customer Name</td>
                <td>
                  <input
                    type="text"
                    value={editedData.customer_name}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        customer_name: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Invoice number</td>
                <td>
                  <input
                    type="text"
                    value={editedData.inv_number}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        inv_number: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Date</td>
                <td>
                  {' '}
                  <input
                    type="date"
                    value={editedData.inv_date}
                    onChange={(e) =>
                      setEditedData({ ...editedData, inv_date: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Original amount</td>
                <td>
                  {' '}
                  <input
                    type="number"
                    value={editedData.original_amount}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        original_amount: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Paid amount</td>
                <td>
                  {' '}
                  <input
                    type="number"
                    value={editedData.paid_amount}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        paid_amount: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Balance amount</td>
                <td>
                  {' '}
                  <input
                    type="number"
                    value={editedData.balance_amount}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        balance_amount: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="edit__content__buttons">
          <button className="remBtn" onClick={(e) => handleEdit(e)}>
            Save
          </button>
          <button className="addBtn" onClick={handleCancel}>
            close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOldInv;
