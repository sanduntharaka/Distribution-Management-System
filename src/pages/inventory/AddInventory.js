import React, { useState } from 'react';
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Spinner from '../../components/loadingSpinner/Spinner';
import Modal from '@mui/material/Modal';
const AddInventory = () => {
  //message modal
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [data, setData] = useState({
    employee: JSON.parse(sessionStorage.getItem('user')).id,
    item_code: '',
    description: '',
    base: '',
    qty: '',
    pack_size: '',
    free_of_charge: '',
    whole_sale_price: '',
    retail_price: '',
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .post('/company/inventory/add/', data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);

        setError(false);
        setSuccess(true);
        setTitle('Success');
        setMsg('Product add to the inventory.');
        handleOpen();
      })
      .catch((err) => {
        setLoading(false);

        console.log(err);
        setSuccess(false);
        setError(true);

        setTitle('Error');
        setMsg('Cannot save data. Please check and try again.');
        handleOpen();
      });
  };

  return (
    <div className="page">
      {loading ? (
        <div className="page-spinner">
          <div className="page-spinner__back">
            <Spinner detail={true} />
          </div>
        </div>
      ) : (
        ''
      )}
      <Modal open={open} onClose={handleClose}>
        <Message
          hide={handleClose}
          success={success}
          error={error}
          title={title}
          msg={msg}
        />
      </Modal>
      <div className="page__title">
        <p>Add inventory</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="" onSubmit={handleSubmit}>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Item Code</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="type here"
                    onChange={(e) =>
                      setData({ ...data, item_code: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">base</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="type here"
                    onChange={(e) => setData({ ...data, base: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Whole sale price</div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="type here"
                    onChange={(e) =>
                      setData({ ...data, whole_sale_price: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Retail price</div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    placeholder="type here"
                    step="0.01"
                    min="0"
                    onChange={(e) =>
                      setData({ ...data, retail_price: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Free of Charge</div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    placeholder="type here"
                    step="0.01"
                    min="0"
                    onChange={(e) =>
                      setData({ ...data, free_of_charge: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">QTY</div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    placeholder="type here"
                    onChange={(e) => setData({ ...data, qty: e.target.value })}
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Pack Size</div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    placeholder="type here"
                    onChange={(e) =>
                      setData({ ...data, pack_size: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Description</div>
                <div className="form__row__col__input">
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    cols="30"
                    placeholder="type here..."
                    onChange={(e) =>
                      setData({ ...data, description: e.target.value })
                    }
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="form__btn">
              <div className="form__btn__container">
                <button className="btnEdit" type="submit">
                  save
                </button>
                <button className="btnSave">edit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInventory;
