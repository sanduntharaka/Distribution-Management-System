import React from 'react'
import { IoClose } from "react-icons/io5";
import { formatNumberPrice } from '../../var/NumberFormats';
const EditBillItem = ({ item, items, bill, close }) => {
    const [editItem, setEditItem] = React.useState(item)
    const addEditedItem = () => {

        const index = items.findIndex((i) => i.item_code === item.item_code)
        items[index] = editItem
        close()
    }
    return (
        <div className='billEdit' >
            <section>
                <div style={{ display: 'flex', justifyContent: "flex-end" }}> <IoClose className='billEdit__close' onClick={() => close()} /></div>
                <h4 className='billEdit__title'>Edit Item</h4>
                <div className="billEdit__edit_bill_form" >
                    <form action="">
                        <div className="billEdit__edit_bill_form__row">
                            <div className="billEdit__edit_bill_form__row__label">Item</div>
                            <p>{item.item_code}-{item.description}</p>
                        </div>
                        <div className="billEdit__edit_bill_form__row">
                            <div className="billEdit__edit_bill_form__row__label">Qty</div>
                            <input
                                type="number"
                                className="billEdit__edit_bill_form__row__input"
                                value={editItem.qty}
                                onChange={(e) =>
                                    setEditItem((prevItem) => ({
                                        ...prevItem,
                                        qty: parseInt(e.target.value),
                                        extended_price: parseFloat(
                                            bill.billing_price_method === "2"
                                                ? e.target.value * prevItem.price
                                                : e.target.value * prevItem.whole_sale_price),
                                    }))
                                }
                            />
                        </div>
                        <div className="billEdit__edit_bill_form__row">
                            <div className="billEdit__edit_bill_form__row__label">Foc</div>
                            <input
                                type="number"
                                className="billEdit__edit_bill_form__row__input"
                                value={editItem.foc}
                                onChange={(e) =>
                                    setEditItem((prevItem) => ({
                                        ...prevItem,
                                        foc: parseInt(e.target.value),
                                    }))
                                }
                            />
                        </div>
                        <div className="billEdit__edit_bill_form__row">
                            <div className="billEdit__edit_bill_form__row__label">Discount</div>
                            <input
                                type="number"
                                className="billEdit__edit_bill_form__row__input"
                                value={editItem.discount}
                                onChange={(e) =>
                                    setEditItem((prevItem) => ({
                                        ...prevItem,
                                        discount: parseFloat(e.target.value),
                                    }))
                                }
                            />
                        </div>
                        <div className="billEdit__edit_bill_form__row">
                            <div className="billEdit__edit_bill_form__row__label">Sub total</div>
                            <p>Rs {formatNumberPrice((bill.billing_price_method === "2" ? editItem.qty * editItem.price : editItem.qty * editItem.whole_sale_price) - editItem.discount)}/-</p>
                        </div>
                    </form>
                </div>
                <div className='billEdit__buttons'>
                    <button className='btnEdit' onClick={() => addEditedItem()}>Add</button>
                    <button className='btnDelete' onClick={() => close()}>Close</button>
                </div>
            </section>
        </div>
    )
}

export default EditBillItem