import React, { useState } from 'react';
import { axiosInstance } from '../../axiosInstance';

const EditLeave = (props) => {
  const [editedData, setEditedData] = useState({
    id: props.data.id,
    is_annual: props.data.is_annual,
    is_casual: props.data.is_casual,
    leave_apply_date: props.data.leave_apply_date,
    is_sick: props.data.is_sick,
    leave_end_date: props.data.leave_end_date,
    leave_status: props.data.leave_status,
    leave_type: props.data.leave_type,
    number_of_dates: props.data.number_of_dates,
    reason: props.data.reason,
    created_by: props.data.created_by,
    return_to_work: props.data.return_to_work,
    salesref: props.data.salesref,
  });
  const handleEdit = (e) => {
    e.preventDefault();
    axiosInstance
      .put(`${props.url}/${props.data.id}`, editedData, {
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
        props.msg('Employee details edited successfully');
        props.openMsg(true);
      })
      .catch((err) => {
        console.log(err);
        props.showEdit(false);
        props.msgSuccess(false);
        props.msgErr(true);
        props.msgTitle('Error');
        props.msg(
          'Employee details cannot update at the moment. Please try again later'
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
          <h4>Edit Employee Leave</h4>
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
                <td>Leave Apply Date</td>
                <td>
                  {' '}
                  <input
                    type="date"
                    value={editedData.leave_apply_date}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        leave_apply_date: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Leave End Date</td>
                <td>
                  {' '}
                  <input
                    type="date"
                    value={editedData.leave_end_date}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        leave_end_date: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Leave Type</td>
                <td style={{ display: 'flex', flexDirection: 'row' }}>
                  <input
                    type="checkbox"
                    name="onlyour"
                    checked={editedData.is_annual}
                    // onChange={(e) => handleCheckedAnual(e)}
                  />
                  <p>Annual</p>
                </td>
              </tr>
              <tr>
                <td></td>
                <td style={{ display: 'flex', flexDirection: 'row' }}>
                  <input
                    type="checkbox"
                    name="onlyour"
                    checked={editedData.is_casual}
                    // onChange={(e) => handleCheckedAnual(e)}
                  />
                  <p>Cassual</p>
                </td>
              </tr>
              <tr>
                <td></td>
                <td style={{ display: 'flex', flexDirection: 'row' }}>
                  <input
                    type="checkbox"
                    name="onlyour"
                    checked={editedData.is_sick}
                    // onChange={(e) => handleCheckedAnual(e)}
                  />
                  <p>Sick</p>
                </td>
              </tr>
              <tr>
                <td>Return to Work</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={editedData.return_to_work}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        return_to_work: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Number of Dates</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={editedData.number_of_dates}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        number_of_dates: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Reason</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={editedData.reason}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        reason: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="edit__content__buttons">
          <button className="remBtn" onClick={(e) => handleEdit(e)} disabled>
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

export default EditLeave;
