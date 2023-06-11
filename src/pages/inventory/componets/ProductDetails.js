import React from 'react';

const ProductDetails = (props) => {
  console.log(props);
  const data = props.data;

  const handleEdit = () => {
    props.showDetails(false);
    props.showEdit(true);
  };

  const handleDelete = () => {
    props.showDetails(false);
    props.showConfirm(true);
  };

  const handleCancel = () => {
    props.closeModal();
  };
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
              {data.employee}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Id</div>
            <div className="details__content__row__col .detail">{data.id}</div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Item code</div>
            <div className="details__content__row__col .detail">
              {data.item_code}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Wholesale price
            </div>
            <div className="details__content__row__col .detail">
              Rs {data.whole_sale_price} /-
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Retail Price
            </div>
            <div className="details__content__row__col .detail">
              Rs {data.retail_price}/-
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Base</div>
            <div className="details__content__row__col .detail">
              {data.base}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Pack size</div>
            <div className="details__content__row__col .detail">
              {data.pack_size}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Free of charge
            </div>
            <div className="details__content__row__col .detail">
              {data.free_of_charge}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Description</div>
            <div className="details__content__row__col .detail">
              {data.description}
            </div>
          </div>
        </div>

        <div className="details__content__row buttons">
          {props.user.is_distributor ? (
            <>
              <div className="details__content__row__col">
                <button className="btnEdit" onClick={handleEdit}>
                  Edit
                </button>
              </div>
              <div className="details__content__row__col">
                <button className="btnDelete" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </>
          ) : (
            ''
          )}

          <div className="details__content__row__col">
            <button className="addBtn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
