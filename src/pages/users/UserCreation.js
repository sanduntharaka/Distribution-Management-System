import React from "react";

const UserCreation = () => {
  return (
    <div className="page">
      <div className="page__title">
        <p>User Creation</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="">
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">user name</div>
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
                <div className="form__row__col__label">User type</div>
                <div className="specialColumn" style={{ display: "grid" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "5px",
                    }}
                  >
                    <input type="checkbox" />
                    <label htmlFor="">Superuser</label>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "5px",
                    }}
                  >
                    <input type="checkbox" />
                    <label htmlFor="">Manager</label>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "5px",
                    }}
                  >
                    <input type="checkbox" />
                    <label htmlFor="">Distributor</label>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "5px",
                    }}
                  >
                    <input type="checkbox" />
                    <label htmlFor="">Sales ref</label>
                  </div>
                </div>
              </div>
              <div className="form__row__col dontdisp"></div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">password</div>
                <div className="form__row__col__input">
                  <input type="date" placeholder="type here" />
                </div>
              </div>
              <div className="form__row__col dontdisp"></div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">confirm password</div>
                <div className="form__row__col__input">
                  <input type="date" placeholder="type here" />
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

export default UserCreation;
