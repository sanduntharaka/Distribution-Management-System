import React, { useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { formatNumberPrice } from '../../var/NumberFormats';
import { axiosInstance } from '../../axiosInstance';
import SearchSpinner from '../loadingSpinner/SearchSpinner';
const ShowCreditDetails = ({ bill, close }) => {
    const [loading, setLoading] = useState(true)
    const [invoices, setInvoices] = useState([])
    useEffect(() => {
        setLoading(true)
        axiosInstance
            .get(
                `/dealer/credit/${bill.dealer}`,
                {
                    headers: {
                        Authorization:
                            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                    },
                }
            )
            .then((res) => {
                setLoading(false);
                setInvoices(res.data)
                console.log('dea:', res.data)

            })
            .catch((err) => {
                console.log(err);
                setLoading(false);

            });
    }, [''])
    return (
        <div className='credit_details' >
            <section>
                <div style={{ display: 'flex', justifyContent: "flex-end" }}> <IoClose className='credit_details__close' onClick={() => close()} /></div>
                <h4 className='credit_details__title'>Credit Details

                </h4>
                <div className="credit_details__content" >

                    <div className="credit_details__content__head">
                        <div>Invoice Number</div>
                        <div>Date</div>
                        <div>Total</div>
                        <div>Credit</div>
                    </div>
                    <div className="credit_details__content__body">

                        {loading ? (
                            <div style={{ height: "150px", display: "flex", justifyContent: "center", alignItems: 'center' }}>
                                <SearchSpinner search={true} />
                            </div>
                        ) : (

                            invoices.map((invoice, index) => (
                                <div className="credit_details__content__body__row">
                                    <div className="credit_details__content__body__row__col">{invoice.inv_no}</div>
                                    <div className="credit_details__content__body__row__col">{invoice.date}</div>
                                    <div className="credit_details__content__body__row__col">{formatNumberPrice(invoice.total)}</div>
                                    <div className="credit_details__content__body__row__col">{formatNumberPrice(invoice.credit_amount)}</div>


                                </div>
                            ))


                        )}




                    </div>


                </div>
                <div className='billEdit__buttons'>
                    <button className='btnDelete' onClick={() => close()}>Close</button>
                </div>
            </section>
        </div>
    )
}

export default ShowCreditDetails