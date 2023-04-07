import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { AiOutlinePlus } from "react-icons/ai";

const CreateReturn = () => {
  return (
    <div className="page">
      <div className="page__title">
        <p>Create Returns</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="">
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Select pas</div>
                <div className="form__row__col__input">
                  <select name="cars" id="cars">
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                  </select>
                </div>
              </div>
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
                <div className="form__row__col__label">Product</div>
                <div className="form__row__col__input">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <input type="text" placeholder="search..." />
                    <SearchIcon
                      style={{
                        padding: "5px",
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    height: "100px",
                    background: "white",
                    marginTop: "5px",
                  }}
                >
                  <div
                    style={{
                      marginTop: "2px",
                      background: "lightgrey",
                      display: "flex",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <p>Product name 1</p>
                    <p>Qty</p>
                  </div>
                  <div
                    style={{
                      marginTop: "2px",
                      background: "lightgrey",
                      display: "flex",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <p>Product name 2</p>
                    <p>Qty</p>
                  </div>
                  <div
                    style={{
                      marginTop: "2px",
                      background: "lightgrey",
                      display: "flex",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <p>Product name 3</p>
                    <p>Qty</p>
                  </div>
                </div>
                <div style={{ marginTop: "5px" }}>
                  <div className="form__row__col__input">
                    <input type="number" placeholder="Qty" />
                  </div>
                </div>
              </div>
              <div className="form__row__col dontdisp"></div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Free of charge</div>
                <div className="form__row__col__input">
                  <input type="number" placeholder="type qty here" />
                </div>
              </div>
              <div className="form__row__col dontdisp"></div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Payment Method</div>
                <div className="form__row__col__input">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      gap: "5px",
                    }}
                  >
                    <input type="radio" />
                    <label htmlFor="">Return from goods</label>
                  </div>
                </div>
                <div className="form__row__col__input">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      gap: "5px",
                    }}
                  >
                    <input type="radio" />
                    <label htmlFor="">Deduct from bill</label>
                  </div>
                </div>

                <div className="form__row__col__input"></div>
                <div className="form__row__col__input"></div>
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

export default CreateReturn;
