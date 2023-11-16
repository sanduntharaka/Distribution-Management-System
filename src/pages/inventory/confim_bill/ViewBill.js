import React, { useEffect, useRef, useState } from 'react';
import styles from '../../../sass/invoice/confrm_bill.module.scss';

import { axiosInstance } from '../../../axiosInstance';
import { useReactToPrint } from 'react-to-print';
import classNames from 'classnames';
const ViewBill = (props) => {
  const compoenentRef = useRef();
  const [distributor, setDistributor] = useState({
    full_name: '',
    address: '',
    company_number: '',
  });

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
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <p>Customer: {props.data.dealer_name}</p>
              <p>Customer ID: {props.data.dealer}</p>
              <p>Address: {props.data.dealer_address}</p>
              <p>Telephone: {props.data.contact_number}</p>
            </div>
            <div className={styles.col}>
              <p>Invoice No: {props.invoice.code}</p>
              <p>
                Invoice Time: {props.invoice.time}{' '}
              </p>
              <p>Invoiced By (Name): {props.invoice.added_by}</p>
              <p>Telephone: {props.invoice.added_by_contact}</p>
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
                      {props.invoice.billing_price_method === '1'
                        ? item.wholesale_price
                        : props.invoice.billing_price_method === '2'
                          ? item.retail_price
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
                Final Amount: Rs {props.data.total}
              </p>
            </div>
            <div className={styles.row}>
              <div className={styles.two_sides}>
                <div className="col">
                  <p>...................................</p>
                  <p>Invoice by Name </p>
                </div>
                <div className="col">
                  <p>...................................</p>
                  <p> Date</p>
                </div>
                <div className="col">
                  <p>...................................</p>
                  <p>Signature and Rubber Stamp
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <p>Accepted the Items in the Order.</p>
            </div>

            <div className={styles.row}>
              <div className={styles.two_sides}>
                <div className="col">
                  <p>...................................</p>
                  <p>Customer Name </p>
                </div>
                <div className="col">
                  <p>...................................</p>
                  <p>Date</p>
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
