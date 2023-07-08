import React, { useEffect, useState, useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import { axiosInstance } from '../../axiosInstance';
import Spinner from '../../components/loadingSpinner/Spinner';
import ConfimReceipt from './bill/ConfimReceipt';
import SearchSpinner from '../../components/loadingSpinner/SearchSpinner';
const MyMessage = React.forwardRef((props, ref) => {
  return (
    <Message
      hide={() => props.handleClose()}
      success={props.success}
      error={props.error}
      title={props.title}
      msg={props.msg}
      ref={ref}
    />
  );
});

const ConfirmRecieptRef = React.forwardRef((props, ref) => {
  return (
    <ConfimReceipt
      issued_by={JSON.parse(sessionStorage.getItem('user_details'))}
      items={props.items}
      set_items={props.set_items}
      set_invoice={props.set_invoice}
      data={props.data}
      set_data={props.set_data}
      close={() => props.handleClose()}
    />
  );
});

const CreateReturn = ({ inventory }) => {
  const user = JSON.parse(sessionStorage.getItem('user'));

  //message modal
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //products filter
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [product, setProduct] = useState();
  const [value2, setValue2] = useState('');
  const [items, setItems] = useState([]);

  const [psas, setPsas] = useState([]);
  const [dealers, setDealers] = useState([]);

  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    return `${year}-${month}-${day}`;
  });

  const [is_return_goods, setIs_return_goods] = useState(false);
  const [is_deduct_bill, setIs_deduct_bill] = useState(false);

  const [qty, setQty] = useState(0);
  const [foc, setFoc] = useState(0);
  const [reason, setReason] = useState('');

  const [data, setData] = useState({
    psa: '',
    dealer: '',
    date: currentDate,
    inventory: inventory.id,
    is_return_goods: is_return_goods,
    is_deduct_bill: is_deduct_bill,
    added_by: JSON.parse(sessionStorage.getItem('user_details')).id,
  });

  const [showinv, setShowInv] = useState(false);
  const [invoice, setInvoice] = useState();
  const handleCloseInv = () => {
    setShowInv(false);
  };
  const showInvoice = () => {
    setShowInv(true);
  };

  const [showDealers, setShowDealers] = useState(false);
  const [valuedealer, setValueDealer] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get('/psa/all/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);
        setPsas(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
    setLoading(true);
    axiosInstance
      .get(`/distributor/salesref/inventory/items/${inventory.id}`, {
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
    if (user.is_salesref) {
      setLoading(true);

      axiosInstance
        .get(
          `/distributor/salesref/get/bysalesref/${
            JSON.parse(sessionStorage.getItem('user_details')).id
          }`,
          {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          setData({ ...data, dis_sales_ref: res.data.id });
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setSuccess(false);
          setError(true);
          setMsg('Cannot fetch inventory. Please try again');
          setTitle('Error');
          handleOpen();
        });
    }
    if (user.is_distributor) {
      setLoading(true);

      axiosInstance
        .get(
          `/distributor/salesref/get/bydistributor/${
            JSON.parse(sessionStorage.getItem('user_details')).id
          }`,
          {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          setData({ ...data, dis_sales_ref: res.data.id });
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setSuccess(false);
          setError(true);
          setMsg('Cannot fetch inventory. Please Try again');
          setTitle('Error');
          handleOpen();
        });
    }
  }, []);

  const filterDealers = (e) => {
    setShowDealers(true);
    setSearchLoading(true);
    axiosInstance
      .get(`/dealer/all/search?search=${e.target.value}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setSearchLoading(false);

        setDealers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setValueDealer(e.target.value);
  };
  const handleSelectDealer = (e, item) => {
    setValueDealer(item.name);

    setData({
      ...data,
      dealer: item.id,
      dealer_name: item.name,
      dealer_address: item.address,
      dealer_contact: item.contact_number,
    });
    setShowDealers(false);
  };

  const filterProducts = (e) => {
    setShowProducts(true);
    setValue2(e.target.value);
  };

  const hanldeProductFilter = (e, item) => {
    setValue2(item.item_code);
    setProduct(item);
    setShowProducts(false);
  };

  const handleReturnGoods = (e) => {
    setIs_deduct_bill(false);
    setIs_return_goods(true);
    if (e.target.checked) {
      setData({ ...data, is_return_goods: true, is_deduct_bill: false });
    }
  };

  const handleReturnBill = (e) => {
    setIs_return_goods(false);
    setIs_deduct_bill(true);
    if (e.target.checked) {
      setData({ ...data, is_deduct_bill: true, is_return_goods: false });
    }
  };
  const handleAdd = (e) => {
    e.preventDefault();
    setItems([
      ...items,
      {
        id: product.id,
        item_code: product.item_code,
        qty: qty,
        foc: foc,
        reason: reason,
      },
    ]);
  };

  const handleRemove = (e, id) => {
    e.preventDefault();
    const newItems = [...items];
    const index = newItems.findIndex((item) => item.id === id);
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(false);
    showInvoice(true);
    console.log(data);
    console.log(items);
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
        <MyMessage
          handleClose={handleClose}
          success={success}
          error={error}
          title={title}
          msg={msg}
        />
      </Modal>
      <Modal
        open={showinv && loading === false}
        onClose={() => handleCloseInv()}
      >
        <ConfirmRecieptRef
          issued_by={JSON.parse(sessionStorage.getItem('user_details'))}
          items={items}
          set_items={setItems}
          invoice={invoice}
          set_invoice={setInvoice}
          oldinv={false}
          data={data}
          set_data={setData}
          handleClose={handleCloseInv}
          ref={inputRef}
        />
      </Modal>
      <div className="page__title">
        <p>Add Sales Returns</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="">
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Select pas</div>
                <div className="form__row__col__input">
                  <select
                    name="psa"
                    onChange={(e) => setData({ ...data, psa: e.target.value })}
                  >
                    <option selected>Select psa</option>
                    {psas.map((item, i) => (
                      <option value={item.id} key={i}>
                        {item.area_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Select dealer</div>
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
                      value={valuedealer}
                      onChange={(e) => filterDealers(e)}
                    />
                    {searchLoading ? (
                      <div
                        style={{
                          padding: '5px',
                          position: 'absolute',
                          right: 0,
                          top: '-2px',
                          bottom: 0,
                        }}
                      >
                        <SearchSpinner search={true} />
                      </div>
                    ) : (
                      <SearchIcon
                        style={{
                          padding: '5px',
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          bottom: 0,
                        }}
                      />
                    )}
                  </div>
                  <div
                    className="searchContent"
                    style={
                      !showDealers ? { display: 'none' } : { display: 'grid' }
                    }
                  >
                    <div className="searchContent__row">
                      <div className="searchContent__row__details">
                        <p>Name</p>
                        <p>Address</p>
                      </div>
                    </div>
                    {dealers
                      .filter((item) => {
                        const searchTerm = valuedealer.toLowerCase();
                        const name = item.name.toLowerCase();
                        const address = item.address.toLowerCase();
                        return (
                          (name.includes(searchTerm) && name !== searchTerm) ||
                          (address.includes(searchTerm) &&
                            address !== searchTerm)
                        );
                      })
                      .map((item, i) => (
                        <div
                          className="searchContent__row"
                          onClick={(e) => handleSelectDealer(e, item)}
                          key={i}
                        >
                          <div className="searchContent__row__details">
                            <p>{item.name}</p>
                            <p>{item.address}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

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
                        <p>Description</p>
                        <p>Qty</p>
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
                      .map((item) => (
                        <div
                          className="searchContent__row"
                          onClick={(e) => hanldeProductFilter(e, item)}
                        >
                          <div className="searchContent__row__details">
                            <p>{item.item_code}</p>
                            <p>{item.description}</p>
                            <p>{item.qty}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">QTY</div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Foc</div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    value={foc}
                    onChange={(e) => setFoc(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Reason</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>

              <div
                className="form__row__col"
                style={{
                  background: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <button
                  className="btnSave"
                  style={{
                    width: '250px',
                    height: '50px',
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: '25px',
                    fontSize: '20px',
                    color: 'white',
                  }}
                  onClick={(e) => handleAdd(e)}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <p className="form__row__col__label">Selected Products</p>
                <div className="showSelected">
                  <table>
                    <tr className="tableHead">
                      <th> Item Code</th>
                      <th>Foc</th>
                      <th>Qty</th>
                      <th>Reason</th>
                      <th>Action</th>
                    </tr>
                    {items.map((item, i) => (
                      <tr className="datarow" key={i}>
                        <td>{item.item_code}</td>
                        <td>{item.foc}</td>
                        <td>{item.qty}</td>
                        <td>{item.reason}</td>

                        <td className="action">
                          <button
                            className="btnDelete"
                            onClick={(e) => handleRemove(e, item.id)}
                          >
                            remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Payment Method</div>
                <div className="form__row__col__input">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      gap: '5px',
                    }}
                  >
                    <input
                      type="radio"
                      checked={is_return_goods}
                      onChange={(e) => handleReturnGoods(e)}
                    />
                    <label htmlFor="">Return from goods</label>
                  </div>
                </div>
                <div className="form__row__col__input">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      gap: '5px',
                    }}
                  >
                    <input
                      type="radio"
                      checked={is_deduct_bill}
                      onChange={(e) => handleReturnBill(e)}
                    />
                    <label htmlFor="">Deduct from bill</label>
                  </div>
                </div>

                <div className="form__row__col__input"></div>
                <div className="form__row__col__input"></div>
              </div>
            </div>

            {is_deduct_bill ? (
              <div className="form__row">
                <div className="form__row__col">
                  <div className="form__row__col__label">Bill code</div>
                  <div className="form__row__col__input">
                    <input
                      type="text"
                      onChange={(e) =>
                        setData({ ...data, bill_code: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form__row__col">
                  <div className="form__row__col__label">Bill number</div>
                  <div className="form__row__col__input">
                    <input
                      type="number"
                      onChange={(e) =>
                        setData({ ...data, bill_number: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form__row__col">
                  <div className="form__row__col__label">Amount</div>
                  <div className="form__row__col__input">
                    <input
                      type="number"
                      onChange={(e) =>
                        setData({ ...data, amount: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}

            <div className="form__btn">
              <div className="form__btn__container">
                <button className="btnEdit" onClick={(e) => handleSave(e)}>
                  save
                </button>
                {/* <button className="btnSave">edit</button> */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreateReturn;
