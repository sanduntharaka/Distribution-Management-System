import React, { useEffect, useState, forwardRef } from 'react';
// import './confirmstatus.scss';
import { axiosInstance } from '../../../axiosInstance';
import Modal from '@mui/material/Modal';
import Spinner from '../../../components/loadingSpinner/Spinner';
import Message from '../../../components/message/Message';
import EditBill from './EditBill';
import RejectForm from './RejectForm';
const ConfirmStatus = (props) => {
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    return `${year}-${month}-${day}`;
  });
  const [exceed, setExceed] = useState(false);
  const [invoice, setInvoice] = useState({
    status: '',
    confirmed_date: currentDate,
    payment_type: '',
    paid_amount: 0,
    date: currentDate,
    added_by: JSON.parse(sessionStorage.getItem('user_details')).id,
    due_date: currentDate,
    number_of_dates: 0,
    cheque_number: '',
    branch: '',
    payee_name: props.invoice.dealer_name,
    bank: '',
    amount: 0,
    cheque_date: '',
    deposited_at: currentDate,
    cheque_status: 'cleared',
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
  // useEffect(() => {

  //   if (props.invoice.payment_type === 'cheque') {
  //     setLoading(trye)
  //     axiosInstance
  //       .get(`/salesref/invoice/get/invoice/cheque/${props.invoice.id}`, {
  //         headers: {
  //           Authorization:
  //             'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
  //         },
  //       })
  //       .then((res) => {
  //         console.log(res.data);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }, []);
  const handleConfirm = (e) => {
    e.preventDefault();
    setLoading(true);
    props.showRejected(false);
    props.msgErr(false);
    props.msgSuccess(false);

    axiosInstance
      .put(
        `/salesref/invoice/create/invoice/confirm/${props.invoice.id}`,
        invoice,
        {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setLoading(false);

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

  const handlePayed = (e) => {
    if (e.target.value > props.invoice.total) {
      setExceed(true);
    } else {
      setExceed(false);
      setInvoice({ ...invoice, paid_amount: e.target.value });
    }
  };

  const handleCloseConfirm = (e) => {
    e.preventDefault();
    props.closeModal();
  };

  const handleOpenEditBill = (e) => {
    e.preventDefault();
    setEditDetailsOpen(true);
    setMessageOpen(false);
    handleModalOpen();
  };
  const handleBillStatus = (e) => {
    setInvoice({ ...invoice, status: e.target.value });
    if (e.target.value === 'rejected') {
      props.showEdit(false);
      props.showRejected(true);
    }
  };
  const handleChequePaymentType = (e) => {
    setInvoice({
      ...invoice,
      amount: e.target.value,
      paid_amount: e.target.value,
    });
    if (invoice.payment_type === 'cheque') {
      setInvoice({
        ...invoice,
        paid_amount: e.target.value,
      });
    }
  };
  const MyInvoiceConfirm = React.forwardRef((props, ref) => {
    return (
      <EditBill
        invoice={props.invoice}
        openMsg={props.openMsg}
        msgSuccess={props.msgSuccess}
        msgErr={props.msgErr}
        msgTitle={props.msgTitle}
        msg={props.msg}
        showEdit={props.showEdit}
        closeModal={props.closeModal}
      />
    );
  });

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
        {editdetailsOpen ? (
          <MyInvoiceConfirm
            invoice={props.invoice}
            openMsg={setMessageOpen}
            msgSuccess={setSuccess}
            msgErr={setError}
            msgTitle={setTitle}
            msg={setMsg}
            showEdit={setEditDetailsOpen}
            closeModal={handleModalClose}
          />
        ) : messageOpen ? (
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
                <p>Added by</p>
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
          <section></section>
          <section>
            <div className="subtitle">
              <p>Bill details</p>
            </div>
            <div className="info">
              <div className="row">
                <div className="col">
                  <p>bill no</p>
                  <p>{props.invoice.code}</p>
                </div>
                <div className="col">
                  <p>date</p>
                  <p>{props.invoice.date}</p>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <p>sub total</p>
                  <p>{props.invoice.sub_total}</p>
                </div>
                <div className="col">
                  <p>Total</p>
                  <p>{props.invoice.total}</p>
                </div>
              </div>
              <div className="row">
                <label htmlFor="">Payment status </label>
                <select
                  defaultValue={'0'}
                  name=""
                  id=""
                  onChange={(e) => handleBillStatus(e)}
                >
                  <option value="0">Select payment status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="row">
                <label htmlFor="">Payment type</label>
                <select
                  defaultValue={'0'}
                  name=""
                  id=""
                  onChange={(e) =>
                    setInvoice({ ...invoice, payment_type: e.target.value })
                  }
                >
                  <option value="0">Select payment type</option>
                  <option value="cash">cash</option>
                  <option value="credit">credit</option>
                  <option value="cheque">cheque</option>
                  <option value="cash-credit">cash-credit</option>
                  <option value="cash-cheque">cash-cheque</option>
                  <option value="cheque-credit">cheque-credit</option>
                  <option value="cash-credit-cheque">cash-credit-cheque</option>
                </select>
              </div>
              {exceed ? (
                <div
                  className="row"
                  style={{ color: 'red', fontWeight: 'bold' }}
                >
                  <div className="row">
                    <p>You entered amount exceeded the total amount.</p>
                  </div>
                </div>
              ) : (
                ''
              )}
              {invoice.payment_type === 'cash' ||
              invoice.payment_type === 'cash-credit' ||
              invoice.payment_type === 'cash-cheque' ||
              invoice.payment_type === 'cash-credit-cheque' ? (
                <div className="row">
                  <div className="row">
                    <label htmlFor="">Paid</label>
                    <input type="number" onChange={(e) => handlePayed(e)} />
                  </div>
                </div>
              ) : (
                ''
              )}

              {invoice.payment_type === 'credit' ||
              invoice.payment_type === 'cash-credit' ||
              invoice.payment_type == 'cheque-credit' ||
              invoice.payment_type === 'cash-credit-cheque' ? (
                <section>
                  <div className="subtitle">
                    <p>Add credit details</p>
                  </div>
                  <div className="info">
                    <div className="row">
                      <label htmlFor="">Due date</label>
                      <input
                        type="date"
                        onChange={(e) =>
                          setInvoice({
                            ...invoice,
                            due_date: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </section>
              ) : (
                ''
              )}
              {invoice.payment_type === 'cheque' ||
              invoice.payment_type === 'cash-cheque' ||
              invoice.payment_type == 'cheque-credit' ||
              invoice.payment_type === 'cash-credit-cheque' ? (
                <section>
                  <div className="subtitle">
                    <p>Add cheque status</p>
                  </div>
                  <div className="info">
                    {/*<div className="row">
                      <label htmlFor="">Diposited date</label>
                      <input
                        type="date"
                        onChange={(e) =>
                          setInvoice({
                            ...invoice,
                            deposited_at: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                     <div className="row">
                      <label htmlFor="">status</label>
                      <select
                        onChange={(e) =>
                          setInvoice({
                            ...invoice,
                            cheque_status: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="pending">pending</option>
                        <option value="cleared">cleared</option>
                        <option value="return">return</option>
                      </select>
                    </div> */}
                    <div className="row">
                      <div
                        className="col"
                        style={{ display: 'flex', flexDirection: 'column' }}
                      >
                        <label>Cheque Number</label>

                        <input
                          type="text"
                          onChange={(e) =>
                            setInvoice({
                              ...invoice,
                              cheque_number: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div
                        className="col"
                        style={{ display: 'flex', flexDirection: 'column' }}
                      >
                        <label>Bank</label>

                        <input
                          type="text"
                          onChange={(e) =>
                            setInvoice({ ...invoice, bank: e.target.value })
                          }
                        />
                      </div>
                      <div
                        className="col"
                        style={{ display: 'flex', flexDirection: 'column' }}
                      >
                        <label>Branch</label>

                        <input
                          type="text"
                          onChange={(e) =>
                            setInvoice({
                              ...invoice,
                              branch: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="row">
                      {/* <div className="col">
                        <label>Payee name</label>

                        <input
                          type="text"
                          onChange={(e) =>
                            setInvoice({
                              ...invoice,
                              payee_name: e.target.value,
                            })
                          }
                        />
                      </div> */}
                      <div
                        className="col"
                        style={{ display: 'flex', flexDirection: 'column' }}
                      >
                        <label>Cheque date</label>

                        <input
                          type="date"
                          onChange={(e) =>
                            setInvoice({
                              ...invoice,
                              cheque_date: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div
                        className="col"
                        style={{ display: 'flex', flexDirection: 'column' }}
                      >
                        <label>No of dates</label>

                        <input
                          type="number"
                          onChange={(e) =>
                            setInvoice({
                              ...invoice,
                              number_of_dates: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div
                        className="col"
                        style={{ display: 'flex', flexDirection: 'column' }}
                      >
                        <label>Amount</label>

                        <input
                          type="number"
                          onChange={(e) => handleChequePaymentType(e)}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              ) : (
                ''
              )}
            </div>
          </section>
        </div>
        <div className="buttoncontainer">
          <button className="btnSave" onClick={(e) => handleConfirm(e)}>
            submit
          </button>
          <button className="btnEdit" onClick={(e) => handleOpenEditBill(e)}>
            edit
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
