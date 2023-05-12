import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { axiosInstance } from '../../axiosInstance';
import SalesRefBill from '../../components/invoice/SalesRefBill';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import Spinner from '../../components/loadingSpinner/Spinner';
const CreateBill = ({ inventory }) => {
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    return `${year}-${month}-${day}`;
  });
  const [psas, setPsas] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [payment, setPayment] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    psa: '',
    dealer: '',
    dealer_name: '',
    dealer_address: '',
    dis_sales_ref: '',
    date: currentDate,
    bill_code: 'IN',
    total: 0,
    discount: discount,
    payment_type: payment,
    added_by: JSON.parse(sessionStorage.getItem('user')).id,
  });

  //products filter
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [product, setProduct] = useState();
  const [value2, setValue2] = useState('');
  const [items, setItems] = useState([]);

  // qty

  const [qty, setQty] = useState(0);
  const [foc, setFoc] = useState(0);

  const [cash, setCash] = useState(false);
  const [cheque, setCheque] = useState(false);
  const [credit, setCredit] = useState(false);

  //invoice show
  const [showinv, setShowInv] = useState(false);
  const [invoice, setInvoice] = useState();
  const handleCloseInv = () => {
    setShowInv(false);
  };
  const showInvoice = () => {
    setShowInv(true);
  };

  //message modal
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    console.log(inventory);
    axiosInstance
      .get('/psa/all/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setPsas(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axiosInstance
      .get('/dealer/all/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setDealers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axiosInstance
      .get(`/distributor/salesref/inventory/items/${inventory.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
        setData({ ...data, dis_sales_ref: res.data.id });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSelectDealer = (e) => {
    let itm = e.target.value;
    let deler = dealers.find((item) => item.id == itm);
    setData({
      ...data,
      dealer: deler.id,
      dealer_name: deler.name,
      dealer_address: deler.address,
    });
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

  const handleAdd = (e) => {
    e.preventDefault();
    setData({ ...data, total: data.total + product.retail_price * qty });
    // setTotal(total + product.retail_price * qty);
    setItems([
      ...items,
      {
        id: product.id,
        item_code: product.item_code,
        description: product.description,
        whole_sale_price: product.whole_sale_price,
        price: product.retail_price,
        qty: qty,
        foc: foc,
        pack_size: product.pack_size,
        extended_price: product.retail_price * qty,
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

  const handleCash = (e) => {
    setCheque(false);
    setCredit(false);
    setCash(true);
    if (e.target.checked) {
      setData({ ...data, payment_type: 'cash' });
    }
  };
  const handleCheque = (e) => {
    setCash(false);
    setCredit(false);
    setCheque(true);
    if (e.target.checked) {
      setData({ ...data, payment_type: 'cheque' });
    }
  };
  const handleCredit = (e) => {
    setCash(false);
    setCheque(false);
    setCredit(true);
    if (e.target.checked) {
      setData({ ...data, payment_type: 'credit' });
    }
  };

  const hadleCreate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setData({
      ...data,
      bill_code: 'IN',
      date: currentDate,
    });
    axiosInstance
      .post('/salesref/invoice/create/invoice/', data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res.data);
        setInvoice(res.data);
        const item_data = {
          bill: res.data.id,
          items: items,
        };
        axiosInstance
          .post('/salesref/invoice/create/invoice/items/', item_data, {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          })
          .then((res) => {
            setIsLoading(false);
            console.log(res.data);
            showInvoice();
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
            setSuccess(false);
            setError(true);
            setMsg(
              'Your bill cannot create. Please refresh the page and try again.'
            );
            setTitle('Error');
            handleOpen();
          });
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setIsLoading(false);
        setSuccess(false);
        setError(true);
        setMsg(
          'Your bill cannot create. Please refresh the page and try again.'
        );
        setTitle('Error');
        handleOpen();
      });
  };
  const MyInvoice = React.forwardRef((props, ref) => {
    return (
      <SalesRefBill
        issued_by={props.issued_by}
        items={props.items}
        invoice={props.invoice}
        data={props.data}
      />
    );
  });

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

  return (
    <div className="page">
      {isLoading ? (
        <div className="page-spinner">
          <div className="page-spinner__back">
            <Spinner detail={true} />
          </div>
        </div>
      ) : (
        ''
      )}
      <Modal
        open={showinv && isLoading === false}
        onClose={() => handleCloseInv()}
      >
        <MyInvoice
          issued_by={JSON.parse(sessionStorage.getItem('user_details'))}
          items={items}
          invoice={invoice}
          oldinv={false}
          data={data}
        />
      </Modal>
      <Modal open={open} onClose={handleClose}>
        <MyMessage
          handleClose={handleClose}
          success={success}
          error={error}
          title={title}
          msg={msg}
        />
      </Modal>
      <div className="page__title">
        <p>Create Bill</p>
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
                  <select name="psa" onChange={(e) => handleSelectDealer(e)}>
                    <option selected>Select dealer</option>
                    {dealers.map((item, i) => (
                      <option value={item.id} key={i}>
                        {item.name}
                      </option>
                    ))}
                  </select>
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
                        <p>Qty</p>
                      </div>
                    </div>
                    {products
                      .filter((item) => {
                        const searchTerm = value2.toLowerCase();
                        const ItemCode = item.item_code.toLowerCase();

                        return (
                          ItemCode.includes(searchTerm) &&
                          ItemCode !== searchTerm
                        );
                      })
                      .map((item) => (
                        <div
                          className="searchContent__row"
                          onClick={(e) => hanldeProductFilter(e, item)}
                        >
                          <div className="searchContent__row__details">
                            <p>{item.item_code}</p>
                            <p>{item.qty}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">
                  QTY(add qty with foc)
                </div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">
                  FOC(add foc count only)
                </div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    value={foc}
                    onChange={(e) => setFoc(e.target.value)}
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
                      <th>Whole sale</th>
                      <th>Price</th>
                      <th>FOC</th>
                      <th>Qty</th>
                      <th>Sub total</th>
                      <th>Action</th>
                    </tr>
                    {items.map((item, i) => (
                      <tr className="datarow" key={i}>
                        <td>{item.item_code}</td>
                        <td>{item.whole_sale_price}</td>
                        <td>{item.price}</td>
                        <td>{item.foc}</td>
                        <td>{item.qty}</td>
                        <td>{item.qty * item.price}</td>

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
              <div
                className="form__row__col"
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  background: 'white',
                  gap: 10,
                  fontWeight: 'bolder',
                }}
              >
                <p>Total:</p>
                <p>Rs {data.total}/-</p>
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
                      checked={cash}
                      onChange={(e) => handleCash(e)}
                    />
                    <label htmlFor="">Cash</label>
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
                      checked={cheque}
                      onChange={(e) => handleCheque(e)}
                    />
                    <label htmlFor="">Cheque</label>
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
                      checked={credit}
                      onChange={(e) => handleCredit(e)}
                    />
                    <label htmlFor="">Credit</label>
                  </div>
                </div>

                <div className="form__row__col__input"></div>
                <div className="form__row__col__input"></div>
              </div>
            </div>

            <div className="form__btn">
              <div className="form__btn__container">
                <button className="btnEdit" onClick={(e) => hadleCreate(e)}>
                  save
                </button>
                <button className="btnSave">clear</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBill;
