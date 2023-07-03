import React, { useEffect, useRef, useState } from 'react';
import styles from './confrm_bill.module.scss';
import { axiosInstance } from '../../../axiosInstance';
import { useReactToPrint } from 'react-to-print';

const ViewBill = (props) => {
  const compoenentRef = useRef();
  const [distributor, setDistributor] = useState({
    full_name: '',
    address: '',
    company_number: '',
  });
  useEffect(() => {
    if (props.user.is_salesref) {
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
    if (props.user.is_distributor) {
      axiosInstance
        .get(
          `/distributor/salesref/get/distributor/by/distributor/${
            JSON.parse(sessionStorage.getItem('user_details')).id
          }`,
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
    console.log('inv v:', props.invoice.billing_price_method);
  }, []);

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
        <div ref={compoenentRef} style={{ fontSize: '12px' }}>
          <div className={styles.row}>
            <div className={styles.heading}>
              <div className={styles.hcol1}>
                <img src="./images/Bixton_logo.png" alt="" />
              </div>
              <div className={styles.hcol2}>
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
              <tfoot>
                <tr className={styles.final}>...</tr>
                <tr>
                  <td className={styles.total} colSpan={6}>
                    Total amount:
                  </td>
                  <td>{props.data.sub_total}</td>
                </tr>
                <tr>
                  <td className={styles.total} colSpan={6}>
                    Total dicsount amount:
                  </td>
                  <td>{props.data.total_discount}</td>
                </tr>
                <tr>
                  <td className={styles.total} colSpan={6}>
                    Final amount:
                  </td>
                  <td>{props.data.total}</td>
                </tr>
              </tfoot>
            </table>
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
