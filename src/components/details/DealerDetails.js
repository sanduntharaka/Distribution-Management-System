import React from 'react';

const DealerDetails = (props) => {
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
          <h4>Dealer Details</h4>
        </dib>
        <div className="details__content__body">
          <div className="details__content__row">
            <div className="details__content__row__col .title">By:</div>
            <div className="details__content__row__col .detail">
              {data.added}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Id:</div>
            <div className="details__content__row__col .detail">{data.id}</div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Name:</div>
            <div className="details__content__row__col .detail">
              {data.name}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Contact Number:
            </div>
            <div className="details__content__row__col .detail">
              {data.contact_number}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Address:</div>
            <div className="details__content__row__col .detail">
              {data.address}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Owner Name:</div>
            <div className="details__content__row__col .detail">
              {data.owner_name}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Company Number:
            </div>
            <div className="details__content__row__col .detail">
              {data.company_number}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Personal Number:
            </div>
            <div className="details__content__row__col .detail">
              {data.owner_personal_number}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Home Number:
            </div>
            <div className="details__content__row__col .detail">
              {data.owner_home_number}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Assistant Name:
            </div>
            <div className="details__content__row__col .detail">
              {data.assistant_name}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Assistant Number:
            </div>
            <div className="details__content__row__col .detail">
              {data.assistant_contact_number}
            </div>
          </div>
        </div>
        <div className="details__content__row buttons">
          {props.user.is_distributor ||
          props.user.is_manager ||
          props.user.is_excecutive ? (
            <div className="details__content__row__col">
              <button className="btnEdit" onClick={handleEdit}>
                Edit
              </button>
            </div>
          ) : (
            ''
          )}
          {props.user.is_manager || props.user.is_excecutive ? (
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

export default DealerDetails;