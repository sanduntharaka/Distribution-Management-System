import React, { useEffect, useState } from 'react';
import './confirmstatus.scss';
import { axiosInstance } from '../../../axiosInstance';

import Spinner from '../../../components/loadingSpinner/Spinner';
const ConfirmStatus = (props) => {
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    return `${year}-${month}-${day}`;
  });
  const [loading, setLoading] = useState(false);

  const [invoice, setInvoice] = useState({
    payment_type: '',
    paid_amount: 0,
    date: currentDate,
    added_by: JSON.parse(sessionStorage.getItem('user_details')).id,
    number_of_dates: 0,
    due_date: currentDate,
    cheque_number: '',
    account_number: '',
    payee_name: '',
    bank: '',
    amount: 0,
    cheque_date: '',
    deposited_at: '',
    cheque_status: '',
  });
  const handleConfirm = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .put(
        `/salesref/invoice/create/invoice/credit/${props.invoice.id}`,
        invoice,
        {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        }
      )
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
  console.log(props);
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
      <div className="container">
        <div className="title">
          <h1>Add Credit details</h1>
        </div>
        <div className="details">
          <section className="twosides">
            <div>
              <div className="subtitle">
                <p>Sales ref</p>
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
                <div className="col">
                  <p>Payed</p>
                  <p>{props.invoice.payed}</p>
                </div>
                <div className="col">
                  <button className="addBtn">Payment history</button>
                </div>
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

              <div className="row">
                <div className="row">
                  <label htmlFor="">Payed</label>
                  <input
                    type="number"
                    onChange={(e) =>
                      setInvoice({ ...invoice, paid_amount: e.target.value })
                    }
                  />
                </div>
              </div>
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
                    <div className="row">
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
                    </div>
                    <div className="row">
                      <div className="col">
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
                      <div className="col">
                        <label>Account Number</label>

                        <input
                          type="text"
                          onChange={(e) =>
                            setInvoice({
                              ...invoice,
                              account_number: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col">
                        <label>Bank</label>

                        <input
                          type="text"
                          onChange={(e) =>
                            setInvoice({ ...invoice, bank: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
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
                      </div>
                      <div className="col">
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
                      <div className="col">
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
                      <div className="col">
                        <label>Amount</label>

                        <input
                          type="number"
                          onChange={(e) =>
                            setInvoice({ ...invoice, amount: e.target.value })
                          }
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
          <button className="btnEdit" onClick={(e) => handleConfirm(e)}>
            submit
          </button>

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
