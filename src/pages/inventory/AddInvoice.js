import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import Spinner from '../../components/loadingSpinner/Spinner';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import SearchSpinner from '../../components/loadingSpinner/SearchSpinner';
import ConfimBill from './confim_bill/ConfimBill';
import { formatNumberPrice, formatNumberValue } from '../../var/NumberFormats';


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
            items={props.items}
            data={props.data}
            set_data={props.setData}
            close={() => props.handleClose()}
            clear={() => props.clear()}
        />
    );
});


const AddInvoice = ({ inventory }) => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    //message modal
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState('');
    const [title, setTitle] = useState('');
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [showinv, setShowInv] = useState(false);
    const [invoice, setInvoice] = useState();
    const handleCloseInv = () => {
        setShowInv(false);
    };
    const showInvoice = () => {
        setShowInv(true);
    };
    const [isLoading, setIsLoading] = useState(false)
    const [value2, setValue2] = useState('');
    const [products, setProducts] = useState([]);
    const [showProducts, setShowProducts] = useState(false);
    const [product, setProduct] = useState();
    const [addedsameItem, setAddedsameItem] = useState(false);
    const [searchLoadingProducts, setSearchLoadingProducts] = useState(false);
    const [items, setItems] = useState([]);
    const [data, setData] = useState({
        added_by: JSON.parse(sessionStorage.getItem('user')).id,
        invoice_number: '',
        date: '',
        discount: 0,
        pay_total: 0,
        due_date: '',
        from_sales_return: false,
        from_market_return: false,
        inventory: inventory.id,
        page_number: ''


    });

    const [currentItem, setCurrentItem] = useState({
        item: '',
        item_code: '',
        description: '',
        qty: 0,
        pack_size: '',
        foc: 0,
        whole_sale_price: '',
        retail_price: '',
        item_code: '',
        id: '',
    });


    useEffect(() => {
        if (value2 !== '') {
            axiosInstance
                .get(
                    `/distributor/details/${value2}`,
                    {
                        headers: {
                            Authorization:
                                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                        },
                    }
                )
                .then((res) => {
                    console.log(res.data)
                    setCurrentItem((prevItems) => ({
                        ...prevItems,

                        whole_sale_price: res.data.whole_sale_price,
                        retail_price: res.data.retail_price,
                        pack_size: res.data.pack_size,
                        description: res.data.description,
                    }))
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [setValue2, value2])

    const [pages, setPages] = useState([])
    const handleInvoiceNumber = (e) => {
        setData({ ...data, invoice_number: e.target.value })
        axiosInstance
            .get(
                `/distributor/invoice/check/${e.target.value}`,
                {
                    headers: {
                        Authorization:
                            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                    },
                }
            )
            .then((res) => {
                console.log(res.data)
                setPages(res.data.pages)
            })
            .catch((err) => {
                console.log(err);
            });
    }


    const filterProducts = (e) => {
        setShowProducts(true);
        setAddedsameItem(false);
        setSearchLoadingProducts(true);
        axiosInstance
            .get(
                `/distributor/salesref/inventory/items-invoice/${inventory.id}/search?search=${e.target.value}`,
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
    const hanldeProductFilter = (e, item) => {
        setValue2(item.item_code);
        console.log('iii:', item)
        setCurrentItem((prevItems) => ({
            ...prevItems,
            item_code: item.item_code,
            id: item.id,
            description: item.description,
        }))
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

    const handleQty = (e) => {

        setCurrentItem((prevItems) => ({
            ...prevItems, qty: e.target.value
        }))

    };

    const handleFoc = (e) => {
        setCurrentItem((prevItems) => ({
            ...prevItems, foc: e.target.value
        }))


    };
    const handleAdd = (e) => {
        console.log(currentItem)
        e.preventDefault();
        if (addedsameItem === false) {

            setItems([
                ...items,
                currentItem
            ]);

            setCurrentItem((prevItems) => ({
                ...prevItems,
                qty: 0,
                foc: 0,
            }))
            setValue2('');
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
            sub_total: data.sub_total - (item.whole_sale_price),
        });
    };
    const finalTotal = items.reduce((total, item) => {
        const qty = parseInt(item.qty, 10); // Convert qty to an integer
        const wholeSalePrice = parseFloat(item.whole_sale_price); // Convert whole_sale_price to a float

        if (!isNaN(qty) && !isNaN(wholeSalePrice)) {
            return total + qty * wholeSalePrice;
        }

        return total;
    }, 0);

    const hadleCreate = (e) => {
        e.preventDefault();
        setData({ ...data, pay_total: finalTotal - data.discount })

        setIsLoading(false);
        showInvoice();
    };

    const handleClearAll = () => {

    }

    const handleMret = (e) => {
        console.log('mret')
        if (e.target.checked) {
            setData({ ...data, from_sales_return: false, from_market_return: true })
        }
    }
    const handleSret = (e) => {
        console.log('sret')

        if (e.target.checked) {
            setData({ ...data, from_market_return: false, from_sales_return: true })
        }
    }



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
                    data={data}
                    handleClose={handleCloseInv}
                    clear={handleClearAll}
                />
            </Modal>

            <div className="page__title">
                <p>Add Company invoice </p>
            </div>
            <div className="page__pcont">
                <div className="form">
                    <form action="">
                        <div className="form__row">

                            <div className="form__row__col">
                                <div className="form__row__col__label">Invoie Number</div>
                                <div className="form__row__col__input">
                                    <input type="text" value={data.invoice_number}
                                        onChange={(e) => handleInvoiceNumber(e)} placeholder='Type Invoice Number Here' />
                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">Page Number</div>
                                <div className="form__row__col__input">
                                    <input type="text" value={data.page_number}
                                        onChange={(e) => setData({ ...data, page_number: e.target.value })} placeholder='Type Invoice Page Number Here' />
                                </div>
                            </div>
                            {
                                pages.length > 0 ? (<div className="form__row__col ">
                                    <p>You have previously saved page count.</p>
                                    {
                                        pages.map((item, i) => (
                                            <p>{1}</p>
                                        ))
                                    }
                                </div>) : <div className="form__row__col dontdisp">

                                </div>
                            }

                        </div>

                        <div className="form__row">
                            <div className="form__row__col">
                                <div className="form__row__col__label">Date</div>
                                <div className="form__row__col__input">
                                    <input

                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData({ ...data, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form__row__col">
                                <div className="form__row__col__label">Discount</div>
                                <div className="form__row__col__input">
                                    <input
                                        type="number"
                                        value={data.discount}
                                        onChange={(e) => setData({ ...data, discount: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">Due date</div>
                                <div className="form__row__col__input">
                                    <input
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData({ ...data, due_date: e.target.value })}
                                    />
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
                                                        <p>{formatNumberValue(item.qty)}</p>
                                                        <p>{formatNumberValue(item.foc)}</p>
                                                        <p>{formatNumberPrice(item.whole_sale_price)}</p>
                                                        <p>{formatNumberPrice(item.retail_price)}</p>
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
                                <div className="form__row__col__label">Wholesale Price</div>
                                <div className="form__row__col__input">
                                    <input
                                        type="number"
                                        value={currentItem.whole_sale_price}
                                        onChange={(e) => setCurrentItem({ ...currentItem, whole_sale_price: e.target.value })}
                                        placeholder='0'
                                    />
                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">Retail Price</div>
                                <div className="form__row__col__input">
                                    <input
                                        type="number"
                                        value={currentItem.retail_price}
                                        onChange={(e) => setCurrentItem({ ...currentItem, retail_price: e.target.value })}
                                        placeholder='0'
                                    />
                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">Pack Size</div>
                                <div className="form__row__col__input">
                                    <input
                                        type="number"
                                        value={currentItem.pack_size}
                                        onChange={(e) => setCurrentItem({ ...currentItem, pack_size: e.target.value })}
                                        placeholder='0'
                                    />
                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">QTY</div>
                                <div className="form__row__col__input">
                                    <input

                                        type="number"
                                        value={currentItem.qty}
                                        onChange={(e) => handleQty(e)}
                                    />
                                </div>

                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">FOC</div>
                                <div className="form__row__col__input">
                                    <input
                                        type="number"
                                        value={currentItem.foc}
                                        onChange={handleFoc}
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
                                                <th>Item Code</th>
                                                <th>Qty</th>
                                                <th>FOC</th>
                                                <th>Unit Price</th>
                                                <th>Extended Price</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {items.map((item, i) => (
                                                <tr className="datarow" key={i}>
                                                    <td>{item.item_code}-{item.description}</td>
                                                    <td>{formatNumberValue(item.qty)}</td>
                                                    <td>{formatNumberValue(item.foc)}</td>
                                                    <td>{formatNumberPrice(item.whole_sale_price)}</td>
                                                    <td>{formatNumberPrice(item.whole_sale_price * item.qty)}</td>

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

                                <p>Rs {formatNumberPrice(finalTotal)}/-</p>
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
                                <p>Final Total:</p>
                                <p>Rs {formatNumberPrice(finalTotal - data.discount)}/-</p>
                            </div>
                        </div>

                        <div className="form__row">

                            <div className="form__row__col__input aligned">
                                <div className="form__row__col__label" style={{ width: 150 }}>From Market Return</div>
                                <div className="form__row__col__input">
                                    <input type="radio" checked={data.from_market_return ? true : false} onChange={(e) => handleMret(e)} />
                                </div>
                            </div>
                            <div className="form__row__col dontdisp">

                            </div>

                        </div>
                        <div className="form__row">

                            <div className="form__row__col__input aligned">
                                <div className="form__row__col__label" style={{ width: 150 }}>From Sales Return</div>
                                <div className="form__row__col__input">
                                    <input type="radio" checked={data.from_sales_return ? true : false} onChange={(e) => handleSret(e)} />
                                </div>
                            </div>
                            <div className="form__row__col dontdisp">

                            </div>

                        </div>



                        <div className="form__btn">
                            <div className="form__btn__container">
                                <button className="btnEdit " onClick={(e) => hadleCreate(e)}>
                                    save
                                </button>
                                <button className="btnSave" onClick={''}>
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

export default AddInvoice;