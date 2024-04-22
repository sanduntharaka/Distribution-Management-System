import React, { useEffect, useRef, useState } from 'react';
import styles from '../../../sass/invoice/confrm_bill.module.scss';
import { formatNumberPrice } from '../../../var/NumberFormats';
import { axiosInstance } from '../../../axiosInstance';
import { useReactToPrint } from 'react-to-print';
import classNames from 'classnames';
const ViewBill = (props) => {
  const compoenentRef = useRef();
  const [vat_rate, setVatRate] = useState(0)
  const [vat_no, setVat_no] = useState('')

  console.log('pp:', props)
  useEffect(() => {
    if (props.user.is_distributor || props.user.is_salesref) {
      axiosInstance
        .get(
          `/settings/get/vat/`,
          {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          }
        )
        .then((res) => {

          setVatRate(parseFloat(res.data.vat_percentage))
          setVat_no(res.data.vat_no)
        })
        .catch((err) => {
          console.log(err);

        });
    }
    if (props.user.is_company || props.user.is_manager || props.user.is_excecutive) {
      axiosInstance.get(
        `/settings/get/vat/${props.data.dis_sales_ref}`,
        {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        }
      )
        .then((res) => {

          setVatRate(parseFloat(res.data.vat_percentage))
          setVat_no(res.data.vat_no)
        })
        .catch((err) => {
          console.log(err);

        });
    }
  }, [])

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
          {

            props.data.invoice_type === 'vat' ?
              (<div className={styles.row} style={{ alignItems: 'right', display: 'flex', justifyContent: 'flex-end' }}>
                <p style={{ fontSize: 10 }}>VAT_INV:{vat_no}</p>
              </div>) : ''
          }
          <div className={styles.row}>
            <div className={styles.heading}>
              <div className={styles.hcol1}>
                <img src="./images/Bixton_logo.png" alt="" />
              </div>
              <div className={classNames(styles.hcol2, styles.title)}>
                <h2>{props.invoice.full_name}</h2>
                <p>{props.invoice.address}</p>
                <p>{props.invoice.company_number}</p>
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
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th} >Item Code</th>
                  <th className={styles.th} >Description</th>
                  <th className={styles.th} >Unit Qty</th>
                  <th className={styles.th} >Free Qty</th>
                  <th className={styles.th} >Price</th>
                  <th className={styles.th} >Discount</th>
                  <th className={styles.th} >Value</th>
                </tr>
              </thead>

              <tbody>
                {props.items.map((item, i) => (
                  <tr key={i}>
                    <td className={styles.td}>{item.item_code}</td>
                    <td className={styles.td}>{item.description}</td>
                    <td className={styles.td}>{item.qty}</td>
                    <td className={styles.td}>{item.foc}</td>
                    <td className={styles.td}>
                      {props.invoice.billing_price_method === '1'
                        ? formatNumberPrice(item.wholesale_price)
                        : props.invoice.billing_price_method === '2'
                          ? formatNumberPrice(item.retail_price)
                          : 0}
                    </td>
                    <td className={styles.td}>{formatNumberPrice(item.discount)}</td>
                    <td className={styles.td}>{formatNumberPrice(item.extended_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.bottom}>
            <div className={styles.amount}>
              <p className={styles.total}>
                Total Amount: Rs {formatNumberPrice(props.data.sub_total)}
              </p>
              {
                props.data.invoice_type === 'vat' ?
                  (<p className={styles.total}>
                    Total VAT({vat_rate}%) Amount: Rs {formatNumberPrice(props.data.vat_amount)}
                  </p>) : ''
              }

              <p className={styles.total}>
                Total Dicsount Amount: Rs {formatNumberPrice(props.data.total_discount)}
              </p>


              <p className={styles.total}>
                Final Amount: Rs {formatNumberPrice(props.data.total)}
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
