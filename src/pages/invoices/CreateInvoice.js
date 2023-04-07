import React from "react";
const styles = {
  input1: {
    appearance: "none",
    "-webkit-appearance": "none",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    outline: "none",
    border: "2px solid #BFD1E5",
  },
  checked1: {
    backgroundColor: "#BFD1E5",
  },
  input2: {
    appearance: "none",
    "-webkit-appearance": "none",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    outline: "none",
    border: "2px solid #FDF5E6",
  },
  checked2: {
    backgroundColor: "#FDF5E6",
  },
  input3: {
    appearance: "none",
    "-webkit-appearance": "none",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    outline: "none",
    border: "2px solid #D3D3D3",
  },
  checked3: {
    backgroundColor: "#D3D3D3",
  },
};
const CreateInvoice = () => {
  return (
    <div className="page">
      <div className="page__title">
        <p>Create invoice</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="">
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">invoice number</div>
                <div className="form__row__col__input">
                  <input type="text" placeholder="type invoice number here" />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Item code</div>
                <div className="form__row__col__input">
                  <input type="number" placeholder="type item code here" />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Invoice Date</div>
                <div className="form__row__col__input">
                  <input type="date" placeholder="type date here" />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Received Date</div>
                <div className="form__row__col__input">
                  <input type="date" placeholder="type date here" />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Due Date</div>
                <div className="form__row__col__input">
                  <input type="date" placeholder="type date here" />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Base</div>
                <div className="form__row__col__input">
                  <input type="text" placeholder="type  here" />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Description</div>
                <div className="form__row__col__input">
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    cols="30"
                    placeholder="type here..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Whole sale price</div>
                <div className="form__row__col__input">
                  <input type="number" placeholder="type here" />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Retail price</div>
                <div className="form__row__col__input">
                  <input type="number" placeholder="type here" />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Free of charge</div>
                <div className="form__row__col__input">
                  <input type="number" placeholder="type  here" />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">pack size</div>
                <div className="form__row__col__input">
                  <input type="number" placeholder="type  here" />
                </div>
              </div>
            </div>

            <div className="form__btn">
              <div className="form__btn__container">
                <button className="btnEdit">save</button>
                <button className="btnSave">edit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
