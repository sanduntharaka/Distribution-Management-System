import React from 'react';
import DetailsItems from './DetailsItems';

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
          {/* <div className="details__content__row">
            <div className="details__content__row__col .title">By:</div>
            <div className="details__content__row__col .detail">
              {data.employee}
            </div>
          </div> */}
          <div className="details__content__row">
            <div className="details__content__row__col .title">Id:</div>
            <div className="details__content__row__col .detail">{data.id}</div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Item code:</div>
            <div className="details__content__row__col .detail">
              {data.item_code}
            </div>
          </div>

          <div className="details__content__row">
            <div className="details__content__row__col .title">Base:</div>
            <div className="details__content__row__col .detail">
              {data.base}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Description:
            </div>
            <div className="details__content__row__col .detail">
              {data.description}
            </div>
          </div>
        </div>

        <div className="details__content__row detailtablel">
          <DetailsItems
            invoice={{ id: data.id }}
            success={props.success}
            user={props.user}
          />
        </div>

        <div className="details__content__row buttons">
          {props.user.is_distributor ? (
            <div className="details__content__row__col">
              <button className="btnDelete" onClick={handleDelete}>
                Delete
              </button>
            </div>
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
