import React from 'react';

const EditComponent = () => {
  return (
    <div className="edit">
      <div className="edit__content">
        <dib className="edit__content__title">
          <h4>Edit</h4>
        </dib>
        <div className="edit__content__table">
          <div className="form">
            <table>
              <tr>
                <td>id</td>
                <td>
                  <input type="text" value={'001'} />
                </td>
              </tr>
              <tr>
                <td>Item code</td>
                <td>
                  {' '}
                  <input type="text" value={'BXID125'} />
                </td>
              </tr>
              <tr>
                <td>Wholesale price</td>
                <td>
                  {' '}
                  <input type="text" value={'250'} />
                </td>
              </tr>
              <tr>
                <td>Retail Price</td>
                <td>
                  {' '}
                  <input type="text" value={'450'} />
                </td>
              </tr>
              <tr>
                <td>Base</td>
                <td>
                  {' '}
                  <input type="text" value={'sadf asdfas'} />
                </td>
              </tr>
              <tr>
                <td>Pack size</td>
                <td>
                  {' '}
                  <input type="text" value={'50'} />
                </td>
              </tr>
              <tr>
                <td>Qty</td>
                <td>
                  {' '}
                  <input type="text" value={'500'} />
                </td>
              </tr>
              <tr>
                <td>Free of charge</td>
                <td>
                  {' '}
                  <input type="text" value={'12'} />
                </td>
              </tr>
              <tr>
                <td>description</td>
                <td>
                  <textarea name="" id="" cols="20" rows="3"></textarea>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="edit__content__buttons">
          <button className="remBtn">
            <p>Save</p>
          </button>
          <button className="addBtn">
            <p>Cancel</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditComponent;
