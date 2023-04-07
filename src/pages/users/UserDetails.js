import React from "react";

const UserDetails = () => {
  return (
    <div className="page">
      <div className="page__title">
        <p>User Details</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="">
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Full Name</div>
                <div className="form__row__col__input">
                  <input type="text" placeholder="type name here" />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Email</div>
                <div className="form__row__col__input">
                  <input type="text" placeholder="type email here" />
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
              <div className="form__row__col">
                <div className="form__row__col__label">Designation</div>
                <div className="form__row__col__input">
                  <input type="text" placeholder="type designation here" />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Date of Birth</div>
                <div className="form__row__col__input">
                  <input type="date" placeholder="type name here" />
                </div>
              </div>
              <div className="form__row__col dontdisp"></div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Contacts</div>

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
                <div className="form__row__col__label">
                  Immediate Contact Person Name
                </div>
                <div className="form__row__col__input">
                  <input type="text" placeholder="type here" />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">
                  Immediate contact Person number
                </div>
                <div className="form__row__col__input">
                  <input type="tel" placeholder="type here" />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Terriotory</div>
                <div className="form__row__col__input">
                  <input type="text" placeholder="type address here" />
                </div>
              </div>
              <div className="form__row__col dontdisp"></div>
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

export default UserDetails;
