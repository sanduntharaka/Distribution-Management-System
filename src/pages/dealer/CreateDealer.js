import React from "react";

const CreateDealer = () => {
  return (
    <div className="page">
      <div className="page__title">
        <p>Dealer Details</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="">
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Name</div>
                <div className="form__row__col__input">
                  <input type="text" placeholder="type name here" />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Contact number</div>
                <div className="form__row__col__input">
                  <input type="tel" placeholder="type contact number here" />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Address</div>
                <div className="form__row__col__input">
                  <input type="text" placeholder="type address here" />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Owner name</div>
                <div className="form__row__col__input">
                  <input type="text" placeholder="type name here" />
                </div>
              </div>
              <div className="form__row__col dontdisp"></div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Owner Contacts</div>

                <div className="specialColumn">
                  <div className="form__row__col__input" style={{ flex: 1 }}>
                    <input type="tel" placeholder="type company number" />
                  </div>

                  <div className="form__row__col__input" style={{ flex: 1 }}>
                    <input type="tel" placeholder="type personal number" />
                  </div>

                  <div className="form__row__col__input" style={{ flex: 1 }}>
                    <input type="tel" placeholder="type home number" />
                  </div>
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Assistant name</div>
                <div className="form__row__col__input">
                  <input type="text" placeholder="type here" />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">
                  Assistant contact number
                </div>
                <div className="form__row__col__input">
                  <input type="tel" placeholder="type here" />
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

export default CreateDealer;
