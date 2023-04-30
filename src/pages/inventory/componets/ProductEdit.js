import React, { useState } from 'react';
import { axiosInstance } from '../../../axiosInstance';

const ProductEdit = (props) => {
  const [data, setData] = useState({
    id: props.data.id,
    item_code: props.data.item_code,
    description: props.data.description,
    base: props.data.base,
    qty: props.data.qty,
    pack_size: props.data.pack_size,
    free_of_charge: props.data.free_of_charge,
    whole_sale_price: props.data.whole_sale_price,
    retail_price: props.data.retail_price,
  });
  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    axiosInstance
      .put(`/company/inventory/edit/${data.id}`, data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        props.error(false);
        props.success(true);
        props.msg('Your data has been updated successfully.');
        props.title('success');
        props.closeCurrent();
        props.openMessage();
      })
      .catch((err) => {
        console.log(err);
        props.success(false);
        props.error(true);
        props.msg(
          'Your data cannot update. Please check your data and try again.'
        );
        props.title('Error');
        props.closeCurrent();
        props.openMessage();
      });
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
                <td>id</td>
                <td>
                  <input
                    type="text"
                    value={data.id}
                    disabled
                    onChange={(e) => setData({ ...data, id: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td>Item code</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={data.item_code}
                    onChange={(e) =>
                      setData({ ...data, item_code: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Wholesale price</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={data.whole_sale_price}
                    onChange={(e) =>
                      setData({ ...data, whole_sale_price: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Retail Price</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={data.retail_price}
                    onChange={(e) =>
                      setData({ ...data, retail_price: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Base</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={data.base}
                    onChange={(e) => setData({ ...data, base: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td>Pack size</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={data.pack_size}
                    onChange={(e) =>
                      setData({ ...data, pack_size: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Qty</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={data.qty}
                    onChange={(e) => setData({ ...data, qty: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td>Free of charge</td>
                <td>
                  {' '}
                  <input
                    type="text"
                    value={data.free_of_charge}
                    onChange={(e) =>
                      setData({ ...data, free_of_charge: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>description</td>
                <td>
                  <textarea
                    name=""
                    id=""
                    cols="20"
                    rows="3"
                    value={data.description}
                    onChange={(e) =>
                      setData({ ...data, description: e.target.value })
                    }
                  ></textarea>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="edit__content__buttons">
          <button className="remBtn" onClick={handleSave}>
            <p>Save</p>
          </button>
          <button className="addBtn">
            <p>Cancel</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
