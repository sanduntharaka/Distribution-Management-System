import React, { useState, forwardRef, useRef } from 'react';
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import Spinner from '../../components/loadingSpinner/Spinner';
import ViewCategories from './ViewCategories';
import InventoryCategoryUpload from '../../components/fileupload/InventoryCategoryUpload';
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

const DealerCategory = (props) => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [show_message, setShowMsg] = useState(false);
  const [show_upload, setShowUplod] = useState(false);

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
    details: 'No details',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowMsg(true)
    setLoading(true);
    setError(false);
    setSuccess(false);
    axiosInstance
      .post('/dealer-category/create/', data, {
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
        setMsg('Dealer category has been created successfully');
        handleOpen();
      })
      .catch((err) => {
        setLoading(false);

        console.log(err);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg(
          'Delaer category cannot create right now. Please check your data again'
        );
        handleOpen();
      });
  };
  const hanldeFileUpload = (e) => {
    e.preventDefault();
    setShowMsg(false);
    setShowUplod(true);
    handleOpen();
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

      {
        show_upload ? (
          <Modal open={open} onClose={handleClose}>
            <InventoryCategoryUpload
              close={handleClose}
              ditributor={true}
              success={success}
              set_success={setSuccess}
              url={'/dealer-category/create/excel/'}
            />
          </Modal>
        ) : show_message ? <Modal open={open} onClose={handleClose}>
          <ShowMessage
            ref={inputRef}
            handleClose={handleClose}
            success={success}
            error={error}
            title={title}
            msg={msg}
          />
        </Modal> : ''
      }


      {props.user.is_manager || props.user.is_company ? (
        <>
          <div className="page__title">
            <p>Create Dealer Category</p>
          </div>
          <div className="page__pcont">
            <div className="form">
              <form action="">
                <div className="form__row">
                  <div className="form__row__col">
                    <div className="form__row__col__label">Category Title</div>
                    <div className="form__row__col__input">
                      <input
                        type="text"
                        placeholder="Type category title"
                        onChange={(e) =>
                          setData({ ...data, category_name: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form__btn">
                  <div className="form__btn__container">
                    <button className="addBtn" onClick={(e) => hanldeFileUpload(e)}>
                      import
                    </button>
                    <button
                      className="btnEdit"
                      onClick={(e) => handleSubmit(e)}
                    >
                      save
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
          <ViewCategories
            success={success}
            set_success={setSuccess}
            user={props.user}
          />
        </div>
      </div>
    </div>
  );
};

export default DealerCategory;
