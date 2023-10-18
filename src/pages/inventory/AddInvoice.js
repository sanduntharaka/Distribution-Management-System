import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { axiosInstance } from '../../axiosInstance';
import { DateTime } from 'luxon';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import Spinner from '../../components/loadingSpinner/Spinner';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import WebSocketInstance from '../../WebSocket';
import SearchSpinner from '../../components/loadingSpinner/SearchSpinner';

const AddInvoice = ({ inventory }) => {
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

    //message modal
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState('');
    const [title, setTitle] = useState('');
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


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

    const [isLoading, setIsLoading] = useState(false)
    const [value2, setValue2] = useState('');
    const [products, setProducts] = useState([]);
    const [showProducts, setShowProducts] = useState(false);
    const [product, setProduct] = useState();
    const [addedsameItem, setAddedsameItem] = useState(false);
    const [searchLoadingProducts, setSearchLoadingProducts] = useState(false);
    const [items, setItems] = useState([]);
    const [qty, setQty] = useState(0);
    const [foc, setFoc] = useState(0);

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

    const handleQty = (e) => {

        setQty(e.target.value);

    };

    const handleFoc = (e) => {

        setFoc(e.target.value)

    };

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
                                    <input type="text" />
                                </div>
                            </div>
                            <div className="form__row__col dontdisp">

                            </div>
                        </div>

                        <div className="form__row">
                            <div className="form__row__col">
                                <div className="form__row__col__label">Date</div>
                                <div className="form__row__col__input">
                                    <input

                                        type="date"
                                        value={''}
                                        onChange={''}
                                    />
                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">Total</div>
                                <div className="form__row__col__input">
                                    <input
                                        type="number"
                                        value={''}
                                        onChange={''}
                                    />
                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">Discount</div>
                                <div className="form__row__col__input">
                                    <input
                                        type="number"
                                        value={''}
                                        onChange={''}
                                    />
                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">Due date</div>
                                <div className="form__row__col__input">
                                    <input
                                        type="date"
                                        value={''}
                                        onChange={''}
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

                                        type="number"
                                        value={qty}
                                        onChange={(e) => handleQty(e)}
                                    />
                                </div>

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
                            <div className="form__row__col">
                                <div className="form__row__col__label">Wholesale Price</div>
                                <div className="form__row__col__input">
                                    <input
                                        type="number"
                                        value={''}
                                        onChange={''}
                                    />
                                </div>
                            </div>
                            <div className="form__row__col">
                                <div className="form__row__col__label">Retail Price</div>
                                <div className="form__row__col__input">
                                    <input
                                        type="number"
                                        value={''}
                                        onChange={''}
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
                                    onClick={''}
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

                                                <th>FOC</th>
                                                <th>Qty</th>

                                                <th>Sub total</th>
                                                <th>Discount</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>

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

                                <p>Rs /-</p>
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
                                <p>Rs /-</p>
                            </div>
                        </div>





                        <div className="form__btn">
                            <div className="form__btn__container">
                                <button className="btnEdit " onClick={''}>
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
