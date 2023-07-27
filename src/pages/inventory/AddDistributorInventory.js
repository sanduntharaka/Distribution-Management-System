import React, { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Spinner from '../../components/loadingSpinner/Spinner';
import Modal from '@mui/material/Modal';
import FileUpload from '../../components/fileupload/FileUpload';

const MyMessage = React.forwardRef((props, ref) => {
  return (
    <Message
      hide={() => props.hide()}
      success={props.success}
      error={props.error}
      title={props.title}
      msg={props.msg}
      ref={ref}
    />
  );
});

const AddDistributorInventory = ({ inventory }) => {
  const inputRef = useRef(null);
  const [show_message, setShowMsg] = useState(false);
  const [show_upload, setShowUplod] = useState(false);
  const [categorys, setCategorys] = useState([]);
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
    inventory: inventory.id,
    added_by: JSON.parse(sessionStorage.getItem('user')).id,
    category: '',
    item_code: '',
    invoice_number: '',
    description: '',
    base: ' ',
    qty: '',
    pack_size: 0,
    free_of_charge: 0,
    whole_sale_price: '',
    retail_price: '',
    from_sales_return: false,
  });
  useEffect(() => {
    setLoading(true);

    axiosInstance
      .get('/category/all/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);

        setCategorys(res.data);
      })
      .catch((err) => {
        setLoading(false);

        console.log(err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    setShowUplod(false);
    setShowMsg(true);
    axiosInstance
      .post('/distributor/items/add/', data, {
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

  const handleClear = (e) => {
    e.preventDefault();

    setData({
      ...data,
      category: '',
      item_code: '',
      invoice_number: '',
      description: '',
      foc: '',
      base: '',
      qty: '',
      pack_size: '',
      free_of_charge: '',
      whole_sale_price: '',
      retail_price: '',
    });
  };
  const hanldeFileUpload = (e) => {
    e.preventDefault();
    setShowMsg(false);
    setShowUplod(true);
    handleOpen();
  };

  const handleFromSalesReturn = (e) => {
    if (e.target.checked) {
      setData({
        ...data,
        from_sales_return: true,
      });
    }
    if (e.target.checked === false) {
      setData({
        ...data,
        from_sales_return: false,
      });
    }
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
      {show_message ? (
        <Modal open={open} onClose={handleClose}>
          <MyMessage
            hide={handleClose}
            success={success}
            error={error}
            title={title}
            msg={msg}
            ref={inputRef}
          />
        </Modal>
      ) : show_upload ? (
        <Modal open={open} onClose={handleClose}>
          <FileUpload
            close={handleClose}
            ditributor={true}
            inventory={inventory.id}
            url={'/distributor/items/add/excel/'}
          />
        </Modal>
      ) : (
        ''
      )}

      <div className="page__title">
        <p>Add new product</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="" onSubmit={handleSubmit}>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Category</div>
                <div className="form__row__col__input">
                  <select
                    onChange={(e) =>
                      setData({ ...data, category: e.target.value })
                    }
                    defaultValue={''}
                    required
                  >
                    <option value="">Select Category</option>
                    {categorys.map((item, i) => (
                      <option value={item.id} key={i}>
                        {item.category_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Item Code</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type here"
                    name="item_code"
                    value={data.item_code === undefined ? '' : data.item_code}
                    onChange={(e) =>
                      setData({ ...data, item_code: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Base</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type here"
                    name="base"
                    value={data.base === undefined ? '' : data.base}
                    onChange={(e) => setData({ ...data, base: e.target.value })}
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Invoice</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type here"
                    name="invoice"
                    value={
                      data.invoice_number === undefined
                        ? ''
                        : data.invoice_number
                    }
                    onChange={(e) =>
                      setData({ ...data, invoice_number: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Wholesale Price</div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Type here"
                    name="whole_sale_price"
                    value={
                      data.whole_sale_price === undefined
                        ? ''
                        : data.whole_sale_price
                    }
                    onChange={(e) =>
                      setData({ ...data, whole_sale_price: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Retail Price</div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    placeholder="Type here"
                    step="0.01"
                    min="0"
                    name="retail_price"
                    value={
                      data.retail_price === undefined ? '' : data.retail_price
                    }
                    onChange={(e) =>
                      setData({ ...data, retail_price: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Free of Charge</div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    placeholder="Type here"
                    step="0.01"
                    min="0"
                    name="free_of_charge"
                    value={
                      data.free_of_charge === undefined
                        ? ''
                        : data.free_of_charge
                    }
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
                    placeholder="Type here"
                    name="qty"
                    value={data.qty === undefined ? '' : data.qty}
                    onChange={(e) => setData({ ...data, qty: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Pack Size</div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    placeholder="Type here"
                    name="pack_size"
                    value={data.pack_size === undefined ? '' : data.pack_size}
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
                    id="description"
                    rows="5"
                    cols="30"
                    placeholder="Type here..."
                    name="description"
                    value={
                      data.description === undefined ? '' : data.description
                    }
                    onChange={(e) =>
                      setData({ ...data, description: e.target.value })
                    }
                    required
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">
                  <p>Choose if From Sales Return</p>
                </div>
                <div className="specialColumn" style={{ display: 'grid' }}>
                  <div className="form__row__col__input aligned">
                    <input
                      type="checkbox"
                      checked={data.from_sales_return}
                      onChange={(e) => handleFromSalesReturn(e)}
                    />
                    <label htmlFor="">From Sales Return</label>
                  </div>
                </div>
              </div>
              <div className="form__row__col dontdisp"></div>
              <div className="form__row__col dontdisp"></div>
            </div>

            <div className="form__btn">
              <div className="form__btn__container">
                <button className="addBtn" onClick={(e) => hanldeFileUpload(e)}>
                  import
                </button>
                <button className="btnEdit" type="submit">
                  save
                </button>
                <button className="btnSave" onClick={(e) => handleClear(e)}>
                  clear
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDistributorInventory;
