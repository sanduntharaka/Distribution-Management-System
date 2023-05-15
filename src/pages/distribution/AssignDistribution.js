import React, { useEffect, useState, useRef } from 'react';
import Message from '../../components/message/Message';
import SearchIcon from '@mui/icons-material/Search';

import Modal from '@mui/material/Modal';
import { axiosInstance } from '../../axiosInstance';
import Invoice from '../../components/invoice/Invoice';
import Spinner from '../../components/loadingSpinner/Spinner';
const AssignDistribution = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    return `${year}-${month}-${day}`;
  });

  const catMenu = useRef();

  const [inpValid, setInputValid] = useState({
    input_dist: false,
    show_dist: false,
  });
  const [billingPriceMethod, setBillingPriceMethod] = useState('1');
  const [discount, setDiscount] = useState(9);
  const [exceed_qty, setExceedQty] = useState(false);
  const [total, setTotal] = useState(0);
  //message modal
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //distributor filter
  const [distributors, setDistributors] = useState([]);
  const [showDistributors, setShowDistributors] = useState(false);
  const [distributor, setDistributor] = useState();
  const [value, setValue] = useState('');

  //products filter
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [product, setProduct] = useState();
  const [value2, setValue2] = useState('');
  const [items, setItems] = useState([]);
  const [invData, setInvdata] = useState('');
  // qty

  const [qty, setQty] = useState(0);
  const [foc, setFoc] = useState(0);

  //invoice show
  const [showinv, setShowInv] = useState(false);
  const handleCloseInv = () => {
    setShowInv(false);
  };
  const showInvoice = () => {
    setShowInv(true);
  };
  //for skelton
  useEffect(() => {
    //get distributors lizt and product list
    setLoading(true);
    axiosInstance
      .get('/users/distributors/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);
        setDistributors(res.data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg('Distributors details not loading. ');
        handleOpen();
      });

    axiosInstance
      .get('/company/inventory/all/', {
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
        setLoading(false);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg('Inventory items details not loading. ');
        handleOpen();
      });
  }, []);

  //show distributors drop down

  const filterDistributors = (e) => {
    setShowDistributors(true);
    setValue(e.target.value);
    setInputValid({ ...inpValid, show_dist: false, input_dist: true });
  };

  const habldtest = () => {};
  //set choosed distributor
  const hanldeCatchFilter = (e, item) => {
    setValue(item.full_name);

    setDistributor({
      user: item.id,
      full_name: item.full_name,
    });
    setShowDistributors(false);
  };

  const handleSubmit = () => {};

  //remove selected items
  const handleRemove = (e, i) => {
    e.preventDefault();
    const newItems = [...items];
    const index = i;
    const item = newItems[index];
    newItems.splice(index, 1);
    setItems(newItems);
    if (billingPriceMethod === '1') {
      setTotal(total - item.qty * item.whole_sale_price);
    } else if (billingPriceMethod === '2') {
      setTotal(total - item.qty * item.retail_price);
    }
  };
  //show products drop down
  const filterProducts = (e) => {
    setShowProducts(true);
    setValue2(e.target.value);
  };
  //select product
  const hanldeProductFilter = (e, item) => {
    console.log(item);
    setValue2(item.item_code);
    setProduct(item);
    setShowProducts(false);
  };
  const handleClear = (e) => {
    e.preventDefault();
    setItems([]);
    setQty(0);
    setFoc(0);
    setTotal(0);
  };
  const handleBillingPriceMethod = (e) => {
    handleClear(e);

    setBillingPriceMethod(e.target.value);
  };
  //add selected prodcut and qty into items list
  const handleAdd = (e) => {
    e.preventDefault();
    if (product.qty >= qty) {
      setItems([
        ...items,
        {
          id: product.id,
          item_code: product.item_code,
          description: product.description,
          whole_sale_price: product.whole_sale_price,
          retail_price: product.retail_price,
          qty: qty,
          free_of_charge: foc,
        },
      ]);
      if (billingPriceMethod === '1') {
        setTotal(total + qty * product.whole_sale_price);
      } else if (billingPriceMethod === '2') {
        setTotal(total + qty * product.retail_price);
      }
    } else {
      setExceedQty(true);
    }
  };
  const handleQty = (e) => {
    setExceedQty(false);
    if (e.target.value > product.qty) {
      setExceedQty(true);
    }
    setQty(e.target.value);
  };
  //submit all selected items to database
  const handleSave = (e) => {
    e.preventDefault();
    if (inpValid.input_dist === false) {
      setInputValid({ ...inpValid, show_dist: true });
    }
    console.log(inpValid);
    if (items.length > 0 && inpValid.input_dist) {
      setLoading(true);
      const data = {
        invoice_code: 'IN',
        solled_to: distributor.user,
        issued_by: JSON.parse(sessionStorage.getItem('user')).id,
        date: currentDate,
        total: total - (total * discount) / 100,
        billing_price_method: billingPriceMethod,
        discount_percentage: discount,
        sub_total: total,
      };
      axiosInstance
        .post(
          '/company/invoice/add/',
          {
            data: {
              inv: data,
            },
          },
          {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          }
        )
        .then((res) => {
          setInvdata(res.data);
          console.log(res.data);
          axiosInstance
            .post(
              `/company/invoice/add/items/${res.data.id}`,
              {
                data: {
                  items: items,
                },
              },
              {
                headers: {
                  Authorization:
                    'JWT ' +
                    JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
              }
            )
            .then((res) => {
              setLoading(false);

              showInvoice();
              setSuccess(true);
              setError(false);
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
              setSuccess(false);
              setError(true);
              setTitle('Error');
              setMsg('Check your inputs and try again later. ');
              handleOpen();
            });
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setSuccess(false);
          setError(true);
          setTitle('Error');
          setMsg('Check your inputs and try again later. ');
          handleOpen();
        });
    }
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

  const MyInvoice = React.forwardRef((props, ref) => {
    return (
      <Invoice
        distributor={props.distributor}
        items={props.items}
        inv={props.inv}
        oldinv={props.oldinv}
      />
    );
  });

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
      <div className="page__title">
        <p>Invoicing</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="" onSubmit={handleSubmit}>
            <div className="form__row">
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
              <div className="form__row__col dontdisp"></div>
              <div className="form__row__col dontdisp"></div>
            </div>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Distributor</div>

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
                      className={inpValid.show_dist ? 'err' : ''}
                      value={value}
                      onChange={(e) => filterDistributors(e)}
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
                    ref={catMenu}
                    className="searchContent"
                    style={
                      !showDistributors
                        ? { display: 'none' }
                        : { display: 'grid' }
                    }
                  >
                    {distributors

                      .filter((item) => {
                        const searchTerm = value.toLowerCase();
                        const fullName = item.full_name.toLowerCase();

                        return (
                          fullName.includes(searchTerm) &&
                          fullName !== searchTerm
                        );
                      })
                      .map((item, i) => (
                        <ul
                          className="searchContent__row"
                          onClickCapture={habldtest}
                          onClick={(e) => hanldeCatchFilter(e, item)}
                          key={i}
                        >
                          <li
                            style={{ cursor: 'pointer' }}
                            className="searchContent__row__details"
                          >
                            {item.user_name}
                          </li>
                        </ul>
                      ))}
                  </div>
                </div>
                {inpValid.show_dist ? (
                  <div className="form__row__col__error">
                    <p>This field is required</p>
                  </div>
                ) : (
                  ''
                )}
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
                            <p>{item.date}</p>
                            <p>{item.description}</p>
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
                    className={exceed_qty ? 'err' : ''}
                    type="text"
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
                <div className="form__row__col__label">
                  {' '}
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

              <button
                className="btnSave"
                style={{
                  width: '200px',
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

            <div className="form__row">
              <div className="form__row__col">
                <p className="form__row__col__label">Selected Products</p>
                <div className="showSelected">
                  <table>
                    <thead>
                      <tr className="tableHead">
                        <th> Item Code</th>
                        <th>Whole sale</th>
                        <th>Retail</th>
                        <th>FOC</th>
                        <th>Qty</th>
                        <th>Sub total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => (
                        <tr className="datarow" key={i}>
                          <td>{item.item_code}</td>
                          <td>{item.whole_sale_price}</td>
                          <td>{item.retail_price}</td>
                          <td>{item.qty}</td>
                          <td>{item.free_of_charge}</td>
                          <td>
                            {billingPriceMethod === '1'
                              ? item.qty * item.whole_sale_price
                              : billingPriceMethod === '2'
                              ? item.qty * item.retail_price
                              : 0}
                          </td>
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
                <p>Rs {total}/-</p>
              </div>
            </div>
            <div className="form__row">
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
                <p>Final Total:</p>
                <p>Rs {total - (total * discount) / 100}/-</p>
              </div>
            </div>
            <div className="form__btn">
              <div className="form__btn__container">
                <button className="btnEdit" onClick={(e) => handleSave(e)}>
                  complete
                </button>
                <button className="btnDelete" onClick={(e) => handleClear(e)}>
                  clear
                </button>
              </div>
            </div>
          </form>
        </div>
        <Modal open={showinv} onClose={() => handleCloseInv()}>
          <MyInvoice
            distributor={distributor}
            items={items}
            oldinv={false}
            inv={invData}
          />
        </Modal>
      </div>
    </div>
  );
};

export default AssignDistribution;
