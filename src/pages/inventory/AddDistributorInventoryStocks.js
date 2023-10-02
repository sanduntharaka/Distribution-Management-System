import React, { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Spinner from '../../components/loadingSpinner/Spinner';
import Modal from '@mui/material/Modal';
import FileUpload from '../../components/fileupload/FileUpload';
import SearchIcon from '@mui/icons-material/Search';
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

const AddDistributorInventoryStocks = ({ inventory }) => {
  const inputRef = useRef(null);
  const [show_message, setShowMsg] = useState(false);
  const [show_upload, setShowUplod] = useState(false);
  const [categorys, setCategorys] = useState([]);

  //products filter
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [product, setProduct] = useState();
  const [value2, setValue2] = useState('');
  const [items, setItems] = useState([]);

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
    added_by: JSON.parse(sessionStorage.getItem('user')).id,
    item: '',
    addedQty: 0,
    invoice_number: '',
    qty: 0,
    pack_size: '',
    foc: 0,
    whole_sale_price: '',
    retail_price: '',
    from_sales_return: false,
  });
  useEffect(() => {
    setLoading(true);

    axiosInstance
      .get(`/distributor/all/${inventory.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);
        setProducts(res.data);
      })
      .catch((err) => {
        setLoading(false);

        console.log(err);
      });
  }, []);
  useEffect(() => {
    setData({ ...data, qty: parseInt(data.addedQty) + parseInt(data.foc) });
  }, [data.addedQty, data.foc]);
  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    setShowUplod(false);
    setShowMsg(true);
    axiosInstance
      .post('/distributor/stoks/add/', data, {
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
      base: '',
      qty: 0,
      addedQty: 0,
      pack_size: 0,
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

  const filterProducts = (e) => {
    setShowProducts(true);
    setValue2(e.target.value);
  };
  const hanldeProductFilter = (e, item) => {
    setValue2(item.item_code);
    setProduct(item);
    setShowProducts(false);
    setData({ ...data, item: item.id });
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
        <p>Add stocks</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="" onSubmit={handleSubmit}>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Item</div>
                <div className="form__row__col__input">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="search..."
                      value={value2}
                      onChange={(e) => filterProducts(e)}
                      required
                    />
                    <SearchIcon
                      style={{
                        padding: '5px',
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                      }}
                    />
                  </div>
                  <div
                    className="searchContent"
                    style={
                      !showProducts ? { display: 'none' } : { display: 'grid' }
                    }
                  >
                    {' '}
                    <div className="searchContent__row">
                      <div className="searchContent__row__details">
                        <p>Item Code</p>
                        <p>Category</p>
                        <p>Description</p>
                        <p>Base</p>
                      </div>
                    </div>
                    {products
                      .filter((item) => {
                        const searchTerm = value2.toLowerCase();
                        const ItemCode = item.item_code.toLowerCase();
                        const description = item.description.toLowerCase();
                        return (
                          (ItemCode.includes(searchTerm) &&
                            ItemCode !== searchTerm) ||
                          (description.includes(searchTerm) &&
                            description !== searchTerm)
                        );
                      })
                      .map((item, i) => (
                        <div
                          className="searchContent__row"
                          onClick={(e) => hanldeProductFilter(e, item)}
                          key={i}
                        >
                          <div className="searchContent__row__details">
                            <p>{item.item_code}</p>
                            <p>{item.category_name}</p>
                            <p>{item.description}</p>
                            <p>{item.base}</p>
                          </div>
                        </div>
                      ))}
                  </div>
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
                <div className="form__row__col__label">Whole Sale Price</div>
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
                <div className="form__row__col__label">QTY</div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    placeholder="Type here"
                    name="qty"
                    value={data.addedQty === undefined ? '' : data.addedQty}
                    onChange={(e) =>
                      setData({
                        ...data,
                        addedQty: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Free of Charge</div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    placeholder="Type here"
                    name="free_of_charge"
                    value={data.foc === undefined ? '' : data.foc}
                    onChange={(e) =>
                      setData({
                        ...data,
                        foc: e.target.value,
                      })
                    }
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
                    required
                  />
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

export default AddDistributorInventoryStocks;
