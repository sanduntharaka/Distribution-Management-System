import React, { useState } from 'react';
import { axiosInstance } from '../../../axiosInstance';

const RejectForm = (props) => {
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    return `${year}-${month}-${day}`;
  });
  const [data, setData] = useState({
    status: 'rejected',
    rejected_reason: '',
    confirmed_date: currentDate,
  });
  const [showOtherDetails, setShowOtherDetails] = useState(false);

  const handleReason = (e) => {
    setShowOtherDetails(false);
    if (e.target.value === 'Other') {
      setShowOtherDetails(true);
    } else {
      setData({ ...data, rejected_reason: e.target.value });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    axiosInstance
      .put(
        `/salesref/invoice/create/invoice/confirm/${props.invoice.id}`,
        data,
        {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        }
      )
      .then((res) => {
        props.showEdit(false);
        props.msgErr(false);
        props.msgSuccess(true);
        props.msgTitle('Success');
        props.msg('Bill rejected successfully');
        props.showRejected(false);
        props.openMsg(true);
      })
      .catch((err) => {
        console.log(err);
        props.showEdit(false);
        props.msgSuccess(false);
        props.msgErr(true);
        props.msgTitle('Error');
        props.msg('Cannot rejected the details. Please Try again');
        props.showRejected(false);

        props.openMsg(true);
      });
  };
  return (
    <div className="edit">
      <div className="edit__content">
        <dib className="edit__content__title danger">
          <h4>Rejected form</h4>
        </dib>
        <div className="edit__content__table">
          <div className="form">
            <table>
              <tr>
                <td>Select reason</td>
                <td>
                  <select
                    type="text"
                    value={data.rejected_reason ? data.rejected_reason : ''}
                    onChange={handleReason}
                  >
                    <option value="">Select reason</option>
                    <option value="Shop close">Shop close</option>
                    <option value="Dealer not able to complete payment">
                      Dealer not able to complete payment
                    </option>
                    <option value="No authorized person to hand over">
                      No authorized person to hand over
                    </option>
                    <option value="Can't find shop location">
                      Can't find shop location
                    </option>
                    <option value="Error with billing">
                      Error with billing
                    </option>
                    <option value="Unconfirmed invoice">
                      Unconfirmed invoice
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </td>
              </tr>
              {showOtherDetails ? (
                <tr>
                  <td>Type reason</td>
                  <td>
                    <input
                      type="text"
                      onChange={(e) =>
                        setData({ ...data, rejected_reason: e.target.value })
                      }
                    />
                  </td>
                </tr>
              ) : (
                ''
              )}
            </table>
          </div>
        </div>
        <div className="edit__content__buttons">
          <button className="remBtn" onClick={handleSave}>
            <p>Save</p>
          </button>
          <button className="addBtn">
            <p>Cancel</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectForm;
