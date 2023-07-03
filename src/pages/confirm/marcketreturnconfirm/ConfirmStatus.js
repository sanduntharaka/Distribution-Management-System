import React, { useEffect, useState, forwardRef } from 'react';
import { axiosInstance } from '../../../axiosInstance';
import Modal from '@mui/material/Modal';
import Message from '../../../components/message/Message';
import Spinner from '../../../components/loadingSpinner/Spinner';
import EditBill from './EditBill';
const ConfirmStatus = (props) => {
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    return `${year}-${month}-${day}`;
  });
  const [data, setData] = useState({
    status: '',
    added_by: JSON.parse(sessionStorage.getItem('user')).id,
  });
  const [loading, setLoading] = useState(false);

  const [messageOpen, setMessageOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  //edit-details
  const [editdetailsOpen, setEditDetailsOpen] = useState(false);
  //modal
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const handleConfirm = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .put(`/salesref/return/update/status/${props.invoice.id}`, data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);

        console.log(res);
        props.showEdit(false);
        props.msgErr(false);
        props.msgSuccess(true);
        props.msgTitle('Success');
        props.msg('Bill confirmed successfully');
        props.openMsg(true);
      })
      .catch((err) => {
        setLoading(false);

        console.log(err);
        props.showEdit(false);
        props.msgSuccess(false);
        props.msgErr(true);
        props.msgTitle('Error');
        props.msg('Cannot confirm the details. Please Try again');
        props.openMsg(true);
      });
  };

  const handleCloseConfirm = (e) => {
    e.preventDefault();
    props.closeModal();
    console.log(props);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    axiosInstance
      .delete(`/salesref/return/delete/${props.invoice.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);

        console.log(res);
        props.showEdit(false);
        props.msgErr(false);
        props.msgSuccess(true);
        props.msgTitle('Success');
        props.msg('Bill deleted successfully');
        props.openMsg(true);
      })
      .catch((err) => {
        setLoading(false);

        console.log(err);
        props.showEdit(false);
        props.msgSuccess(false);
        props.msgErr(true);
        props.msgTitle('Error');
        props.msg('Cannot delete the details. Please Try again');
        props.openMsg(true);
      });
  };

  return (
    <div className="confirm_details">
      {loading ? (
        <div className="page-spinner">
          <div className="page-spinner__back">
            <Spinner detail={true} />
          </div>
        </div>
      ) : (
        ''
      )}
      <Modal open={modalOpen} onClose={handleModalClose}>
        {messageOpen ? (
          <Message
            hide={handleModalClose}
            success={success}
            error={error}
            title={title}
            msg={msg}
          />
        ) : (
          <p>No modal</p>
        )}
      </Modal>
      <div className="container">
        <div className="title">
          <h1>Confirm bill</h1>
        </div>
        <div className="details">
          <section className="twosides">
            <div>
              <div className="subtitle">
                <p>Sales ref</p>
              </div>
              <div className="info">
                <p>{props.invoice.added_name}</p>
              </div>
            </div>
            <div>
              <div className="subtitle">
                <p>Dealer</p>
              </div>
              <div className="info">
                <p>{props.invoice.dealer_name}</p>
                <p>{props.invoice.dealer_address}</p>
                <p>{props.invoice.contact_number}</p>
              </div>
            </div>
          </section>
          <section>
            <div className="subtitle">
              <p>Bill details</p>
            </div>
            <div className="info">
              <div className="row">
                <label htmlFor="">status</label>
                <select
                  defaultValue={0}
                  onChange={(e) => setData({ ...data, status: e.target.value })}
                  required
                >
                  <option value="0">Select status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </section>
          <EditBill invoice={props.invoice} />
        </div>
        <div className="buttoncontainer">
          <button className="btnDelete" onClick={(e) => handleDelete(e)}>
            delete
          </button>
          <button className="btnSave" onClick={(e) => handleConfirm(e)}>
            submit
          </button>
          <button className="addBtn" onClick={(e) => handleCloseConfirm(e)}>
            close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmStatus;
