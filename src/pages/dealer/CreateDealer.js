import React, { useState, forwardRef, useRef, useEffect } from 'react';
import { axiosInstance } from '../../axiosInstance';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import Spinner from '../../components/loadingSpinner/Spinner';
import FileUpload from '../../components/fileupload/FileUpload';

const ShowMessage = React.forwardRef((props, ref) => {
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

const CreateDealer = (props) => {
  const inputRef = useRef(null);
  const [show_message, setShowMsg] = useState(false);
  const [show_upload, setShowUplod] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [psas, setPsas] = useState([]);
  const [dealer_category, setDealerCategory] = useState([]);
  const [data, setData] = useState({
    added_by: JSON.parse(sessionStorage.getItem('user')).id,
    name: '',
    contact_number: '',
    address: '',
    owner_name: '',
    company_number: '',
    owner_personal_number: '',
    owner_home_number: '',
    assistant_name: '',
    assistant_contact_number: '',
    psa: '',
    category: '',
  });

  useEffect(() => {
    setLoading(true);
    setShowMsg(false);
    axiosInstance
      .get('/psa/all/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);
        setPsas(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg('Cannot fetch psa details. Please refresh the page again.');
        setShowMsg(true);
        handleOpen();
      });

    setLoading(true);
    axiosInstance
      .get('/dealer-category/all/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        setLoading(false);
        setDealerCategory(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg(
          'Cannot fetch dealer category details. Please refresh the page again.'
        );
        setShowMsg(true);

        handleOpen();
      });
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setShowMsg(false);

    axiosInstance
      .post('/dealer/add/', data, {
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
        setMsg('Dealer has been created successfully');
        setShowMsg(true);

        handleOpen();
      })
      .catch((err) => {
        setLoading(false);

        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg('Dealer cannot create right now. Please check your data again');
        setShowMsg(true);

        handleOpen();
      });
  };

  const handleClear = (e) => {
    e.preventDefault();

    setData({
      ...data,
      name: '',
      contact_number: '',
      address: '',
      owner_name: '',
      company_number: '',
      owner_personal_number: '',
      owner_home_number: '',
      assistant_name: '',
      assistant_contact_number: '',
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

      {show_message ? (
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
      ) : show_upload ? (
        <Modal open={open} onClose={handleClose}>
          <FileUpload
            close={handleClose}
            ditributor={false}
            inventory={null}
            url={'/dealer/add/excel/'}
          />
        </Modal>
      ) : (
        ''
      )}

      <div className="page__title">
        <p>Dealer Details</p>
      </div>
      <div className="page__pcont">
        <div className="form">
          <form action="">
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Psa</div>
                <div className="form__row__col__input">
                  <select
                    name="psa"
                    onChange={(e) => setData({ ...data, psa: e.target.value })}
                  >
                    <option selected>Select psa</option>
                    {psas.map((item, i) => (
                      <option value={item.id} key={i}>
                        {item.area_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Category</div>
                <div className="form__row__col__input">
                  <select
                    name="psa"
                    onChange={(e) =>
                      setData({ ...data, category: e.target.value })
                    }
                  >
                    <option selected>Select category</option>
                    {dealer_category.map((item, i) => (
                      <option value={item.id} key={i}>
                        {item.category_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Dealer Name</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type name here"
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    value={data.name ? data.name : ''}
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">Contact number</div>
                <div className="form__row__col__input">
                  <input
                    type="tel"
                    placeholder="Type contact number here"
                    onChange={(e) =>
                      setData({ ...data, contact_number: e.target.value })
                    }
                    value={data.contact_number ? data.contact_number : ''}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Address</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type address here"
                    onChange={(e) =>
                      setData({ ...data, address: e.target.value })
                    }
                    value={data.address ? data.address : ''}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Owner Name</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type name here"
                    onChange={(e) =>
                      setData({ ...data, owner_name: e.target.value })
                    }
                    value={data.owner_name ? data.owner_name : ''}
                    required
                  />
                </div>
              </div>
              <div className="form__row__col dontdisp"></div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Owner Contacts</div>

                <div className="specialColumn">
                  <div className="form__row__col__input" style={{ flex: 1 }}>
                    <input
                      type="tel"
                      placeholder="Type company number"
                      onChange={(e) =>
                        setData({ ...data, company_number: e.target.value })
                      }
                      value={data.company_number ? data.company_number : ''}
                      required
                    />
                  </div>

                  <div className="form__row__col__input" style={{ flex: 1 }}>
                    <input
                      type="tel"
                      placeholder="Type personal number"
                      onChange={(e) =>
                        setData({
                          ...data,
                          owner_personal_number: e.target.value,
                        })
                      }
                      value={
                        data.owner_personal_number
                          ? data.owner_personal_number
                          : ''
                      }
                      required
                    />
                  </div>

                  <div className="form__row__col__input" style={{ flex: 1 }}>
                    <input
                      type="tel"
                      placeholder="Type home number"
                      onChange={(e) =>
                        setData({ ...data, owner_home_number: e.target.value })
                      }
                      value={
                        data.owner_home_number ? data.owner_home_number : ''
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__row__col">
                <div className="form__row__col__label">Assistant Name</div>
                <div className="form__row__col__input">
                  <input
                    type="text"
                    placeholder="Type here"
                    onChange={(e) =>
                      setData({ ...data, assistant_name: e.target.value })
                    }
                    value={data.assistant_name ? data.assistant_name : ''}
                    required
                  />
                </div>
              </div>
              <div className="form__row__col">
                <div className="form__row__col__label">
                  Assistant Contact Number
                </div>
                <div className="form__row__col__input">
                  <input
                    type="tel"
                    placeholder="Type here"
                    onChange={(e) =>
                      setData({
                        ...data,
                        assistant_contact_number: e.target.value,
                      })
                    }
                    value={
                      data.assistant_contact_number
                        ? data.assistant_contact_number
                        : ''
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
                <button className="btnEdit" onClick={(e) => handleSave(e)}>
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
    </div>
  );
};

export default CreateDealer;
