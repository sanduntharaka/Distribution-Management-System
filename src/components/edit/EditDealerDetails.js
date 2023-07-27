import React, { useState } from 'react';
import { axiosInstance } from '../../axiosInstance';

const EditDealerDetails = (props) => {
  const [editedData, setEditedData] = useState({
    id: props.data.id,
    name: props.data.name,
    contact_number: props.data.contact_number,
    address: props.data.address,
    grade: props.data.grade,
    owner_name: props.data.owner_name,
    company_number: props.data.company_number,
    owner_personal_number: props.data.owner_personal_number,
    owner_home_number: props.data.owner_home_number,
    assistant_name: props.data.assistant_name,
    assistant_contact_number: props.data.assistant_contact_number,
  });

  const handleEdit = (e) => {
    e.preventDefault();
    axiosInstance
      .put(`/dealer/edit/${props.data.id}`, editedData, {
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
        props.msg('Dealer details edited successfully');
        props.openMsg(true);
      })
      .catch((err) => {
        console.log(err);
        props.showEdit(false);
        props.msgSuccess(false);
        props.msgErr(true);
        props.msgTitle('Error');
        props.msg(
          'Dealer details cannot update at the moment. Please try again later'
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
                <td>Grade</td>
                <td>
                  {/* <input type="text" value={editedData.grade} disabled /> */}
                  <select
                    name=""
                    id=""
                    value={editedData.grade}
                    onChange={(e) =>
                      setEditedData({ ...editedData, grade: e.target.value })
                    }
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Name</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) =>
                      setEditedData({ ...editedData, name: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Contact Number</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={editedData.contact_number}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        contact_number: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Address</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={editedData.address}
                    onChange={(e) =>
                      setEditedData({ ...editedData, address: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Owner Name</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={editedData.owner_name}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        owner_name: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Company Number</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={editedData.company_number}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        company_number: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Personal Number</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={editedData.owner_personal_number}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        owner_personal_number: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Home Number</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={editedData.owner_home_number}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        owner_home_number: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Assistant Name</td>
                <td>
                  <input
                    type="text"
                    value={editedData.assistant_name}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        assistant_name: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Assistant Number</td>
                <td>
                  <input
                    type="text"
                    value={editedData.assistant_contact_number}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        assistant_contact_number: e.target.value,
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

export default EditDealerDetails;
