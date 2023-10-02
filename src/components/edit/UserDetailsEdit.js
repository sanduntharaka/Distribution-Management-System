import React, { useState } from 'react';
import { axiosInstance } from '../../axiosInstance';
import Modal from '@mui/material/Modal';
import EditTerriotory from './EditTerriotory';
const UserDetailsEdit = (props) => {
  const [editedData, setEditedData] = useState({
    id: props.data.id,
    full_name: props.data.full_name,
    address: props.data.address,
    designation: props.data.designation,
    dob: props.data.dob,
    company_number: props.data.company_number,
    personal_number: props.data.personal_number,
    home_number: props.data.home_number,
    immediate_contact_person_name: props.data.immediate_contact_person_name,
    immediate_contact_person_number: props.data.immediate_contact_person_number,
    terriotory: props.data.terriotory,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

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
  const handleEditTerriotory = (e, value) => {
    e.preventDefault();
    handleModalOpen();
  };
  return (
    <div className="edit">
      <Modal open={modalOpen} onClose={handleModalClose}>

        <EditTerriotory
          closeModal={handleModalClose}
          user={props.data.id}
        />
      </Modal>
      <div className="edit__content">
        <dib className="edit__content__title">
          <h4>Edit Employee Details</h4>
        </dib>
        <div className="edit__content__table">
          <div className="form">
            <table>
              <tr>
                <td>Ids</td>
                <td>
                  <input type="text" value={editedData.id} disabled />
                </td>
              </tr>
              <tr>
                <td>Name</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={editedData.full_name}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        full_name: e.target.value,
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
                    value={editedData.personal_number}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        personal_number: e.target.value,
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
                <td>Home Number</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={editedData.home_number}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        home_number: e.target.value,
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
                <td>Designation</td>
                <td>
                  <select
                    value={editedData.designation ? editedData.designation : ''}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        designation: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Designation</option>

                    {props.user.is_company ? (
                      <>
                        <option value="Company">Company</option>
                        <option value="Executive">Excecutive</option>
                      </>
                    ) : (
                      ''
                    )}
                    {props.user.is_excecutive || props.user.is_company ? (
                      <>
                        <option value="Manager">Manager</option>
                      </>
                    ) : (
                      ''
                    )}
                    {props.user.is_excecutive ||
                      props.user.is_company ||
                      props.user.is_manager ? (
                      <>
                        <option value="Distributor">Distributor</option>
                      </>
                    ) : (
                      ''
                    )}

                    <option value="Sales Rep">Sales Rep</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Territory</td>
                <td>
                  {' '}
                  {/* <input
                    type="text"
                    value={editedData.terriotory}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        terriotory: e.target.value,
                      })
                    }
                  /> */}
                  <button className="btnEdit" onClick={handleEditTerriotory}>Change terriotory</button>
                </td>
              </tr>
              <tr>
                <td>Date of Birth</td>
                <td>
                  {' '}
                  <input
                    type="date"
                    value={editedData.dob}
                    onChange={(e) =>
                      setEditedData({ ...editedData, dob: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Immediate Contact Person Name</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={editedData.immediate_contact_person_name}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        immediate_contact_person_name: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Immediate Contact Person Phone</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={editedData.immediate_contact_person_number}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        immediate_contact_person_number: e.target.value,
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

export default UserDetailsEdit;
