import React from 'react';

const UserDetails = (props) => {
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
          <h4>Employee Details</h4>
        </dib>
        <div className="details__content__body">
          <div className="details__content__row">
            <div className="details__content__row__col .title">By</div>
            <div className="details__content__row__col .detail">
              {data.added}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Id</div>
            <div className="details__content__row__col .detail">{data.id}</div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Name</div>
            <div className="details__content__row__col .detail">
              {data.full_name}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Designation</div>
            <div className="details__content__row__col .detail">
              {data.designation}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Terriotory</div>
            <div className="details__content__row__col .detail">
              {data.terriotory}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Date of birth
            </div>
            <div className="details__content__row__col .detail">{data.dob}</div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Personal number
            </div>
            <div className="details__content__row__col .detail">
              {data.personal_number}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Company number
            </div>
            <div className="details__content__row__col .detail">
              {data.company_number}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Home number</div>
            <div className="details__content__row__col .detail">
              {data.home_number}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Address</div>
            <div className="details__content__row__col .detail">
              {data.address}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Immediate contact person
            </div>
            <div className="details__content__row__col .detail">
              {data.immediate_contact_person_name}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Immediate contact person number
            </div>
            <div className="details__content__row__col .detail">
              {data.immediate_contact_person_number}
            </div>
          </div>
        </div>
        <div className="details__content__row buttons">
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

export default UserDetails;
