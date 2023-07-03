import React, { useState } from 'react';
import { axiosInstance } from '../../axiosInstance';

const EditInvoiceItems = (props) => {
  const [data, setData] = useState({
    bill: props.selected.bill,
    item: props.selected.item,
    bill_code: props.selected.bill_code,
    id: props.selected.id,
    item_code: props.selected.item_code,
    foc: props.selected.foc,
    qty: props.selected.qty,
    extended_price: props.selected.extended_price,
    discount: props.selected.discount,
  });
  // bill: 11
  // bill_code: "IN-11"
  // billing_price_method: "2"
  // description: "Emergency Fluorescent Tube with Battery Backup"
  // discount: 400
  // extended_price: 8000
  // foc: 1
  // id: 16
  // item: 2
  // item_code: "EL007"
  // pack_size: 0
  // price: 2800
  // qty: 3
  // retail_price: "750.0"
  // wholesale_price: "500.0"
  const [key_pressed, setKeyPresed] = useState(false);
  const handleChangeQty = (e) => {
    let val =
      e.target.value *
      (props.selected.billing_price_method === '2'
        ? parseFloat(props.selected.retail_price)
        : parseFloat(props.selected.wholesale_price));
    setData({ ...data, qty: e.target.value, extended_price: val });
  };
  const handleChangeDiscount = (e) => {
    setKeyPresed(false);

    if (e.keyCode === 13) {
      let discont_value = props.selected.discount - data.discount;
      let val = data.extended_price + discont_value;
      setData({ ...data, extended_price: val });
      setKeyPresed(true);
    }
  };

  const handleSave = () => {
    if (!key_pressed && data.discount !== props.selected.discount) {
      let discont_value = props.selected.discount - data.discount;
      let val = data.extended_price + discont_value;
      setData({ ...data, extended_price: val });
    }
    axiosInstance
      .put(`/salesref/invoice/item/update/${data.id}`, data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        props.seterror(false);
        props.setsuccess(true);
        props.setloading(false);
        props.settimeout(true);
        props.setsuccessmsg('Data updated successfully');
        props.handleClose();
      })
      .catch((error) => {
        props.setloading(false);
        props.setsuccess(false);
        props.seterror(true);
        props.settimeout(true);
        props.seterrormsg('Server error!, Please try again');
        props.handleClose();
      });
  };
  const handleClose = () => {
    props.handleClose();
  };
  return (
    <div className="edit">
      <div className="edit__content">
        <dib className="edit__content__title">
          <h4>Edit</h4>
        </dib>
        <div className="edit__content__table">
          <div className="form">
            <table>
              <tr>
                <td>bill</td>
                <td>
                  <input
                    type="text"
                    value={data.bill_code ? data.bill_code : ''}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td>Item code</td>
                <td>
                  <input
                    type="text"
                    value={data.item_code ? data.item_code : ''}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td>Qty</td>
                <td>
                  <input
                    type="number"
                    value={data.qty ? data.qty : ''}
                    onChange={(e) => handleChangeQty(e)}
                  />
                </td>
              </tr>
              <tr>
                <td>Foc</td>
                <td>
                  <input
                    type="number"
                    value={data.foc ? data.foc : ''}
                    onChange={(e) => setData({ ...data, foc: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td>Discount</td>
                <td>
                  <input
                    type="number"
                    value={data.discount ? data.discount : ''}
                    onChange={(e) =>
                      setData({ ...data, discount: e.target.value })
                    }
                    onKeyDown={handleChangeDiscount}
                  />
                </td>
              </tr>
              <tr>
                <td>Sub total</td>
                <td>
                  <input
                    type="number"
                    value={data.extended_price ? data.extended_price : ''}
                    disabled
                  />
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="edit__content__buttons">
          <button className="remBtn" onClick={handleSave}>
            <p>Save</p>
          </button>
          <button className="addBtn" onClick={handleClose}>
            <p>Cancel</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditInvoiceItems;
