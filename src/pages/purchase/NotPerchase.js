import React from "react";

const NotPerchase = () => {
  return (
    <div className="page">
      <div className="page__title">
        <p>None buying details</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="">
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Select dealer</div>
                <div className="form__row__col__input">
                  <select name="cars" id="cars">
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Reason</div>
                <div className="form__row__col__input">
                  <input type="checkbox" />
                  <label htmlFor="">Have only our goods </label>
                </div>
                <div className="form__row__col__input">
                  <input type="checkbox" />
                  <label htmlFor="">Have competitor goods </label>
                </div>
                <div className="form__row__col__input">
                  <input type="checkbox" />
                  <label htmlFor="">payment problem </label>
                </div>
                <div className="form__row__col__input">
                  <input type="checkbox" />
                  <label htmlFor="">Dealer not in </label>
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

export default NotPerchase;
