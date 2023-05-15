import React, { useState } from 'react';
import { axiosInstance } from '../../axiosInstance';

const PsaEdit = (props) => {
  const [editedData, setEditedData] = useState({
    id: props.data.id,
    area_name: props.data.area_name,
    more_details: props.data.more_details,
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
        props.msg('Psa details edited successfully');
        props.openMsg(true);
      })
      .catch((err) => {
        console.log(err);
        props.showEdit(false);
        props.msgSuccess(false);
        props.msgErr(true);
        props.msgTitle('Error');
        props.msg(
          'Psa details cannot update at the moment. Please try again later'
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
          <h4>Edit Psa Details</h4>
        </dib>
        <div className="edit__content__table">
          <div className="form">
            <table>
              <tr>
                <td>Area Name</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={editedData.area_name}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        area_name: e.target.value,
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

export default PsaEdit;
