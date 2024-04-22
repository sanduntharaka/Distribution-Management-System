import React, { useEffect, useRef, useState } from 'react';
import styles from '../../../sass/invoice/confrm_bill.module.scss';
import { useReactToPrint } from 'react-to-print';
import classNames from 'classnames';
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";

const ViewBill = (props) => {
  const componentRef = useRef();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Adjust the number of items per page as needed

  const handlePrintFile = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page {
        size: A4; /* Adjust the page size as needed */
        margin: 1cm;
      }
    `,
  });

  const handlePrint = () => {
    handlePrintFile();
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleCancle = (e) => { }

  return (
    <div className={styles.confirmBill}>
      <div className={styles.container}>
        <div
          ref={componentRef}
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
              <p>Invoice No: {props.invoice.invoice_number}</p>
              <p>
                Due date: {props.invoice.due_date}{' '}
              </p>
              <p>Invoiced By (Name): {"Bixton pvt Ltd"}</p>
              <p>Telephone: {""}</p>
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
                  <th className={styles.th} >Wholesale Price</th>
                  <th className={styles.th} >Retail Price</th>
                  <th className={styles.th} >Value</th>
                </tr>
              </thead>
              <tbody>
                {props.items
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((item, i) => (
                    <tr key={i}>
                      <td className={styles.td} >{item.item_code}</td>
                      <td className={styles.td} >{item.description}</td>
                      <td className={styles.td} >{item.qty}</td>
                      <td className={styles.td} >{item.foc}</td>
                      <td className={styles.td} >
                        {item.whole_sale_price}
                      </td>
                      <td className={styles.td}>{item.retail_price}</td>
                      <td className={styles.td}>{item.extended_price}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className={styles.bottom}>
            <div className={styles.amount}>

              <p className={styles.total}>
                Total Dicsount Amount: Rs {props.data.discount}
              </p>

              <p className={styles.total}>
                Final Amount: Rs {props.data.total}
              </p>
            </div>
          </div>
          <div className={styles.bottom}>
            1
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.button_bar}>
            <div className={styles.buttons}>
              <button className='addBtn' onClick={handlePrevPage} disabled={currentPage === 1} >
                <GrCaretPrevious style={{ color: "white", fontWeight: 'bolder' }} />
              </button>
              <button className="btnEdit" onClick={handlePrint}>
                Print
              </button>
              <button
                className="btnSave"
                onClick={(e) => handleCancle(e)}
              >
                Cancel
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage * itemsPerPage >= props.items.length}
                className='addBtn'
              >
                <GrCaretNext />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.pagination}>


      </div>
    </div >
  );
};

export default ViewBill;
