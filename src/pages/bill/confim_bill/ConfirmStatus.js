import React, { useEffect, useState } from 'react';
import './confirmstatus.scss';
import { axiosInstance } from '../../../axiosInstance';

const ConfirmStatus = (props) => {
  const [cheque, setCheque] = useState({
    deposited_at: '',
    status: '',
  });
  const [chequeDetails, setChequeDetails] = useState({
    account_number: '',
    payee_name: '',
    amount: '',
    date: '',
  });
  useEffect(() => {
    if (props.invoice.payment_type === 'cheque') {
      axiosInstance
        .get(`/salesref/invoice/get/invoice/cheque/${props.invoice.id}`, {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        })
        .then((res) => {
          console.log(res.data);
          setChequeDetails(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  const handleConfirm = (e) => {
    e.preventDefault();
    axiosInstance
      .put(
        `/salesref/invoice/create/invoice/confirm/${props.invoice.id}`,
        { status: 'confirmed' },
        {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        }
      )
      .then((res) => {
        if (props.invoice.payment_type === 'cheque') {
          axiosInstance
            .put(
              `/salesref/invoice/create/invoice/cheque/confirm/${chequeDetails.id}`,
              cheque,
              {
                headers: {
                  Authorization:
                    'JWT ' +
                    JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
              }
            )
            .then((res) => {
              console.log(res);
              props.showEdit(false);
              props.msgErr(false);
              props.msgSuccess(true);
              props.msgTitle('Success');
              props.msg('Bill confirmed successfully');
              props.openMsg(true);
            })
            .catch((err) => {
              console.log(err);
              props.showEdit(false);
              props.msgSuccess(false);
              props.msgErr(true);
              props.msgTitle('Error');
              props.msg('Cannot confirm the details. Please Try again');
              props.openMsg(true);
            });
        }
        props.showEdit(false);
        props.msgErr(false);
        props.msgSuccess(true);
        props.msgTitle('Success');
        props.msg('Bill confirmed successfully');
        props.openMsg(true);
      })
      .catch((err) => {
        console.log(err);
        props.showEdit(false);
        props.msgSuccess(false);
        props.msgErr(true);
        props.msgTitle('Error');
        props.msg('Cannot confirm the details. Please Try again');
        props.openMsg(true);
      });
  };

  const handleReject = (e) => {
    e.preventDefault();
    axiosInstance
      .put(
        `/salesref/invoice/create/invoice/confirm/${props.invoice.id}`,
        { status: 'rejected' },
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
        props.openMsg(true);
      })
      .catch((err) => {
        console.log(err);
        props.showEdit(false);
        props.msgSuccess(false);
        props.msgErr(true);
        props.msgTitle('Error');
        props.msg('Cannot reject the details. Please Try again');
        props.openMsg(true);
      });
  };

  const handleCloseConfirm = (e) => {
    e.preventDefault();
    props.closeModal();
    console.log(props);
  };

  return (
    <div className="confirm_details">
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
                <p>{props.invoice.sales_ref}</p>
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
                <div className="col">
                  <p>payment type</p>
                  <p>{props.invoice.payment_type}</p>
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
              {props.invoice.payment_type === 'cheque' ? (
                <>
                  <section>
                    <div className="subtitle">
                      <p>Cheque details</p>
                    </div>
                    <div className="info">
                      <div className="row">
                        <div className="col">
                          <p>Account no</p>
                          <p>{chequeDetails.account_number}</p>
                        </div>
                        <div className="col">
                          <p>Payee</p>
                          <p>{chequeDetails.payee_name}</p>
                        </div>
                        <div className="col">
                          <p>Amount</p>
                          <p>{chequeDetails.amount}</p>
                        </div>
                        <div className="col">
                          <p>Date</p>
                          <p>{chequeDetails.date}</p>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section>
                    <div className="subtitle">
                      <p>Add cheque status</p>
                    </div>
                    <div className="info">
                      <div className="row">
                        <label htmlFor="">date</label>
                        <input
                          type="date"
                          onChange={(e) =>
                            setCheque({
                              ...cheque,
                              deposited_at: e.target.value,
                            })
                          }
                          required={props.invoice.payment_type === 'cheque'}
                        />
                      </div>
                      <div className="row">
                        <label htmlFor="">status</label>
                        <select
                          onChange={(e) =>
                            setCheque({ ...cheque, status: e.target.value })
                          }
                          required={props.invoice.payment_type === 'cheque'}
                        >
                          <option value="pending">pending</option>
                          <option value="cleared">cleared</option>
                          <option value="return">return</option>
                        </select>
                      </div>
                    </div>
                  </section>
                </>
              ) : (
                ''
              )}
            </div>
          </section>
        </div>
        <div className="buttoncontainer">
          {props.invoice.status === 'pending' ? (
            <>
              <button className="btnEdit" onClick={(e) => handleConfirm(e)}>
                confirm
              </button>
              <button className="addBtn" onClick={(e) => handleReject(e)}>
                Reject
              </button>
            </>
          ) : (
            ''
          )}

          <button className="btnSave" onClick={(e) => handleCloseConfirm(e)}>
            close
          </button>
        </div>
      </div>
    </div>
  );
};

// bill_code;
// bill_number;
// billing_price_method;
// code;
// contact_number;
// date;
// dealer;
// dealer_address;
// dealer_name;
// dis_sales_ref;
// discount;
// distributor;
// id;
// payment_type;
// sales_ref;
// status;
// sub_total;

export default ConfirmStatus;
