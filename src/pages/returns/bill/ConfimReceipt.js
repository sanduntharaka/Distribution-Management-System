import React, { useEffect, useRef, useState } from 'react';
import styles from '../../../sass/invoice/confrm_bill.module.scss';
import { axiosInstance } from '../../../axiosInstance';
import { useReactToPrint } from 'react-to-print';
import Message from '../../../components/message/Message';
import Modal from '@mui/material/Modal';
import classNames from 'classnames';
const MyMessage = React.forwardRef((props, ref) => {
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
const ConfimReceipt = (props) => {
  //message modal
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const compoenentRef = useRef();
  const [distributor, setDistributor] = useState({
    full_name: '',
    address: '',
    company_number: '',
  });
  useEffect(() => {
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
  }, []);
  const handleEdit = (e) => {
    e.preventDefault();
    console.log('called');
    props.close();
  };
  const handleCancle = (e) => {
    e.preventDefault();
    props.set_items([]);
    props.set_invoice('');
    props.set_data({
      psa: '',
      dealer: '',
    });
    props.close();
  };
  const [invno, setInvNo] = useState({
    code: '',
    number: '',
  });
  const handlePrintFile = useReactToPrint({
    content: () => compoenentRef.current,
  });

  const handlePrint = () => {
    axiosInstance
      .post('/salesref/return/add/', props.data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setInvNo({
          ...invno,
          code: res.data.bill_code,
          number: res.data.bill_number,
        });
        axiosInstance
          .post(
            `/salesref/return/add/items/${res.data.id}`,
            {
              items: props.items,
            },
            {
              headers: {
                Authorization:
                  'JWT ' +
                  JSON.parse(sessionStorage.getItem('userInfo')).access,
              },
            }
          )
          .then((res) => {
            setLoading(false);
            handlePrintFile();
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
            setSuccess(false);
            setError(true);
            setTitle('Error');
            setMsg(
              'Your data cannot saved. Please refresh your page and try again.'
            );
            handleOpen();
          });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg(
          'Your data cannot saved. Please refresh your page and try again.'
        );
        handleOpen();
      });
  };
  return (
    <div className={styles.confirmBill}>
      <Modal open={open} onClose={handleClose}>
        <MyMessage
          handleClose={handleClose}
          success={success}
          error={error}
          title={title}
          msg={msg}
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
                <h3>Market return receipt</h3>
              </div>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.right}>
              <p>{props.data.date}</p>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <p>
                method:{' '}
                {props.data.is_return_goods
                  ? 'Return form goods'
                  : props.data.is_deduct_bill
                  ? 'Deduct from bill'
                  : ''}
              </p>

              <p>Customer: {props.data.dealer_name}</p>
              <p>Customer Id: {props.data.dealer}</p>
              <p>Address: {props.data.dealer_address}</p>
              <p>Telephone: {props.data.dealer_contact}</p>
            </div>
            <div className={styles.col}>
              <p>
                Invoice No: {invno.code}
                {invno.number}
              </p>
              <p>Invoice Date: {props.data.date}</p>
              <p>Salesperson: {props.issued_by.full_name}</p>
              <p>Telephone: {props.issued_by.company_number}</p>
            </div>
          </div>
          {props.data.is_deduct_bill ? (
            <div className={styles.row}>
              <p>
                Bill:{props.data.bill_code}
                {props.data.bill_number}
              </p>{' '}
              <p>amount:{props.data.amount}</p>
            </div>
          ) : (
            ''
          )}
          <div className={styles.row}>
            <table>
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Reason</th>
                  <th>Qty</th>
                  <th>Foc</th>
                </tr>
              </thead>
              <tbody>
                {props.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.item_code}</td>
                    <td>{item.reason}</td>
                    <td>{item.qty}</td>
                    <td>{item.foc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.bottom}>
            <div className={styles.amount}>
              <p className={styles.total}>Total:{0}</p>
            </div>
            <div className={styles.row}>
              <div className={styles.two_sides}>
                <div className="col">
                  <p>...................................</p>
                  <p>Invoice by Name and Date</p>
                </div>
                <div className="col">
                  <p>...................................</p>
                  <p>Signature and Rubber Stamp</p>
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <p>Accepted Above Items in Order.</p>
            </div>
            <div className={styles.row}>
              <div className={styles.two_sides}>
                <div className="col">
                  <p>...................................</p>
                  <p>Customer Name and Date</p>
                </div>
                <div className="col">
                  <p>...................................</p>
                  <p>Signature and Rubber Stamp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.button_bar}>
            <div className={styles.buttons}>
              <button className="btnEdit" onClick={handlePrint}>
                Print
              </button>
              {/* <button className="addBtn" onClick={(e) => handleEdit(e)}>
                Edit
              </button> */}
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

export default ConfimReceipt;
