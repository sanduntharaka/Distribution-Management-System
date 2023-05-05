import React from 'react';

const DetailsReturn = (props) => {
  const data = props.data;
  const items = props.items;
  return (
    <div className="details">
      <div className="details__content">
        <dib className="details__content__title">
          <h4>Details</h4>
        </dib>
        <div className="details__content__body">
          <div className="details__content__row">
            <div className="details__content__row__col .title">By</div>
            <div className="details__content__row__col .detail">
              {data.added_email}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Id</div>
            <div className="details__content__row__col .detail">{data.id}</div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Date</div>
            <div className="details__content__row__col .detail">
              {data.date}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">PSA</div>
            <div className="details__content__row__col .detail">
              {data.psa_name}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Dealer</div>
            <div className="details__content__row__col .detail">
              {data.dealer_name}
            </div>
          </div>

          {data.is_return_goods ? (
            <div className="details__content__row">
              <div className="details__content__row__col .title">
                Return status
              </div>
              <div className="details__content__row__col .detail">
                Return from goods
              </div>
            </div>
          ) : (
            ''
          )}

          {data.is_deduct_bill ? (
            <>
              <div className="details__content__row">
                <div className="details__content__row__col .title">
                  Return status
                </div>
                <div className="details__content__row__col .detail">
                  Deduct from bill
                </div>
              </div>

              <div className="details__content__row">
                <div className="details__content__row__col .title">
                  Bill Number
                </div>
                <div className="details__content__row__col .detail">
                  {data.bill_code}
                  {data.bill_number}
                </div>
              </div>

              <div className="details__content__row">
                <div className="details__content__row__col .title">Amount</div>
                <div className="details__content__row__col .detail">
                  Rs {data.amount}/-
                </div>
              </div>
            </>
          ) : (
            ''
          )}

          <table>
            <thead>
              <tr>
                <td>Item code</td>
                <td> Qty</td>
                <td> Foc</td>
                <td> Reason</td>
              </tr>
            </thead>
            <tbody>
              {props.items.map((item, i) => (
                <tr key={i} className={`${i % 2 === 0 ? 'odd' : 'even'}`}>
                  <td>{item.item_code}</td>

                  <td>{item.qty}</td>

                  <td>{item.foc}</td>

                  <td>{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="details__content__row buttons">
            <div className="details__content__row__col">
              {' '}
              <button className="btnEdit">Edit</button>
            </div>
            <div className="details__content__row__col">
              {' '}
              <button className="btnDelete">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsReturn;
