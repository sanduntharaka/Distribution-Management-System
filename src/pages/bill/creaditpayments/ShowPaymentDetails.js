import React, { useEffect, useState, forwardRef } from 'react';
import { axiosInstance } from '../../../axiosInstance';
import Modal from '@mui/material/Modal';
import Message from '../../../components/message/Message';
const ShowMessage = forwardRef((props, ref) => {
  return (
    <Message
      hide={() => props.handleClose()}
      success={props.success}
      error={props.error}
      title={props.title}
      msg={props.msg}
      ref={ref}
    />
  );
});
const ShowPaymentDetails = (props) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [invoice, setInvoice] = useState({
    added_by: '',
    code: '',
    paid_amount: '',
    payment_type: '',
    due_date: '',
  });
  const [cheque, setCheque] = useState({});

  useEffect(() => {
    axiosInstance
      .get(`/salesref/invoice/get/invoice/payment/${props.selected.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setInvoice(res.data);
        if (res.data.cheque_id !== null) {
          axiosInstance
            .get(`/salesref/invoice/get/payment/cheque/${res.data.cheque_id}`, {
              headers: {
                Authorization:
                  'JWT ' +
                  JSON.parse(sessionStorage.getItem('userInfo')).access,
              },
            })
            .then((res) => {
              setCheque(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    //   get/invoice/cheque/<id></id>
  }, [success]);
  const handleClosePopup = (e) => {
    e.preventDefault();
    props.showPayment(false);
    props.closeModal();
  };

  const handleConfirem = (e) => {
    axiosInstance
      .put(
        `/salesref/invoice/confirm/cheque/${cheque.id}`,
        { status: 'cleared' },
        {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        }
      )
      .then((res) => {
        setSuccess(true);
        setError(false);
        setTitle('Success');
        setMsg('Your cheque set as cleared status');
        handleOpen();
      })
      .catch((err) => {
        console.log(err);

        setTitle('Error');
        setSuccess(false);
        setError(true);
        setMsg('Your cheque cannot confirm. please try again later.');
        handleOpen();
      });
  };

  const handleReject = (e) => {
    axiosInstance
      .put(
        `/salesref/invoice/confirm/cheque/${cheque.id}`,
        { status: 'return' },
        {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        }
      )
      .then((res) => {
        setSuccess(true);
        setError(false);
        setTitle('Success');
        setMsg('Your cheque set as cleared status');
        handleOpen();
      })
      .catch((err) => {
        console.log(err);

        setTitle('Error');
        setSuccess(false);
        setError(true);
        setMsg('Your cheque cannot confirm. please try again later.');
        handleOpen();
      });
  };

  const handleEdit = (e) => {
    props.setPaymentId(invoice.cheque_id);
    props.showPayment(false);
    props.showEditCheques(true);
  };

  const handleDeletePayment = (e) => {
    axiosInstance
      .delete(`/salesref/invoice/delete/invoice/payment/${invoice.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setSuccess(true);
        setError(false);
        setTitle('Success');
        setMsg('Your payment details deleted successfully');
        handleOpen();
      })
      .catch((err) => {
        console.log(err);

        setTitle('Error');
        setSuccess(false);
        setError(true);
        setMsg('Your cheque cannot confirm. please try again later.');
        handleOpen();
      });
  };
  return (
    <div className="edit_details">
      <Modal open={open} onClose={handleClose}>
        <ShowMessage
          handleClose={handleClose}
          success={success}
          error={error}
          title={title}
          msg={msg}
        />
      </Modal>
      <div className="container">
        <div className="title">
          <h1>Payment details</h1>
        </div>
        <div className="details">
          <section className="twosides">
            <div>
              <div className="subtitle">
                <p>Invoice created by</p>
              </div>
              <div className="info">
                <p>{props.invoice.added_by}</p>
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
          <section className="twosides">
            <section className="payment_details">
              <div className="row">
                <div className="col subtitle">Invoice details</div>
              </div>
              <div className="row info">
                <div className="col">Invoice number:</div>
                <div className="col">{invoice.code}</div>
              </div>
              <div className="row info">
                <div className="col">Added by:</div>
                <div className="col">{invoice.added_by}</div>
              </div>
              <div className="row info">
                <div className="col">Paid amount:</div>
                <div className="col">{invoice.paid_amount}</div>
              </div>
              <div className="row info">
                <div className="col">Payment type:</div>
                <div className="col">{invoice.payment_type}</div>
              </div>
              <div className="row info">
                <div className="col">Payment Due date:</div>
                <div className="col">{invoice.due_date}</div>
              </div>
            </section>
            {invoice.cheque_id ? (
              <section className="payment_details">
                <div className="row">
                  <div className="col subtitle">Cheque details</div>
                </div>
                <div className="row info">
                  <div className="col">Cheque number:</div>
                  <div className="col">{cheque.cheque_number}</div>
                </div>
                <div className="row info">
                  <div className="col">Bank:</div>
                  <div className="col">{cheque.bank}</div>
                </div>
                <div className="row info">
                  <div className="col">Branch:</div>
                  <div className="col">{cheque.branch}</div>
                </div>
                <div className="row info">
                  <div className="col">Number of dates:</div>
                  <div className="col">{cheque.number_of_dates}</div>
                </div>
                <div className="row info">
                  <div className="col">Deposited at:</div>
                  <div className="col">{cheque.deposited_at}</div>
                </div>
                <div className="row info">
                  <div className="col">Status:</div>
                  <div className="col">{cheque.status}</div>
                </div>
              </section>
            ) : (
              ''
            )}
          </section>

          <section></section>
        </div>

        <div className="buttoncontainer">
          {invoice.cheque_id && cheque.status === 'pending' ? (
            <>
              <button
                className="addBtn"
                style={{ background: 'blue' }}
                onClick={(e) => handleConfirem(e)}
              >
                cheque Confirm
              </button>
              <button className="addBtn" onClick={(e) => handleReject(e)}>
                cheque reject
              </button>
            </>
          ) : (
            ''
          )}
          {invoice.cheque_id ? (
            <button className="btnEdit" onClick={(e) => handleEdit(e)}>
              Edit cheque
            </button>
          ) : (
            ''
          )}
          <button className="remBtn" onClick={(e) => handleDeletePayment(e)}>
            delete payment
          </button>
          <button className="btnDelete" onClick={(e) => handleClosePopup(e)}>
            close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowPaymentDetails;
