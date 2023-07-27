import React, { useState, forwardRef, useRef } from 'react';
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import Spinner from '../../components/loadingSpinner/Spinner';
import AllCategories from './AllCategories';
const ShowMessage = forwardRef((props, ref) => {
  return (
    <Message
      hide={props.handleClose}
      success={props.success}
      error={props.error}
      title={props.title}
      msg={props.msg}
      ref={ref}
    />
  );
});

const Category = (props) => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [data, setData] = useState({
    added_by: JSON.parse(sessionStorage.getItem('user')).id,
    category_name: '',
    description: '',
    foc_percentage: 0,
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);
    axiosInstance
      .post('/category/create/', data, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);

        setError(false);
        setSuccess(true);
        setTitle('Success');
        setMsg('Category has been created successfully');
        handleOpen();
      })
      .catch((err) => {
        setLoading(false);

        console.log(err);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg(
          'Category cannot create right now. Please check your data again'
        );
        handleOpen();
      });
  };
  const handleClear = (e) => {
    e.preventDefault();
    setData({
      ...data,
      category_name: '',
      description: '',
      foc_percentage: 0,
    });
  };
  return (
    <div className="page">
      {loading ? (
        <div className="page-spinner">
          <div className="page-spinner__back">
            <Spinner detail={true} />
          </div>
        </div>
      ) : (
        ''
      )}
      <Modal open={open} onClose={handleClose}>
        <ShowMessage
          ref={inputRef}
          handleClose={handleClose}
          success={success}
          error={error}
          title={title}
          msg={msg}
        />
      </Modal>

      {props.user.is_company || props.user.is_manager ? (
        <>
          <div className="page__title">
            <p>Create Category</p>
          </div>
          <div className="page__pcont">
            <div className="form">
              <form action="">
                <div className="form__row">
                  <div className="form__row__col">
                    <div className="form__row__col__label">Category Name</div>
                    <div className="form__row__col__input">
                      <input
                        type="text"
                        placeholder="Type category name"
                        value={data.category_name ? data.category_name : ''}
                        onChange={(e) =>
                          setData({ ...data, category_name: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="form__row__col">
                    <div className="form__row__col__label">More Details</div>
                    <div className="form__row__col__input">
                      <input
                        type="text"
                        placeholder="Type more details"
                        value={data.description ? data.description : ''}
                        onChange={(e) =>
                          setData({ ...data, description: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="form__row__col">
                    <div className="form__row__col__label">
                      FOC percentage(%)
                    </div>
                    <div className="form__row__col__input">
                      <input
                        type="number"
                        id="percentageInput"
                        name="percentage"
                        min="0"
                        max="100"
                        step="1"
                        value={data.foc_percentage ? data.foc_percentage : ''}
                        onChange={(e) =>
                          setData({ ...data, foc_percentage: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="form__btn">
                  <div className="form__btn__container">
                    <button
                      className="btnEdit"
                      onClick={(e) => handleSubmit(e)}
                    >
                      save
                    </button>
                    <button className="btnSave" onClick={(e) => handleClear(e)}>
                      clear
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        ''
      )}

      <div className="page__pcont__row">
        <div style={{ width: '100%' }}>
          <AllCategories
            success={success}
            set_success={setSuccess}
            user={props.user}
          />
        </div>
      </div>
    </div>
  );
};

export default Category;
