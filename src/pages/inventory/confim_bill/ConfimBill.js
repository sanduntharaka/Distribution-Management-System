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
  const [loading, isLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    props.close();
    props.clear();
  };
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
  const [successBill, setSuccessBill] = useState(false);
  const [errorBill, setErrorBill] = useState(false);
  const [title, setTitle] = useState('');
  const [msg, setMsg] = useState('');

  const handleSaveBill = () => {
    isLoading(true);

    console.log('rsdaa:', props.data)
    axiosInstance
      .post('/distributor/stoks/add/', { 'invoice': props.data, 'items': props.items }, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log('res:', res)

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
        console.log(err);
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
                <h2>BIXTON LIGHTING</h2>
                {/* <p>{distributor.address}</p>
                <p>{distributor.company_number}</p> */}
                <h3>Stock Invoice</h3>
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
              <p>Customer: {JSON.parse(sessionStorage.getItem('user_details')).full_name}</p>
              <p>Customer Id: {JSON.parse(sessionStorage.getItem('user_details')).id}</p>
              <p>Address: {JSON.parse(sessionStorage.getItem('user_details')).address}</p>
              <p>Telephone: {JSON.parse(sessionStorage.getItem('user_details')).company_number}</p>
            </div>
            <div className={styles.col}>
              <p>
                Invoice No: {props.data.invoice_number}
              </p>
              <p>
                Due Date: {props.data.due_date}
              </p>
            </div>
          </div>
          <div className={styles.row}>
            <table>
              <thead>
                <tr>
                  <th> Item Code</th>
                  <th>Qty</th>
                  <th>FOC</th>
                  <th>Unit price</th>
                  <th>Extended price</th>

                </tr>
              </thead>
              <tbody>
                {props.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.item_code}</td>
                    <td>{item.qty}</td>
                    <td>{item.foc}</td>
                    <td>{item.whole_sale_price}</td>
                    <td>{item.whole_sale_price * item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.bottom}>
            <div className={styles.amount}>
              <p className={styles.total}>
                Total Amount: Rs {props.data.pay_total + props.data.discount}
              </p>
              <p className={styles.total}>
                Total Dicsount Amount: Rs {props.data.discount}
              </p>
              <p className={styles.total}>
                Final Amount: Rs {props.data.pay_total}
              </p>
            </div>

            {/* <div className={styles.row}>
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
            </div> */}
            {/* <div className={styles.row}>
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
            </div> */}
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
