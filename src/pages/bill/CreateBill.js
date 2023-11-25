import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { axiosInstance } from '../../axiosInstance';
import { DateTime } from 'luxon';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import Spinner from '../../components/loadingSpinner/Spinner';
import ConfimBill from './confim_bill/ConfimBill';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import WebSocketInstance from '../../WebSocket';
import SearchSpinner from '../../components/loadingSpinner/SearchSpinner';

const CreateBill = ({ inventory }) => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    return `${year}-${month}-${day}`;
  });
  const [currentTime, setCurrentTime] = useState(
    DateTime.local().toFormat('HH:mm:ss')
  );

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
    inventory: inventory.id,
    dis_sales_ref: '',
    date: currentDate,
    time: currentTime,
    bill_code: '',
    total: 0,
    total_discount: 0,
    payment_type: payment,
    billing_price_method: billingPriceMethod,
    discount_percentage: 0,
    sub_total: 0,
    payment_method: '',
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
  const [searchLoadingProducts, setSearchLoadingProducts] = useState(false);

  // qty

  const [qty, setQty] = useState(0);
  const [foc, setFoc] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
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
  const [showDealers, setShowDealers] = useState(false);
  const [valuedealer, setValueDealer] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectDealer, setSelectDealer] = useState(false)

  const [nextDealer, setNextDealer] = useState('')

  const [updates, setUpdates] = useState([]);
  const [terriotires, setTerriotories] = useState([])

  // useEffect(() => {
  //   const websocket = new WebSocketInstance('nextdealer');  // Replace 'route_name' with the actual route name
  //   websocket.connect();
  //   websocket.addCallback(handleWebSocketUpdate);

  //   return () => {
  //     websocket.close();
  //   };
  // }, []);

  // const handleWebSocketUpdate = (update) => {
  //   setUpdates(prevUpdates => [...prevUpdates, update]);
  // };
  useEffect(() => {
    // if (user.is_salesref) {
    //   setLoading(true);
    //   axiosInstance
    //     .get(
    //       `/distributor/salesref/get/bysalesref/${JSON.parse(sessionStorage.getItem('user_details')).id
    //       }`,
    //       {
    //         headers: {
    //           Authorization:
    //             'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
    //         },
    //       }
    //     )
    //     .then((res) => {
    //       setLoading(false);
    //       console.log('asdasd:', res.data.id)
    //       setData({ ...data, dis_sales_ref: res.data.id });
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       setIsLoading(false);
    //       setSuccess(false);
    //       setError(true);
    //       setMsg('Cannot fetch distrubutor relationship. Please try again');
    //       setTitle('Error');
    //       handleOpen();
    //     });
    // }
    axiosInstance
      .get(
        `/users/get/terriotires/${JSON.parse(sessionStorage.getItem('user_details')).id
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
        setTerriotories(res.data)
        if (user.is_salesref) {
          console.log('cde:', res.data[0].code)
          setData({ ...data, bill_code: 'INV-' + res.data[0].code })
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setSuccess(false);
        setError(true);
        setMsg('Cannot fetch distrubutor terriotories. Please try again');
        setTitle('Error');
        handleOpen();
      });
  }, [])

  // useEffect(() => {
  //   axiosInstance
  //     .get(
  //       `/users/get/terriotires/${JSON.parse(sessionStorage.getItem('user_details')).id
  //       }`,
  //       {
  //         headers: {
  //           Authorization:
  //             'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
  //         },
  //       }
  //     )
  //     .then((res) => {
  //       setLoading(false);
  //       setTerriotories(res.data)
  //       if (user.is_salesref) {
  //         console.log('cde:', res.data[0].code)
  //         setData({ ...data, bill_code: 'INV' + res.data[0].code })
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setIsLoading(false);
  //       setSuccess(false);
  //       setError(true);
  //       setMsg('Cannot fetch distrubutor terriotories. Please try again');
  //       setTitle('Error');
  //       handleOpen();
  //     });
  // }, [])



  useEffect(() => {
    if (user.is_salesref) {
      axiosInstance
        .get(
          `/dashboard/get/next/visit/`,

          {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          }
        )
        .then((res) => {
          console.log('next', res.data);
          setNextDealer(res.data.dealer)
        });
    }

    if (user.is_distributor) {
      setLoading(true);

      axiosInstance
        .get(
          `distributor/salesref/get/bydistributor/single/${JSON.parse(sessionStorage.getItem('user_details')).id
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
          setData({ ...data, dis_sales_ref: res.data });
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setSuccess(false);
          setError(true);
          setMsg('Cannot fetch distrubutor relationship. Please try again');
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



  const filterDealers = (e) => {
    setShowDealers(true);
    setSearchLoading(true);
    setSelectDealer(false)
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
    setAddedsameItem(false);
    setSearchLoadingProducts(true);

    axiosInstance
      .get(
        `/distributor/salesref/inventory/items/${inventory.id}/search?search=${e.target.value}`,
        {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        }
      )
      .then((res) => {
        setSearchLoadingProducts(false);
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setValue2(e.target.value);
  };
  const [addedsameItem, setAddedsameItem] = useState(false);
  const hanldeProductFilter = (e, item) => {
    setValue2(item.item_code);
    setProduct(item);
    setShowProducts(false);
    if (
      items.some((element) => {
        if (element.id === item.id) {
          return true;
        }

        return false;
      })
    ) {
      console.log('found');
      setAddedsameItem(true);
    }
  };
  const handleClear = (e) => {
    e.preventDefault();
    setItems([]);
    setQty(0);
    setFoc(0);
    setDiscount(0);
    setValue2('');
    setValueDealer('');
    setData({
      ...data,
      dealer: '',
      dealer_name: '',
      dealer_address: '',
      dealer_contact: '',
      inventory: inventory.id,
      date: currentDate,
      time: currentTime,
      total: 0,
      total_discount: 0,
      payment_type: payment,
      billing_price_method: billingPriceMethod,
      discount_percentage: 0,
      sub_total: 0,
      payment_method: '',
      added_by: JSON.parse(sessionStorage.getItem('user')).id,
    });
  };
  const handleClearAll = () => {
    setItems([]);
    setValue2('');
    setValueDealer('');
    setQty(0);
    setFoc(0);
    setDiscount(0);
    setDealers([]);
    setData({
      ...data,
      dealer: '',
      dealer_name: '',
      dealer_address: '',
      dealer_contact: '',
      inventory: inventory.id,
      date: currentDate,
      time: currentTime,
      total: 0,
      total_discount: 0,
      payment_type: payment,
      billing_price_method: billingPriceMethod,
      discount_percentage: 0,
      sub_total: 0,
      payment_method: '',
      added_by: JSON.parse(sessionStorage.getItem('user')).id,
    });
  };
  const handleBillingPriceMethod = (e) => {
    handleClear(e);

    setBillingPriceMethod(e.target.value);
    setData({ ...data, billing_price_method: e.target.value })
  };
  const handleAdd = (e) => {
    e.preventDefault();
    if (addedsameItem === false) {
      if (product.qty + product.foc >= qty) {
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
              billingPriceMethod == '1'
                ? product.whole_sale_price * parseInt(qty) -
                parseFloat(discount)
                : product.retail_price * parseInt(qty) - parseFloat(discount),
          },
        ]);

        setQty(0);
        setFoc(0);
        setSubTotal(0);
        setDiscount(0);
        setValue2('');
      } else {
        setExceedQty(true);
      }
    }
  };

  const handleQty = (e) => {
    console.log(e.target.value)
    setExceedQty(false);
    if (e.target.value > product.qty + product.foc) {
      setExceedQty(true);
    } else {
      setQty(e.target.value);

    }

    if (billingPriceMethod === '1') {
      setSubTotal(product.whole_sale_price * e.target.value);
    }
    if (billingPriceMethod === '2') {
      setSubTotal(product.retail_price * e.target.value);
    }
  };


  const handleFoc = (e) => {
    setExceedQty(false);
    if (parseInt(e.target.value) + parseInt(qty) > product.qty) {
      setExceedQty(true);
    } else {
      setFoc(e.target.value)

    }


  };



  const handleRemove = (e, i) => {
    e.preventDefault();
    const newItems = [...items];
    const index = i;
    const item = newItems[index];
    newItems.splice(index, 1);
    setItems(newItems);

    setData({
      ...data,
      sub_total: data.sub_total - (item.extended_price + item.discount),
      total_discount: data.total_discount - item.discount,
    });

    setSubTotal(0);
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


  const disStefTempory = () => {
    if (user.is_salesref) {
      setLoading(true);
      axiosInstance
        .get(
          `/distributor/salesref/get/bysalesref/${JSON.parse(sessionStorage.getItem('user_details')).id
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
          console.log('asdasd:', res.data.id)
          setData({ ...data, dis_sales_ref: res.data.id });
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setSuccess(false);
          setError(true);
          setMsg('Cannot fetch distrubutor relationship. Please try again');
          setTitle('Error');
          handleOpen();
        });
    }


  }


  const hadleCreate = (e) => {
    e.preventDefault();
    disStefTempory()

    setIsLoading(false);
    setSelectDealer(false)

    if (data.dealer !== '') {
      setSelectDealer(false)

      setData({
        ...data,
        total: data.sub_total - data.total_discount,
      });
      setIsLoading(false);
      showInvoice();

    } else {
      setSelectDealer(true)
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
        clear={() => props.clear()}
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
          clear={handleClearAll}
        />
      </Modal>
      <div className="page__title">
        <p>Create Bill</p>
      </div>
      <div className="page__pcont">
        <div className="page__pcont__row center">
          {
            user.is_salesref ? (<div className="page__pcont__row__col">
              <div className="nextVisit" >
                Next visit : {nextDealer}
              </div>
            </div>) : ''
          }

        </div>
        <div className="form">
          <form action="">
            <div className="form__row">
              {
                user.is_distributor ?
                  <div className="form__row__col">
                    <div className="form__row__col__label">Terriotory</div>
                    <div className="form__row__col__input">
                      <select defaultValue={""} name="" id="" onChange={(e) => setData({ ...data, bill_code: 'INV' + e.target.value })}>
                        <option value="">Select terriotory</option>

                        {
                          terriotires.map((item, i) => (
                            <option value={item.code} key={i}>{item.terriotory_name}:{item.code}</option>
                          ))
                        }


                      </select>
                    </div>
                  </div> : ''

              }

              <div className="form__row__col">
                <div className="form__row__col__label">Payment Method</div>
                <div className="form__row__col__input">
                  <select defaultValue={""} name="" id="" onChange={(e) => setData({ ...data, payment_method: e.target.value })}>
                    <option value="">Select payment method</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit">Credit</option>
                    <option value="Cheque">Cheque</option>

                  </select>
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">
                  Select Billing Price Method{' '}
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
              <div className="form__row__col">
                <div className="form__row__col__label">Select Dealer</div>
                <div className="form__row__col__input">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                  >
                    <input
                      className={selectDealer ? 'err' : ''}
                      type="text"
                      placeholder="Search..."
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
                  {selectDealer ? (
                    <div className="form__row__col__error">
                      <p>Please select the dealer</p>
                    </div>
                  ) : (
                    ''
                  )}
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
                      placeholder="Search..."
                      value={value2}
                      onChange={(e) => filterProducts(e)}
                    />
                    {searchLoadingProducts ? (
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
                      !showProducts ? { display: 'none' } : { display: 'grid' }
                    }
                  >
                    {' '}
                    <div className="searchContent__row">
                      <div className="searchContent__row__details">
                        <p>Item Code</p>
                        <p>Qty</p>
                        <p>Foc</p>
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
                            <p>{item.foc}</p>
                            <p>{item.whole_sale_price}</p>
                            <p>{item.retail_price}</p>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                {addedsameItem ? (
                  <div className="form__row__col__error">
                    <p>You Already Added This Item</p>
                  </div>
                ) : (
                  ''
                )}
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
                    <p>Inventory Has Not Engough Quanty</p>
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
                    onChange={handleFoc}
                  />
                </div>
              </div>
            </div>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Sub Total</div>
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
                    paddingLeft: 15,
                    paddingRight: 15,

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
                        {/* <th>Whole sale</th>
                        <th>Price</th> */}
                        <th>FOC</th>
                        <th>Qty</th>
                        {/* <th>Total Qty</th> */}
                        <th>Sub total</th>
                        <th>Discount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => (
                        <tr className="datarow" key={i}>
                          <td>{item.item_code}</td>
                          {/* <td>{item.whole_sale_price}</td>
                          <td>{item.price}</td> */}
                          <td>{item.foc}</td>
                          <td>{item.qty}</td>
                          {/* <td>{item.qty + item.foc}</td> */}

                          <td>{item.extended_price}</td>
                          <td>{item.discount}</td>

                          <td className="action">
                            <div
                            // className="btnDelete"
                            >
                              <DeleteOutline
                                className="btnDelete hand"
                                onClick={(e) => handleRemove(e, i)}
                              />
                            </div>
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
