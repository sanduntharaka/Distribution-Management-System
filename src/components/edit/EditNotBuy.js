import React, { useState } from 'react';
import { axiosInstance } from '../../axiosInstance';
const EditNotBuy = (props) => {
  const editedData = props.data;
  const [data, setData] = useState({
    date: editedData.date,
    added_by: JSON.parse(sessionStorage.getItem('user')).id,
    dealer: editedData.dealer,
    is_only_our: editedData.is_only_our,
    is_competitor: editedData.is_competitor,
    is_payment_problem: editedData.is_payment_problem,
    is_dealer_not_in: editedData.is_dealer_not_in,
  });
  const handleCheckedOnlyOur = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_only_our: true,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_only_our: false,
      });
    }
  };
  const handleCheckedCompetitor = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_competitor: true,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_competitor: false,
      });
    }
  };
  const handleCheckeProblem = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_payment_problem: true,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_payment_problem: false,
      });
    }
  };
  const handleCheckedNotIn = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        is_dealer_not_in: true,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        is_dealer_not_in: false,
      });
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    axiosInstance
      .put(`${props.url}/${editedData.id}`, data, {
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
        props.msg('Your details edited successfully');
        props.openMsg(true);
      })
      .catch((err) => {
        console.log(err);
        props.showEdit(false);
        props.msgSuccess(false);
        props.msgErr(true);
        props.msgTitle('Error');
        props.msg(
          'Your details cannot update at the moment. Please try again later'
        );
        props.openMsg(true);
      });
  };
  const handleCancel = () => {};
  return (
    <div className="edit">
      <div className="edit__content">
        <dib className="edit__content__title">
          <h4>Edit Dealer Details</h4>
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
                <td>Dealer</td>
                <td>
                  <input type="text" value={editedData.dealer_name} disabled />
                </td>
              </tr>
              <tr>
                <td>Reason</td>
              </tr>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    name="onlyour"
                    onChange={(e) => handleCheckedOnlyOur(e)}
                    checked={editedData.is_only_our}
                  />
                </td>
                <td>
                  <label htmlFor="">Have only our goods </label>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    name="competitor"
                    onChange={(e) => handleCheckedCompetitor(e)}
                    checked={editedData.is_competitor}
                  />
                </td>
                <td>
                  <label htmlFor="">Have competitor goods </label>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    name="payproblem"
                    onChange={(e) => handleCheckeProblem(e)}
                    checked={editedData.is_payment_problem}
                  />
                </td>
                <td>
                  <label htmlFor="">payment problem </label>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    name="notin"
                    onChange={(e) => handleCheckedNotIn(e)}
                    checked={editedData.is_dealer_not_in}
                  />
                </td>
                <td>
                  <label htmlFor="">Dealer not in </label>
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

export default EditNotBuy;
