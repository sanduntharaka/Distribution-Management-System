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
        <div className="details__content__table">
          <table>
            <tr>
              <td>By</td>
              <td>{data.employee}</td>
            </tr>
            <tr>
              <td>Id</td>
              <td>{data.id}</td>
            </tr>
            <tr>
              <td>Item code</td>
              <td>{data.item_code}</td>
            </tr>
            <tr>
              <td>Wholesale price</td>
              <td> Rs {data.whole_sale_price} /-</td>
            </tr>
            <tr>
              <td>Retail Price</td>
              <td> Rs {data.retail_price}/-</td>
            </tr>
            <tr>
              <td>Base</td>
              <td>{data.base}</td>
            </tr>
            <tr>
              <td>Pack size</td>
              <td>{data.pack_size}</td>
            </tr>
            <tr>
              <td>Qty</td>
              <td>{data.qty}</td>
            </tr>
            <tr>
              <td>Free of charge</td>
              <td>{data.free_of_charge}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>{data.description}</td>
            </tr>
          </table>
        </div>
        <div className="details__content__buttons">
          <button className="btnEdit" onClick={handleEdit}>
            Edit
          </button>
          <button className="btnDelete" onClick={handleDelete}>
            Delete
          </button>
          <button className="addBtn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
