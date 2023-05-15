import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { axiosInstance } from '../../axiosInstance';
const Invoice = (props) => {
  const [date, setDate] = useState(props.inv.date);
  const [customer, setCustomer] = useState({
    id: '',
    full_name: '',
    address: '',
  });

  const [seller, setSeller] = useState({
    id: '',
    full_name: '',
    address: '',
  });

  // issued_by
  // solled_to
  console.log(props);
  useEffect(() => {
    axiosInstance
      .get(`/users/get/${props.inv.solled_to}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setCustomer({
          id: res.data.id,
          full_name: res.data.full_name,
          address: res.data.address,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    axiosInstance
      .get(`/users/get/user/${props.inv.issued_by}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res.data);
        setSeller({
          id: res.data.id,
          full_name: res.data.full_name,
          address: res.data.address,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const Print = () => {
    html2canvas(document.querySelector('#pdf-content')).then((canvas) => {
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [612, 792],
      });
      pdf.internal.scaleFactor = 1;
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${'invoice'}-${'00152'}.pdf`);
    });
  };
  const hanldlePrint = () => {
    Print();
  };

  return (
    <div className="inv">
      <div className="inv__content" id="pdf-content">
        <div className="inv__content__row">
          <div className="inv__content__row__col rowCol">
            <h2>Bixton Distributors Pvt Ltd</h2>
          </div>
        </div>
        <div className="inv__content__row">
          <div className="inv__content__row__col img">
            <img
              className="logo"
              src="./images/Bixton_logo.png"
              alt=""
              width={150}
              height={75}
            />
          </div>
          <div className="inv__content__row__col">
            <p>305/47-Ferguson Read-Colombo 15,Sri Lanka</p>
            <p>Email-info@bixton.com</p>
            <p>Reg No: PV 00207104</p>
            <p>Phone:01170244563</p>
            <p>Fax:01170244563</p>
          </div>
          <div className="inv__content__row__col">
            <table>
              <tr>
                <td>
                  <p className="title">Date</p>
                  <p>{date}</p>
                </td>
                <td>
                  {' '}
                  <p className="title">Page</p>
                  <p>1</p>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <p className="title">Invoice Number</p>
                  <p>
                    {props.oldinv
                      ? props.inv.invoice_code
                      : props.inv.invoice_code + props.inv.invoice_number}
                  </p>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <p className="title">Delivary Number</p>
                  <p></p>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="inv__content__row">
          <div className="inv__content__row__col rowCol">
            <h3>Invoice</h3>
          </div>
        </div>
        <div className="inv__content__row">
          <div className="inv__content__row__col">
            <p>Sold to</p>
            <div className="details">
              <p>Name:{customer.full_name}</p>
              <p>Address:{customer.address}</p>
            </div>
          </div>
          <div className="inv__content__row__col">
            <p>Ship to</p>
            <div className="details">
              <p>Name:</p>
              <p>Address</p>
            </div>
          </div>
        </div>
        <div className="inv__content__row">
          <div className="inv__content__row__col">
            <div className="details">
              <p>Customer No:</p>
              <p> </p>
            </div>
          </div>
          <div className="inv__content__row__col">
            <div className="details">
              <p>Name:{seller.full_name}</p>
              <p></p>
            </div>
          </div>
          <div className="inv__content__row__col">
            <div className="details">
              <p>Credit Terms:</p>
              <p>45 Days</p>
            </div>
          </div>
        </div>

        <div className="inv__content__row">
          <div className="inv__content__row__col rowCol">
            <table>
              <tr>
                <th>Item number</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Extended Price</th>
              </tr>

              {console.log('inv_itms:', props.items)}
              {props.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.item_code}</td>
                  <td>{item.description}</td>
                  <td>{item.qty}</td>
                  <td>{item.whole_sale_price}</td>
                  <td>{item.whole_sale_price * item.qty}</td>
                </tr>
              ))}
            </table>
          </div>
        </div>
        <div
          className="inv__content__row"
          style={{ justifyContent: 'flex-end', fontWeight: 'bold' }}
        >
          <div className="inv__content__row__col">
            <p>Total: Rs {props.inv.total}/-</p>
          </div>
        </div>
        <div className="bottom">
          <div className="bottom__row ">
            <div className="bottom__row__col ">
              <div className="details-sp" style={{ width: '250px' }}>
                <p>Account Name:</p>
                <p>Bank Name:</p>
                <p>Account No:</p>
                <p>Barnch:</p>
                <p>Barnch Code:</p>
              </div>
            </div>
            <div className="inv__content__row__col ">
              <table>
                <tr>
                  <td colSpan={3}>
                    <p>Bixton Distribution(Pvt) Ltd.</p>
                    <p>Goods Issued</p>
                  </td>
                </tr>
                <tr>
                  <td>Goods issued By</td>
                  <td colSpan={2}></td>
                </tr>
                <tr>
                  <td>Mode of issue</td>
                  <td>
                    <p>Vehicle No</p>
                  </td>
                  <td>
                    <p>Collected By</p>
                  </td>
                </tr>
                <tr>
                  <td style={{ color: 'white' }}>Mode of issue</td>
                  <td style={{ color: 'white' }}>
                    <p>Vehicle No</p>
                  </td>
                  <td style={{ color: 'white' }}>
                    <p>Collected By</p>
                  </td>
                </tr>
                <tr>
                  <td>Nic No.</td>
                  <td colSpan={2}></td>
                </tr>
                <tr>
                  <td>Signature</td>
                  <td colSpan={2}></td>
                </tr>
                <tr>
                  <td>Date</td>
                  <td colSpan={2}></td>
                </tr>
              </table>
            </div>
          </div>
          <div className="inv__content__row" style={{ marginTop: '10mm' }}>
            <div className="inv__content__row__col ">
              <p style={{ borderTop: '1px solid black', textAlign: 'center' }}>
                Invoice By
              </p>
            </div>
            <div className="inv__content__row__col ">
              <p style={{ borderTop: '1px solid black', textAlign: 'center' }}>
                Checked By
              </p>
            </div>
            <div className="inv__content__row__col ">
              <p style={{ borderTop: '1px solid black', textAlign: 'center' }}>
                Receiver name
              </p>
            </div>
            <div className="inv__content__row__col ">
              <p style={{ borderTop: '1px solid black', textAlign: 'center' }}>
                Receiver ID/Mobile
              </p>
            </div>
            <div className="inv__content__row__col ">
              <p style={{ borderTop: '1px solid black', textAlign: 'center' }}>
                Company Seal&Sign
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="inv__btnsection">
        <button className="btnSave" onClick={() => hanldlePrint()}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Invoice;
