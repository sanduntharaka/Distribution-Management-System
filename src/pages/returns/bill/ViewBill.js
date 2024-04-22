import React, { useEffect, useRef, useState } from 'react';
import styles from '../../../sass/invoice/confrm_bill.module.scss';
// import { axiosInstance } from '../../../axiosInstance';
import { useReactToPrint } from 'react-to-print';
import classNames from 'classnames';
const ViewBill = (props) => {
  const compoenentRef = useRef();
  // const [distributor, setDistributor] = useState({
  //   full_name: '',
  //   address: '',
  //   company_number: '',
  // });
  // useEffect(() => {
  //   if (props.user.is_salesref) {
  //     axiosInstance
  //       .get(
  //         `/distributor/salesref/get/distributor/by/salesref/${props.issued_by.id}`,
  //         {
  //           headers: {
  //             Authorization:
  //               'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         setDistributor({
  //           full_name: res.data.full_name,
  //           address: res.data.address,
  //           company_number: res.data.company_number,
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  //   if (props.user.is_distributor) {
  //     axiosInstance
  //       .get(
  //         `/distributor/salesref/get/distributor/by/distributor/${
  //           JSON.parse(sessionStorage.getItem('user_details')).id
  //         }`,
  //         {
  //           headers: {
  //             Authorization:
  //               'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         setDistributor({
  //           full_name: res.data.full_name,
  //           address: res.data.address,
  //           company_number: res.data.company_number,
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }

  // }, []);

  const handleCancle = (e) => {
    e.preventDefault();
    props.close();
  };
  const handlePrintFile = useReactToPrint({
    content: () => compoenentRef.current,
  });

  const handlePrint = () => {
    handlePrintFile();
  };
  return (
    <div className={styles.confirmBill}>
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
                <h2>{props.invoice.distributor}</h2>
                <p>{props.invoice.distributor_address}</p>
                <p>{props.invoice.distributor_company_number}</p>
                <h3>Market Return Receipt</h3>
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
              <p>Customer: {props.data.dealer_name}</p>
              <p>Customer Id: {props.data.dealer}</p>
              <p>Address: {props.data.dealer_address}</p>
              <p>Telephone: {props.data.contact_number}</p>
            </div>
            <div className={styles.col}>
              <p>Invoice No: {props.invoice.code}</p>
              <p>Invoice Date: {props.data.date}</p>
              <p>Salesperson: {props.invoice.added_name}</p>
              <p>Telephone: {props.invoice.added_contact}</p>
            </div>
          </div>
          <div className={styles.row}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th} >Item Code</th>
                  <th className={styles.th} >Reason</th>
                  <th className={styles.th} >Qty</th>
                  <th className={styles.th} >Foc</th>
                </tr>
              </thead>

              <tbody>
                {props.items.map((item, i) => (
                  <tr key={i}>
                    <td className={styles.td} >{item.item_code}</td>
                    <td className={styles.td} >{item.reason}</td>
                    <td className={styles.td} >{item.qty}</td>
                    <td className={styles.td} >{item.foc}</td>
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

export default ViewBill;
