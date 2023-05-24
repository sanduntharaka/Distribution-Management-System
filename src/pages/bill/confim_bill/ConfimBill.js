import React, { useEffect, useRef, useState } from 'react';
import styles from './confrm_bill.module.scss';
import { axiosInstance } from '../../../axiosInstance';
import { useReactToPrint } from 'react-to-print';
const ConfimBill = (props) => {
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
    bill_code: '',
    bill_number: '',
  });
  const handlePrint = () => {
    axiosInstance
      .post('/salesref/invoice/create/invoice/', props.data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setInvoice({
          bill_code: res.data.bill_code,
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
                  console.log(res);

                  handlePrintFile();
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              handlePrintFile();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={styles.confirmBill}>
      <div className={styles.container}>
        <div ref={compoenentRef} style={{ fontSize: '12px' }}>
          <div className={styles.row}>
            <div className={styles.heading}>
              <h2>{distributor.full_name}</h2>
              <p>{distributor.address}</p>
              <p>{distributor.company_number}</p>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.right}>
              <p>{props.data.date}</p>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <p>method: {props.data.payment_type}</p>
              <p>Customer: {props.data.dealer_name}</p>
              <p>Customer Id: {props.data.dealer}</p>
              <p>Address: {props.data.dealer_address}</p>
              <p>Telephone: {props.data.dealer_contact}</p>
            </div>
            <div className={styles.col}>
              <p>
                Invoice No: {invoice.bill_code}
                {invoice.bill_number}
              </p>
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
                    <td>{item.price}</td>
                    <td>{item.extended_price}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className={styles.total} colSpan={5}>
                    Total value:
                  </td>
                  <td>{props.data.sub_total}</td>
                </tr>
                <tr>
                  <td className={styles.total} colSpan={5}>
                    Invoice value:
                  </td>
                  <td>{props.data.total}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className={styles.row}>
            <p>Accepted above items in order</p>
          </div>
          <div className={styles.row}>
            <p>Customer: ............</p>
          </div>
          <div className={styles.row}>
            <div className={styles.two_sides}>
              <div className="col">
                <p>...................................</p>
                <p>Invoice by</p>
              </div>
              <div className="col">
                <p>...................................</p>
                <p>Recieved by</p>
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
