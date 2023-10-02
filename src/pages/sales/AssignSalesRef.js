import React, { useState, useRef, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Message from '../../components/message/Message';
import Invoice from '../../components/invoice/Invoice';
import SearchIcon from '@mui/icons-material/Search';
import { axiosInstance } from '../../axiosInstance';
const AssignSalesRef = () => {
  const catMenu = useRef();

  //message modal
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //invoice show
  const [showinv, setShowInv] = useState(false);
  const handleCloseInv = () => {
    setShowInv(false);
  };
  const showInvoice = () => {
    setShowInv(true);
  };

  //distributor inventory
  const [distributorInven, setDistributorInven] = useState('');
  //distributor filter
  const [salesRefs, setSalesRefs] = useState([]); //res.data
  const [showSalesRefs, setShowSalesRefs] = useState(false);
  const [salesRef, setSalesRef] = useState();
  const [value, setValue] = useState('');

  //products filter
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [product, setProduct] = useState();
  const [value2, setValue2] = useState('');
  const [items, setItems] = useState([]);

  // qty

  const [qty, setQty] = useState(0);
  const [foc, setFoc] = useState(0);

  useEffect(() => {
    axiosInstance
      .get('/salesref/all/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setSalesRefs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axiosInstance
      .get(
        `/distributor/get/${JSON.parse(sessionStorage.getItem('user_details')).id
        }`,
        {
          headers: {
            Authorization:
              'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        axiosInstance
          .get(`/distributor/items/all/${res.data.id}`, {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          })
          .then((res) => {
            console.log(res.data);
            setProducts(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //show salesref drop down
  const filterSalesRefs = (e) => {
    setShowSalesRefs(true);
    setValue(e.target.value);
  };
  //set choosed salesref
  const hanldeCatchFilter = (e, item) => {
    console.log('ref', item);
    setValue(item.name);
    setSalesRef({
      user: item.sales_ref,
      name: item.name,
    });
    setShowSalesRefs(false);
  };

  //show products drop down
  const filterProducts = (e) => {
    setShowProducts(true);
    setValue2(e.target.value);
  };
  //select product
  const hanldeProductFilter = (e, item) => {
    setValue2(item.item_code);
    setProduct(item);
    setShowProducts(false);
  };

  //add selected prodcut and qty into items list
  const handleAdd = (e) => {
    e.preventDefault();

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
  };
  //remove selected items
  const handleRemove = (e, id) => {
    e.preventDefault();
    const newItems = [...items];
    const index = newItems.findIndex((item) => item.id === id);
    newItems.splice(index, 1);
    setItems(newItems);
  };
  //submit all selected items to database
  const handleSave = (e) => {
    e.preventDefault();
    if (items.length > 0) {
      console.log('choosed', items);
      axiosInstance
        .post(
          '/salesref/items/add/',
          {
            sales_ref: salesRef.user,
            items: items,
            added_by: JSON.parse(sessionStorage.getItem('user')).email,
          },
          {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          }
        )
        .then((res) => {
          console.log(res);
          showInvoice();
          setSuccess(true);
          setError(false);
        })
        .catch((err) => {
          console.log(err);
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
    return <Invoice distributor={props.distributor} items={props.items} />;
  });
  return (
    <div className="page">
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
        <p>Assign Products</p>
      </div>

      <div className="page__pcont">
        <div className="form">
          <form action="">
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Sales Rep</div>

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
                      value={value}
                      onChange={(e) => filterSalesRefs(e)}
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
                      !showSalesRefs ? { display: 'none' } : { display: 'grid' }
                    }
                  >
                    {salesRefs

                      .filter((item) => {
                        console.log(item);
                        const searchTerm = value.toLowerCase();
                        const fullName = item.name.toLowerCase();

                        return (
                          fullName.includes(searchTerm) &&
                          fullName !== searchTerm
                        );
                      })
                      .map((item, i) => (
                        <ul
                          className="searchContent__row"
                          onClick={(e) => hanldeCatchFilter(e, item)}
                          key={i}
                        >
                          <li
                            style={{ cursor: 'pointer' }}
                            className="searchContent__row__details"
                          >
                            {item.name}
                          </li>
                        </ul>
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
                      .map((item, i) => (
                        <div
                          className="searchContent__row"
                          onClick={(e) => hanldeProductFilter(e, item)}
                          key={i}
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
                <div className="form__row__col__label">QTY</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">FOC</div>
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
                    <thead className="tableHead">
                      <tr>
                        <th> Item Code</th>
                        <th>Whole sale</th>
                        <th>Retail</th>
                        <th>FOC</th>
                        <th>Qty</th>

                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => (
                        <tr className="datarow" key={i}>
                          <td>{item.item_code}</td>
                          <td>{item.whole_sale_price}</td>
                          <td>{item.retail_price}</td>
                          <td>{item.free_of_charge}</td>

                          <td>{item.qty}</td>

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
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="form__btn">
              <div className="form__btn__container">
                <button className="btnEdit" onClick={(e) => handleSave(e)}>
                  complete
                </button>
                <button className="btnDelete">clear</button>
              </div>
            </div>
          </form>
        </div>
        <Modal open={showinv} onClose={() => handleCloseInv()}>
          <MyInvoice distributor={salesRef} items={items} oldinv={false} />
        </Modal>
      </div>
    </div>
  );
};

export default AssignSalesRef;
