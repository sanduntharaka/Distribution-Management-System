import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../../axiosInstance';

const ProductEdit = (props) => {
  const [data, setData] = useState({
    id: props.data.id,
    item_code: props.data.item_code,
    description: props.data.description,
    category: props.data.category,
    base: props.data.base,
  });
  const [categorys, setCategorys] = useState([]);
  useEffect(() => {
    axiosInstance
      .get('/category/all/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res.data);
        setCategorys(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    axiosInstance
      .put(`${props.url}/${props.data.id}`, data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res);
        props.showEdit(false);
        props.msgErr(false);
        props.msgSuccess(true);
        props.msgTitle('Success');
        props.msg('Item details edited successfully');
        props.openMsg(true);
      })
      .catch((err) => {
        console.log(err);
        props.showEdit(false);
        props.msgSuccess(false);
        props.msgErr(true);
        props.msgTitle('Error');
        props.msg(
          'Item details cannot update at the moment. Please try again later'
        );
        props.openMsg(true);
      });
  };
  const handleClose = () => {
    props.closeModal();
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
                <td>Category</td>
                <td>
                  <select
                    value={data.category}
                    onChange={(e) =>
                      setData({ ...data, category: e.target.value })
                    }
                  >
                    {categorys.map((item, i) => (
                      <option value={item.id} key={i}>
                        {item.category_name}
                      </option>
                    ))}
                  </select>
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
          <button className="addBtn" onClick={handleClose}>
            <p>Cancel</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
