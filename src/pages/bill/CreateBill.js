import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { axiosInstance } from '../../axiosInstance';
import SalesRefBill from '../../components/invoice/SalesRefBill';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import Spinner from '../../components/loadingSpinner/Spinner';
import ConfimBill from './confim_bill/ConfimBill';
const CreateBill = ({ inventory }) => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    return `${year}-${month}-${day}`;
  });
  const [billingPriceMethod, setBillingPriceMethod] = useState('2');
  // const [discount, setDiscount] = useState(9);
  const [dealers, setDealers] = useState([]);
  const [payment, setPayment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [data, setData] = useState({
    dealer: '',
    dealer_name: '',
    dealer_address: '',
    dealer_contact: '',
    dis_sales_ref: '',
    date: currentDate,
    bill_code: 'INV-',
    total: 0,
    total_discount: 0,
    payment_type: payment,
    billing_price_method: billingPriceMethod,
    discount_percentage: 0,
    sub_total: 0,

    added_by: JSON.parse(sessionStorage.getItem('user')).id,
  });

  const [chequeDetails, setCequeDetails] = useState({
    date: currentDate,
    cheque_number: '',
    bank: '',
    account_number: '',
    payee_name: '',
    amount: 0,
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

  const [exceed_qty, setExceedQty] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get('/dealer/all/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);

        setDealers(res.data);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setSuccess(false);
        setError(true);
        setMsg('Cannot fetch dealers details. Please try again');
        setTitle('Error');
        handleOpen();
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
        console.log(err);
        setIsLoading(false);
        setSuccess(false);
        setError(true);
        setMsg('Cannot fetch inventory items. Please try again');
        setTitle('Error');
        handleOpen();
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
          setIsLoading(false);
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
          `/distributor/get/${
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
          setIsLoading(false);
          setSuccess(false);
          setError(true);
          setMsg('Cannot fetch inventory. Please Try again');
          setTitle('Error');
          handleOpen();
        });
    }
  }, []);
  useEffect(() => {
    if (data.sub_total !== undefined && data.discount !== undefined) {
      const total = data.sub_total - (data.sub_total * data.discount) / 100;
      setData((prevData) => ({
        ...prevData,
        total: total,
      }));
    }
  }, [data.sub_total, data.discount]);
  const handleSelectDealer = (e) => {
    let itm = e.target.value;
    let deler = dealers.find((item) => item.id == itm);
    setData({
      ...data,
      dealer: deler.id,
      dealer_name: deler.name,
      dealer_address: deler.address,
      dealer_contact: deler.contact_number,
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
  const handleClear = (e) => {
    e.preventDefault();
    setItems([]);
    setQty(0);
    setFoc(0);
    setDiscount(0);
  };
  const handleBillingPriceMethod = (e) => {
    handleClear(e);

    setBillingPriceMethod(e.target.value);
  };
  const handleAdd = (e) => {
    e.preventDefault();

    if (product.qty >= qty) {
      if (billingPriceMethod === '1') {
        setData({
          ...data,
          sub_total: data.sub_total + product.whole_sale_price * qty,
          total_discount: data.total_discount + parseFloat(discount),
        });
      }
      if (billingPriceMethod === '2') {
        setData({
          ...data,
          sub_total: data.sub_total + product.retail_price * qty,
          total_discount: data.total_discount + parseFloat(discount),
        });
      }

      setItems([
        ...items,
        {
          id: product.id,
          item_code: product.item_code,
          description: product.description,
          whole_sale_price: product.whole_sale_price,
          price: product.retail_price,
          qty: parseInt(qty),
          foc: parseInt(foc),
          discount: parseFloat(discount),
          pack_size: product.pack_size,
          extended_price:
            product.retail_price * parseInt(qty) - parseFloat(discount),
        },
      ]);
    } else {
      setExceedQty(true);
    }
  };
  const [subTotal, setSubTotal] = useState(0);
  const handleQty = (e) => {
    setExceedQty(false);
    if (e.target.value > product.qty) {
      setExceedQty(true);
    }

    setQty(e.target.value);
    if (billingPriceMethod === '1') {
      setSubTotal(product.whole_sale_price * e.target.value);
    }
    if (billingPriceMethod === '2') {
      setSubTotal(product.retail_price * e.target.value);
    }
  };

  const handleRemove = (e, i) => {
    e.preventDefault();
    const newItems = [...items];
    const index = i;
    const item = newItems[index];
    newItems.splice(index, 1);
    setItems(newItems);

    if (billingPriceMethod === '1') {
      setData({
        ...data,
        sub_total: data.sub_total - item.qty * item.whole_sale_price,
      });
    } else if (billingPriceMethod === '2') {
      setData({
        ...data,
        sub_total: data.sub_total - item.qty * item.retail_price,
      });
    }
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
    setIsLoading(false);

    setData({
      ...data,
      bill_code: 'IN-',
      date: currentDate,
      total: data.sub_total - data.total_discount,
      billing_price_method: billingPriceMethod,
    });
    setIsLoading(false);
    showInvoice();
  };

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

  const ConfirmBillRef = React.forwardRef((props, ref) => {
    return (
      <ConfimBill
        issued_by={JSON.parse(sessionStorage.getItem('user_details'))}
        items={items}
        set_items={setItems}
        set_invoice={setInvoice}
        invoice={invoice}
        oldinv={false}
        data={data}
        set_data={setData}
        close={() => props.handleClose()}
        cheque={cheque}
        cheque_detail={chequeDetails}
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
        open={showinv && isLoading === false}
        onClose={() => handleCloseInv()}
      >
        <ConfirmBillRef
          issued_by={JSON.parse(sessionStorage.getItem('user_details'))}
          items={items}
          invoice={invoice}
          oldinv={false}
          data={data}
          handleClose={handleCloseInv}
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
                <div className="form__row__col__label">Select dealer</div>
                <div className="form__row__col__input">
                  <select name="dealer" onChange={(e) => handleSelectDealer(e)}>
                    <option selected>Select dealer</option>
                    {dealers.map((item, i) => (
                      <option value={item.id} key={i}>
                        {item.name} : {item.psa_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">
                  Select billing price method{' '}
                </div>

                <div className="form__row__col__input">
                  <select
                    value={billingPriceMethod}
                    onChange={(e) => handleBillingPriceMethod(e)}
                  >
                    <option value="1">Wholesale Price</option>
                    <option value="2">Retail Price</option>
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
                        <p>Whole sale price</p>
                        <p>Retail price</p>
                        <p>Description</p>
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
                            <p>{item.qty}</p>
                            <p>{item.whole_sale_price}</p>
                            <p>{item.retail_price}</p>
                            <p>{item.description}</p>
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
                    className={exceed_qty ? 'err' : ''}
                    type="number"
                    value={qty}
                    onChange={(e) => handleQty(e)}
                  />
                </div>
                {exceed_qty ? (
                  <div className="form__row__col__error">
                    <p>Inventory has not engough quanty</p>
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">FOC</div>
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
                <div className="form__row__col__label">Sub total</div>
                <div className="form__row__col__label">{subTotal}</div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Discount</div>
                <div className="form__row__col__input">
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
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
                    <thead>
                      <tr className="tableHead">
                        <th> Item Code</th>
                        <th>Whole sale</th>
                        <th>Price</th>
                        <th>FOC</th>
                        <th>Qty</th>
                        <th>Total Qty</th>
                        <th>Sub total</th>
                        <th>Discount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => (
                        <tr className="datarow" key={i}>
                          <td>{item.item_code}</td>
                          <td>{item.whole_sale_price}</td>
                          <td>{item.price}</td>
                          <td>{item.foc}</td>
                          <td>{item.qty}</td>
                          <td>{item.qty + item.foc}</td>

                          <td>{item.qty * item.price}</td>
                          <td>{item.discount}</td>

                          <td className="action">
                            <button
                              className="btnDelete"
                              onClick={(e) => handleRemove(e, i)}
                            >
                              remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
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
                <p>Rs {data.sub_total}/-</p>
              </div>
            </div>
            {/* <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Discount percentage</div>

                <div className="form__row__col__input">
                  <input
                    type="number"
                    id="percentage"
                    name="percentage"
                    min="0"
                    max="100"
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </div>
              </div>
              <div className="form__row__col dontdisp"></div>
              <div className="form__row__col dontdisp"></div>
            </div> */}
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
                <p>Final Total:</p>
                <p>Rs {data.sub_total - data.total_discount}/-</p>
              </div>
            </div>

            {/* <div className="form__row">
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
            </div> */}

            {/* {cheque ? (
              <div className="form__row">
                <div className="form__row__col">
                  <div className="form__row__col__label">Cheque Number</div>
                  <div className="form__row__col__input">
                    <input
                      type="text"
                      onChange={(e) =>
                        setCequeDetails({
                          ...chequeDetails,
                          cheque_number: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form__row__col">
                  <div className="form__row__col__label">Account Number</div>
                  <div className="form__row__col__input">
                    <input
                      type="text"
                      onChange={(e) =>
                        setCequeDetails({
                          ...chequeDetails,
                          account_number: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form__row__col">
                  <div className="form__row__col__label">Bank</div>
                  <div className="form__row__col__input">
                    <input
                      type="text"
                      onChange={(e) =>
                        setCequeDetails({
                          ...chequeDetails,
                          bank: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form__row__col">
                  <div className="form__row__col__label">Payee name</div>
                  <div className="form__row__col__input">
                    <input
                      type="text"
                      onChange={(e) =>
                        setCequeDetails({
                          ...chequeDetails,
                          payee_name: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form__row__col">
                  <div className="form__row__col__label">Date</div>
                  <div className="form__row__col__input">
                    <input
                      type="date"
                      onChange={(e) =>
                        setCequeDetails({
                          ...chequeDetails,
                          date: e.target.value,
                        })
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
                        setCequeDetails({
                          ...chequeDetails,
                          amount: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ) : (
              ''
            )} */}

            <div className="form__btn">
              <div className="form__btn__container">
                <button className="btnEdit " onClick={(e) => hadleCreate(e)}>
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

export default CreateBill;
