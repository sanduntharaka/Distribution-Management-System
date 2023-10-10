import React, { useEffect, useRef, useState } from 'react';
import styles from '../../../sass/invoice/confrm_bill.module.scss';
import { axiosInstance } from '../../../axiosInstance';
import { useReactToPrint } from 'react-to-print';
import Spinner from '../../../components/loadingSpinner/Spinner';
import BillSuccess from '../../../components/userComfirm/BillSuccess';
import Modal from '@mui/material/Modal';
import classNames from 'classnames';

const ConfimBill = (props) => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const compoenentRef = useRef();
  const [distributor, setDistributor] = useState({
    full_name: '',
    address: '',
    company_number: '',
  });

  const [loading, isLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    props.close();
    props.clear();
  };

  console.log(props)
  useEffect(() => {
    if (user.is_salesref) {
      axiosInstance
        .get(
          `/distributor/salesref/get/distributor/by/salesref/${props.issued_by.id}`,
          {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          }
        )
        .then((res) => {
          setDistributor({
            full_name: res.data.full_name,
            address: res.data.address,
            company_number: res.data.company_number,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (user.is_distributor) {
      axiosInstance
        .get(
          `/distributor/salesref/get/distributor/by/distributor/${props.issued_by.id}`,
          {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          }
        )
        .then((res) => {
          setDistributor({
            full_name: res.data.full_name,
            address: res.data.address,
            company_number: res.data.company_number,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  const handleEdit = (e) => {
    e.preventDefault();
    props.close();
  };
  const handleCancle = (e) => {
    e.preventDefault();
    props.set_items([]);
    props.set_invoice('');
    props.set_data({
      dealer: '',
      dealer_name: '',
      dealer_address: '',
      dealer_contact: '',
      dis_sales_ref: '',
      total: 0,
      discount_percentage: 0,
      sub_total: 0,
    });
    props.close();
  };
  const handlePrintFile = useReactToPrint({
    content: () => compoenentRef.current,
  });
  const [invoice, setInvoice] = useState({
    bill_number: '',
  });
  // const handlePrint = () => {
  //   // isLoading(true);
  //   // axiosInstance
  //   //   .post('/salesref/invoice/create/invoice/', props.data, {
  //   //     headers: {
  //   //       Authorization:
  //   //         'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
  //   //     },
  //   //   })
  //   //   .then((res) => {
  //   //     setInvoice({
  //   //       bill_code: res.data.bill_code,
  //   //       bill_number: res.data.bill_number,
  //   //     });
  //   //     const item_data = {
  //   //       bill: res.data.id,
  //   //       items: props.items,
  //   //     };
  //   //     let cheque_details = {
  //   //       bill: res.data.id,
  //   //       date: props.cheque_detail.date,
  //   //       cheque_number: props.cheque_detail.cheque_number,
  //   //       account_number: props.cheque_detail.account_number,
  //   //       payee_name: props.cheque_detail.payee_name,
  //   //       amount: props.cheque_detail.amount,
  //   //     };
  //   //     axiosInstance
  //   //       .post('/salesref/invoice/create/invoice/items/', item_data, {
  //   //         headers: {
  //   //           Authorization:
  //   //             'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
  //   //         },
  //   //       })
  //   //       .then((res) => {
  //   //         if (props.cheque) {
  //   //           axiosInstance
  //   //             .post(
  //   //               '/salesref/invoice/create/invoice/cheque/',
  //   //               cheque_details,
  //   //               {
  //   //                 headers: {
  //   //                   Authorization:
  //   //                     'JWT ' +
  //   //                     JSON.parse(sessionStorage.getItem('userInfo')).access,
  //   //                 },
  //   //               }
  //   //             )
  //   //             .then((res) => {
  //   //               isLoading(false);

  //   //               handlePrintFile();
  //   //             })
  //   //             .catch((err) => {
  //   //               isLoading(false);

  //   //               console.log(err);
  //   //             });
  //   //         } else {
  //   //           isLoading(false);

  //   //           handlePrintFile();
  //   //         }
  //   //       })
  //   //       .catch((err) => {
  //   //         isLoading(false);

  //   //         console.log(err);
  //   //       });
  //   //   })
  //   //   .catch((err) => {
  //   //     console.log(err);
  //   //   });
  //   handlePrintFile();
  // };
  const [successBill, setSuccessBill] = useState(false);
  const [errorBill, setErrorBill] = useState(false);
  const [title, setTitle] = useState('');
  const [msg, setMsg] = useState('');

  const handleSaveBill = () => {
    isLoading(true);

    console.log('rsdaa:', props.data)
    axiosInstance
      .post('/salesref/invoice/create/invoice/', props.data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setInvoice({
          bill_number: res.data.bill_number,
        });
        const item_data = {
          bill: res.data.id,
          items: props.items,
        };
        let cheque_details = {
          bill: res.data.id,
          date: props.cheque_detail.date,
          cheque_number: props.cheque_detail.cheque_number,
          account_number: props.cheque_detail.account_number,
          payee_name: props.cheque_detail.payee_name,
          amount: props.cheque_detail.amount,
        };
        axiosInstance
          .post('/salesref/invoice/create/invoice/items/', item_data, {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          })
          .then((res) => {
            if (props.cheque) {
              axiosInstance
                .post(
                  '/salesref/invoice/create/invoice/cheque/',
                  cheque_details,
                  {
                    headers: {
                      Authorization:
                        'JWT ' +
                        JSON.parse(sessionStorage.getItem('userInfo')).access,
                    },
                  }
                )
                .then((res) => {
                  isLoading(false);
                  setSuccessBill(true);
                  setErrorBill(false);
                  setTitle('Success');
                  setMsg(
                    'Your bill saved successfully. If you want to get print, please click print button'
                  );
                  handleOpen();
                })
                .catch((err) => {
                  isLoading(false);
                  setErrorBill(true);
                  setSuccessBill(false);
                  setTitle('Error');
                  setMsg(
                    'Your bill cannot save right now. Please try again later'
                  );
                  handleOpen();
                  console.log(err);
                });
            } else {
              isLoading(false);
              setSuccessBill(true);
              setErrorBill(false);
              setTitle('Success');
              setMsg(
                'Your bill saved successfully. If you want to get print, please click print button'
              );
              handleOpen();
            }
          })
          .catch((err) => {
            isLoading(false);
            setErrorBill(true);
            setSuccessBill(false);
            setTitle('Error');
            setMsg('Your bill cannot save right now. Please try again later');
            handleOpen();
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const MyMessage = React.forwardRef((props, ref) => {
    return (
      <BillSuccess
        hide={() => props.handleClose()}
        success={props.success}
        error={props.error}
        title={props.title}
        msg={props.msg}
        print={() => props.print()}
        clear={() => props.clear()}
        ref={ref}
      />
    );
  });
  return (
    <div className={styles.confirmBill}>
      {/* {isLoading ? (
        <div className="page-spinner">
          <div className="page-spinner__back">
            <Spinner detail={true} />
          </div>
        </div>
      ) : (
        ''
      )} */}
      <Modal open={open} onClose={handleClose}>
        <MyMessage
          handleClose={handleClose}
          success={successBill}
          error={errorBill}
          title={title}
          msg={msg}
          print={handlePrintFile}
          clear={props.clear}
        />
      </Modal>
      <div className={styles.container}>
        <div
          ref={compoenentRef}
          style={{ fontSize: '12px' }}
          className={styles.bill}
        >
          <div className={styles.row}>
            <div className={styles.heading}>
              <div className={styles.hcol1}>
                <img src="./images/Bixton_logo.png" alt="" />
              </div>
              <div className={classNames(styles.hcol2, styles.title)}>
                <h2>{distributor.full_name}</h2>
                <p>{distributor.address}</p>
                <p>{distributor.company_number}</p>
                <h3>Invoice</h3>
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.right}>
              <p>{props.data.date}</p>
              <p>{props.data.payment_method}</p>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              {/* <p>method: {props.data.payment_type}</p> */}
              <p>Customer: {props.data.dealer_name}</p>
              <p>Customer Id: {props.data.dealer}</p>
              <p>Address: {props.data.dealer_address}</p>
              <p>Telephone: {props.data.dealer_contact}</p>
            </div>
            <div className={styles.col}>
              <p>
                Invoice No: {props.data.bill_code}
                {invoice.bill_number}
              </p>
              <p>
                Invoice Date: {props.data.date} &{props.data.time}
              </p>
              <p>Salesperson: {props.issued_by.full_name}</p>
              <p>Telephone: {props.issued_by.company_number}</p>
            </div>
          </div>
          <div className={styles.row}>
            <table>
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Description</th>
                  <th>Unit Qty</th>
                  <th>Free Qty</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {props.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.item_code}</td>
                    <td>{item.description}</td>
                    <td>{item.qty}</td>
                    <td>{item.foc}</td>
                    <td>
                      {props.data.billing_price_method === '1'
                        ? item.whole_sale_price
                        : props.data.billing_price_method === '2'
                          ? item.price
                          : 0}
                    </td>
                    <td>{item.discount}</td>
                    <td>{item.extended_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.bottom}>
            <div className={styles.amount}>
              <p className={styles.total}>
                Total Amount: Rs {props.data.sub_total}
              </p>
              <p className={styles.total}>
                Total Dicsount Amount: Rs {props.data.total_discount}
              </p>
              <p className={styles.total}>
                Final Amount: Rs {props.data.sub_total - props.data.total_discount}
              </p>
            </div>

            <div className={styles.row}>
              <div className={styles.two_sides}>
                <div className="col">
                  <p>...................................</p>
                  <p>Invoice by name and date</p>
                </div>
                <div className="col">
                  <p>...................................</p>
                  <p>Signature and rubber stamp</p>
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <p>Accepted above items in order</p>
            </div>
            <div className={styles.row}>
              <div className={styles.two_sides}>
                <div className="col">
                  <p>...................................</p>
                  <p>Customer name and date</p>
                </div>
                <div className="col">
                  <p>...................................</p>
                  <p>Signature and rubber stamp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* handlePrint */}
        <div className={styles.row}>
          <div className={styles.button_bar}>
            <div className={styles.buttons}>
              <button
                className="btnEdit"
                onClick={handleSaveBill}
                style={{ display: 'flex', alignItems: 'center', gap: 5 }}
              >
                Save
                {loading ? <Spinner page={true} /> : ''}
              </button>
              <button className="addBtn" onClick={(e) => handleEdit(e)}>
                Edit
              </button>
              <button className="btnSave" onClick={(e) => handleCancle(e)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfimBill;
