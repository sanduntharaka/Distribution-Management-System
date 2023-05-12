import React from 'react';

const LeaveDetails = (props) => {
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
          <h4>Leave Details</h4>
        </dib>
        <div className="details__content__body">
          <div className="details__content__row">
            <div className="details__content__row__col .title">By</div>
            <div className="details__content__row__col .detail">
              {data.created_by}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Id</div>
            <div className="details__content__row__col .detail">{data.id}</div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Leave Apply Date
            </div>
            <div className="details__content__row__col .detail">
              {data.leave_apply_date}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Leave End Date
            </div>
            <div className="details__content__row__col .detail">
              {data.leave_end_date}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Leave Type</div>
            <div className="details__content__row__col .detail">
              {data.leave_type}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Return to Work
            </div>
            <div className="details__content__row__col .detail">
              {data.return_to_work}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">
              Number of Dates
            </div>
            <div className="details__content__row__col .detail">
              {data.number_of_dates}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Reason</div>
            <div className="details__content__row__col .detail">
              {data.reason}
            </div>
          </div>
          <div className="details__content__row">
            <div className="details__content__row__col .title">Status</div>
            <div className="details__content__row__col .detail">
              {data.leave_status === 'No' ? 'Not Approved' : 'Approved'}
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

export default LeaveDetails;
